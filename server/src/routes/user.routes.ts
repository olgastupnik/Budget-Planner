import { Context } from "koa";
import router from "koa-joi-router";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "koa-passport";

import Config from "../env";
import { userService } from "../services";
import { checkPermissions } from "../middleware";
import { userLogger } from "../libs";
import { loginSchema, registrSchema, passwordSchema } from "../validate";
import { CONTENT_TYPE, ROLES_TYPE, STRATEGY_TYPE } from "../constants";

const userRouter: router.Router = router();
userRouter.prefix("/user");

userRouter.post(
  "/register",
  { validate: { type: CONTENT_TYPE.JSON, body: registrSchema } },
  async (ctx: Context) => {
    try {
      const { email, password, firstName, lastName, role } = ctx.request.body;

      const candidate = await userService.findOne({ where: { email } });
      userLogger.debug(
        `user.routes.register: found candidate by email: ${candidate}`
      );

      ctx.assert(!candidate, 400, "User has already existed");

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = userService.create({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role,
      });

      userLogger.debug(`user.routes.register: Create new user: ${newUser}`);
      await userService.save(newUser);

      ctx.status = 201;
      ctx.body = { message: "User has been created" };
    } catch (e: any) {
      userLogger.error(`user.routes.register: ${e}`);

      ctx.status = e.status || 500;
      ctx.throw(e.status || 500, e.message || "internal server error");
    }
  }
);

userRouter.post(
  "/login",
  { validate: { type: CONTENT_TYPE.JSON, body: loginSchema } },
  async (ctx: Context) => {
    try {
      const { email, password } = ctx.request.body;

      const user = await userService.findOne({ where: { email } });
      userLogger.debug(`user.routes.login: found user by email: ${user}`);

      ctx.assert(user, 404, "Cannot find User");
      const { id, first_name, last_name, avatar, budget_amount } = user;
      const isMatch = await bcrypt.compare(password, user.password);

      ctx.assert(isMatch, 400, "Incorrect password, try again");

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        Config.secretKey,
        {
          expiresIn: "24h",
        }
      );
      token
        ? (ctx.body = {
            token,
            user: {
              id,
              first_name,
              last_name,
              email: user.email,
              avatar,
              budget_amount,
            },
          })
        : (ctx.body = { message: "Something went wrong, try again" });
    } catch (e: any) {
      userLogger.error(`user.routes.login: ${e}`);
      ctx.throw(e.status || 500, e.message || "internal server error");
    }
  }
);

userRouter.get(
  "/",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const user = await userService.findOne(ctx.state.user.userId);
      userLogger.debug(`user.routes.get: found user by id: ${user}`);

      ctx.assert(user, 404, "Can`t find user");

      const { id, first_name, last_name, email, avatar, budget_amount } = user!;

      ctx.status = 200;
      ctx.body = {
        id,
        firstName: first_name,
        lastName: last_name,
        email,
        avatar,
        budgetAmount: budget_amount,
      };
    } catch (e: any) {
      userLogger.error(`user.routes.get: ${e}`);
      ctx.throw(e.status || 500, e.message || "internal server error");
    }
  }
);

userRouter.patch(
  "/",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { userId } = ctx.state.user;

      const user = await userService.findOne(userId);
      userLogger.debug(`user.routes.patch: found user by id: ${user}`);

      ctx.assert(user, 404, "Cannot find User");

      const { firstName, lastName, budgetAmount, email, avatar, id } =
        ctx.request.body;

      const updatedUser = await userService.merge(user, {
        id,
        first_name: firstName,
        last_name: lastName,
        email,
        avatar,
        budget_amount: budgetAmount,
      });
      userService.save(updatedUser);

      userLogger.debug(`user.routes.patch: updating user: ${updatedUser}`);
      ctx.status = 200;
      ctx.body = { message: "User was updated successfully" };
    } catch (err: any) {
      userLogger.error(`user.routes.patch : ${err}`);

      ctx.throw(err.status || 500, err.message || "internal server error");
    }
  }
);

userRouter.patch(
  "/:userId",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkPermissions(ROLES_TYPE.ADMIN),
  async (ctx: Context) => {
    const { userId }: { userId: string } = ctx.params;
    try {
      const user = await userService.findOne({ where: { id: userId } });
      userLogger.debug(`user.routes.patch: found user by id: ${user}`);

      ctx.assert(user, 404, "Cannot find User");

      const { firstName, lastName, budgetAmount, email, avatar, id } =
        ctx.request.body;

      const updatedUser = await userService.merge(user, {
        id,
        first_name: firstName,
        last_name: lastName,
        email,
        avatar,
        budget_amount: budgetAmount,
      });
      userService.save(updatedUser);

      userLogger.debug(`user.routes.patch: updating user: ${updatedUser}`);
      ctx.status = 200;
      ctx.body = { message: "User was updated successfully" };
    } catch (err: any) {
      userLogger.error(`user.routes.patch : ${err}`);

      ctx.throw(err.status || 500, err.message || "internal server error");
    }
  }
);

userRouter.delete(
  "/:id",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkPermissions(ROLES_TYPE.ADMIN),
  async (ctx: Context) => {
    const { id }: { id: string } = ctx.params;
    try {
      const user = await userService.delete(id);

      ctx.assert(user.raw.length, 404, "User by id wasn't found");

      userLogger.debug(
        `user.routes.delete.byId: user by id was deleted successfully`
      );
      ctx.body = { message: "User was deleted successfully!", user };
    } catch (err: any) {
      userLogger.debug(`user.routes.delete.byId: ${err}`);

      ctx.throw(err.status || 500, err.message);
    }
  }
);

userRouter.patch(
  "/avatar",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { userId } = ctx.state.user;
      const file = ctx.file;
      userLogger.debug(`user.routes.patch.avatar: uploaded file: ${file}`);
      const user = await userService.findOne({
        where: { id: userId },
      });
      ctx.assert(user, 404, "Cannot find User");
      userLogger.debug(`user.routes.patch.avatar: uploaded file: ${user}`);

      const updatedUser = await userService.merge(user, {
        avatar: file.originalname,
      });
      userService.save(updatedUser);

      ctx.body = { file };
    } catch (err: any) {
      userLogger.debug(`user.routes.patch.avatar: ${err}`);
      ctx.throw(err.status || 500, err.message || "internal server error");
    }
  }
);

userRouter.patch(
  "/password/repeat",
  { validate: { type: CONTENT_TYPE.JSON, body: passwordSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const user = await userService.findOne(ctx.state.user.userId);
      userLogger.debug(`user.routes.patch: found user by id: ${user}`);

      ctx.assert(user, 404, "Cannot find User");

      const { password, repeatedPassword } = ctx.request.body;

      const isMatch = await bcrypt.compare(password, user.password);

      ctx.assert(!isMatch, 400, "New passport must be different from current");

      if (password !== repeatedPassword) {
        userLogger.debug(`user.routes.patch: Not the same passwords`);
        ctx.throw(400, "Enter the same passwords");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const updatedUser = await userService.merge(user, {
        id: ctx.state.user.userId,
        password: hashedPassword,
      });
      userService.save(updatedUser);

      userLogger.debug(`user.routes.patch: updating password`);
      ctx.status = 200;
      ctx.body = {
        message: "User was updated successfully",
      };
    } catch (err: any) {
      userLogger.error(`user.routes.patch : ${err}`);

      ctx.throw(err.status || 500, err.message || "internal server error");
    }
  }
);

export { userRouter as userRoutes };
