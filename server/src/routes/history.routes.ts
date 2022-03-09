import { Context } from "koa";
import router from "koa-joi-router";
import passport from "koa-passport";
import Config from "../env";
import { checkPermissions } from "../middleware";
import { historyService } from "../services";
import { userLogger, transfDaTa } from "../libs";
import {
  createHistorySchema,
  deleteHistorySchema,
  deleteHistoryAdminSchema,
} from "../validate";
import { CONTENT_TYPE, ROLES_TYPE, STRATEGY_TYPE } from "../constants";
import { Users, History } from "../entity";

const historyRouter: router.Router = router();
historyRouter.prefix("/history");

// /api/history
historyRouter.post(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, body: createHistorySchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const newHistory = historyService.create({
        ...ctx.request.body,
        user: ctx.state.user.userId,
      });

      await historyService.save(newHistory);

      ctx.status = 201;
      userLogger.debug(
        `history.routes.post: create new history - ${newHistory}`
      );
      ctx.body = { message: "create new history" };
    } catch (e: any) {
      userLogger.debug(`history.routes.post: ${e}`);
      ctx.throw(500, "internal server error");
    }
  }
);

// /api/history
historyRouter.get(
  "/",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { page, limit, category, type } = ctx.request.query;

      const take: number = limit ? Number(limit) : Number(Config.limit);
      let skip: number;
      if (page) {
        skip = Number(page) <= 1 ? 0 : (Number(page) - 1) * take;
      } else {
        skip = Config.skip;
      }

      const query = historyService
        .createQueryBuilder("history")
        .where({ user: ctx.state.user.userId });

      const allHistories = await query.execute();

      if (category) {
        query.andWhere({ category });
      }

      if (type) {
        query.andWhere({ type });
      }
      const histories = await query.offset(skip).limit(take).execute();
      userLogger.debug(
        `history.routes.get: found histories by user's id ${histories}`
      );
      const renameHistories = transfDaTa(histories, "history_");

      ctx.body = {
        histories: renameHistories,
        historiesLength: allHistories.length,
      };
    } catch (err: any) {
      userLogger.debug(`history.routes.get: ${err}`);
      ctx.throw(err.status || 500, err.message || "internal server error");
    }
  }
);

// api/history/:userId
historyRouter.delete(
  "/:userId",
  { validate: { type: CONTENT_TYPE.JSON, query: deleteHistoryAdminSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkPermissions(ROLES_TYPE.ADMIN),
  async (ctx: Context) => {
    const { userId }: { userId: Users } = ctx.params;
    try {
      const { ids, deleteAll } = ctx.request.query;

      if (ids) {
        await historyService.delete(ids);
        userLogger.debug(
          `history.routes.delete: histories were deleted successfully`
        );
      }

      if (deleteAll === "true") {
        await historyService.delete({ user: userId });
        userLogger.debug(
          `history.routes.delete: All histories were deleted successfully`
        );
      }

      ctx.body = { message: "History was deleted successfully!" };
    } catch (err: any) {
      userLogger.debug(`history.routes.delete.byId: ${err}`);

      ctx.throw(err.status || 500, err.message || "internal server error");
    }
  }
);

//history
historyRouter.delete(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, query: deleteHistorySchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { ids, deleteAll } = ctx.request.query;
      const type: Partial<History["type"]> | undefined = ctx.request.query
        .type as Partial<History["type"]>;

      if (ids) {
        await historyService.delete(ids);
        userLogger.debug(
          `history.routes.delete: histories were deleted successfully`
        );
        ctx.body = { message: "Histories were deleted successfully!" };
      }

      if (type) {
        await historyService.delete({ type });
        userLogger.debug(
          `history.routes.delete: histories were deleted successfully by type`
        );
      }

      if (deleteAll === "true") {
        await historyService.delete({ user: ctx.state.user.userId });
        userLogger.debug(
          `history.routes.delete: All histories were deleted successfully`
        );
        ctx.body = { message: "Histories were deleted successfully!" };
      }
    } catch (err) {
      userLogger.debug(`history.routes.delete: ${err}`);
      ctx.throw(500, "internal server error");
    }
  }
);

export { historyRouter as historyRoutes };
