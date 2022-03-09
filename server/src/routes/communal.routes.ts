import { Context } from "koa";
import router from "koa-joi-router";
import passport from "koa-passport";

import { checkPermissions } from "../middleware";
import { userLogger } from "../libs";
import { communalService } from "../services";
import { ROLES_TYPE, CONTENT_TYPE, STRATEGY_TYPE } from "../constants";
import { communalSchema } from "../validate";
import { Users } from "../entity";

const communalRouter: router.Router = router();
communalRouter.prefix("/communal");

// /api/communal
communalRouter.patch(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, body: communalSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const communal = await communalService.findOne({
        where: { id: ctx.request.body.id },
      });
      userLogger.debug(
        `communal.routes.patch: found communal by timestamp for updating - ${communal}`
      );

      ctx.assert(communal, 404, "Has not found communal by id");

      const updatedCommunal = await communalService.merge(
        communal,
        ctx.request.body
      );
      communalService.save(updatedCommunal);

      userLogger.debug(
        `communal.routes.patch: updating communal - ${updatedCommunal}`
      );
      ctx.body = { message: "Communal was updated successfully." };
    } catch (e: any) {
      userLogger.error(`communal.routes.path: ${e}`);
      ctx.status = e.status || 500;
      ctx.throw(e.status || 500, e.message || "internal server error");
    }
  }
);

// /api/communal
communalRouter.post(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, body: communalSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkPermissions(ROLES_TYPE.USER),
  async (ctx: Context) => {
    try {
      userLogger.debug(
        `communal.routes.post: user's id - ${ctx.state.user.userId}`
      );

      const newCommunal = communalService.create({
        ...ctx.request.body,
        user_id: ctx.state.user.userId,
      });
      userLogger.debug(
        `communal.routes.post: created communal - ${newCommunal}`
      );
      await communalService.save(newCommunal);

      ctx.status = 201;
      ctx.body = {
        message: "Communal has been created",
      };
    } catch (e: any) {
      ctx.status = e.status || 500;
      ctx.throw(e.status || 500, e.message || "internal server error");
    }
  }
);

// /api/communal
communalRouter.get(
  "/",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const communal = await communalService.find({
        where: { user_id: ctx.state.user.userId },
      });
      userLogger.debug(
        `communal.routes.get: found all communal by user : ${communal}`
      );

      ctx.status = 200;
      ctx.body = { communal };
    } catch (e: any) {
      userLogger.error(`communal.routes.get: ${e}`);
      ctx.throw(500, "internal server error");
    }
  }
);

communalRouter.delete(
  "/:id",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkPermissions(ROLES_TYPE.ADMIN),
  async (ctx: Context) => {
    const { id }: { id: Users } = ctx.params;
    try {
      const deleteCommunal = await communalService.find({
        where: { user_id: id },
      });
      console.log(deleteCommunal);

      ctx.assert(
        deleteCommunal.length,
        400,
        "Has not found communal by user`s id"
      );

      await communalService.delete({ user_id: id });

      userLogger.debug(
        `history.routes.delete: communal were deleted successfully`
      );

      ctx.body = { message: "Communal were deleted successfully!" };
    } catch (err: any) {
      userLogger.error(`communal.routes.path: ${err}`);
      ctx.status = err.status || 500;
      ctx.throw(err.status || 500, err.message || "internal server error");
    }
  }
);

export { communalRouter as communalRoutes };
