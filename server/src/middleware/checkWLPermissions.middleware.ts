import { Context, Next } from "koa";

import { PERMISSIONS_TYPE } from "../constants";
import { Users, WishList } from "../entity";
import { userWishService } from "../services";

export const checkWLPermissions = (permission: PERMISSIONS_TYPE) => {
  return async (ctx: Context, next: Next) => {
    const userId: Users["id"] = ctx.state.user.userId;
    let id: WishList["id"] | undefined = ctx.request.body.id;
    const wishIdParams: WishList["id"] | undefined = ctx.params.wishId;
    const wishIdQuery = ctx.request.query.wishId;

    id = id
      ? id
      : wishIdParams
      ? wishIdParams
      : (wishIdQuery as WishList["id"]);

    const userPermissions = await userWishService
      .createQueryBuilder("user_wish_list")
      .where(
        "user_wish_list.user_id = :userId AND user_wish_list.wish_list_id = :id",
        {
          userId,
          id,
        }
      )
      .select("user_wish_list.permission AS permission")
      .execute();

    if (!userPermissions) {
      ctx.throw(404, "not found");
    }

    const findPermission: undefined | string =
      userPermissions[0].permission.find((item: string) => item == permission);

    const findPermissionEditAll: undefined | string =
      userPermissions[0].permission.find(
        (item: string) => item == PERMISSIONS_TYPE.EDIT_ALL
      );

    permission === "wl_edit_amount" && Boolean(findPermissionEditAll)
      ? await next()
      : findPermission
      ? await next()
      : ctx.throw(404, "missing permission vv");
  };
};
