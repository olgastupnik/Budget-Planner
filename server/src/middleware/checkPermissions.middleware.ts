import { Context, Next } from "koa";

import { ROLES_TYPE } from "../constants";
import { Users } from "../entity";

export const checkPermissions = (role: ROLES_TYPE) => {
  return async (ctx: Context, next: Next) => {
    const user: Users = ctx.state.user;
    if (user.role !== role) {
      ctx.throw(404, "missing permission");
    }
    await next();
  };
};
