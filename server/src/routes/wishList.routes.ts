import { Context } from "koa";
import router from "koa-joi-router";
import passport from "koa-passport";
import { getManager } from "typeorm";

import { transfDaTa, userLogger } from "../libs";
import { wishListService, userWishService, historyService } from "../services";
import { CONTENT_TYPE, STRATEGY_TYPE, PERMISSIONS_TYPE } from "../constants";
import { Users, WishList } from "../entity";
import { IExpandWish } from "../types";
import {
  createWishSchema,
  updateByOwnerSchema,
  getWishesSchema,
  connectWishSchema,
  updateFavoriteSchema,
  updateSchema,
  deleteSchema,
} from "../validate";

import { convertWishItems } from "../libs";
import { checkWLPermissions } from "../middleware";

const wishListRouter: router.Router = router();
wishListRouter.prefix("/wish");

//api/wish
wishListRouter.post(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, body: createWishSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { photo, title, description, isFavorite, totalAmount } =
        ctx.request.body;
      const newWishItem = wishListService.create({
        photo,
        title,
        description,
        total_amount: totalAmount,
      });

      await getManager().transaction(async (transactionalEntityManager) => {
        const wishItem: WishList = (await transactionalEntityManager.save(
          newWishItem
        )) as unknown as WishList;
        const userWishItem = userWishService.create({
          wish_list_id: wishItem.id,
          user_id: ctx.state.user.userId,
          is_favorite: isFavorite,
          is_owner: true,
          permission: [
            PERMISSIONS_TYPE.READ,
            PERMISSIONS_TYPE.EDIT_ALL,
            PERMISSIONS_TYPE.DELETE,
            PERMISSIONS_TYPE.ADD,
          ],
        });
        await transactionalEntityManager.save(userWishItem);
      });

      ctx.status = 201;
      ctx.body = { message: "Wish has been created" };
      userLogger.debug(`wish.routes.post: Wish has been created`);
    } catch (error: any) {
      userLogger.error(`wish.routes.post: ${error}`);

      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/wish/:user_id - create wish for user
wishListRouter.post(
  "/:user_id",
  { validate: { type: CONTENT_TYPE.JSON, body: connectWishSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { wishId } = ctx.request.body;
      const { user_id }: { user_id: Users["id"] } = ctx.params;

      const wish = await wishListService
        .createQueryBuilder("wish_list")
        .where({ id: wishId })
        .execute();

      ctx.assert(wish, 404, "Has not found the wish");

      const userConnection = await userWishService
        .createQueryBuilder("user_wish_list")
        .where({ wish_list_id: wishId })
        .andWhere({ user_id })
        .getOne();

      ctx.assert(
        !userConnection,
        403,
        "User already has connected to wish item"
      );

      const userWishItem = userWishService.create({
        wish_list_id: wishId,
        user_id: user_id,
        permission: [PERMISSIONS_TYPE.READ, PERMISSIONS_TYPE.EDIT],
      });

      await userWishService.save(userWishItem);

      ctx.status = 201;
      ctx.body = {
        message: "Connection to the wish has been created",
      };
      userLogger.debug(
        `wish.routes.post:wish_id: Connection to the wish item has been created`
      );
    } catch (error: any) {
      userLogger.error(`wish.routes.post:wish_id: ${error}`);

      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/wish - get wishes
wishListRouter.get(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, query: getWishesSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { byOwner } = ctx.request.query;

      if (byOwner === "true") {
        const wishes: IExpandWish[] = await wishListService
          .getWishByUserId(
            ctx.state.user.userId,
            true,
            "user_wish_list.is_owner, wish_list.title, wish_list.description, wish_list.photo, wish_list.id, wish_list.current_amount, wish_list.total_amount, user_wish_list.is_favorite "
          )
          .execute();

        ctx.assert(wishes, 404, "Has not found the wishes by owner");

        ctx.status = 200;
        ctx.body = {
          wishList: convertWishItems(wishes),
        };
      } else if (byOwner === "false") {
        const wishes: IExpandWish[] = await wishListService
          .getWishByUserId(
            ctx.state.user.userId,
            false,
            "wish_list.title, wish_list.description, wish_list.photo, wish_list.id, user_wish_list.is_owner, wish_list.current_amount, wish_list.total_amount, user_wish_list.is_favorite "
          )

          .execute();

        ctx.assert(wishes, 404, "Has not found the user's wishes");

        ctx.body = {
          wishList: convertWishItems(wishes),
        };
      } else {
        const wishes: IExpandWish[] = await wishListService
          .getWishByUserId(ctx.state.user.userId)
          .select(
            "wish_list.title, wish_list.description, wish_list.photo, wish_list.id, user_wish_list.is_owner, wish_list.current_amount, wish_list.total_amount, user_wish_list.is_favorite "
          )
          .execute();

        ctx.body = {
          wishList: convertWishItems(wishes),
        };
      }

      userLogger.debug(`wish.routes.get: Wishes has been got`);
    } catch (error: any) {
      userLogger.error(`wish.routes.get: ${error}`);
      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/wish - update wish with flag (byOwner)
wishListRouter.patch(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, body: updateByOwnerSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkWLPermissions(PERMISSIONS_TYPE.EDIT_ALL),

  async (ctx: Context) => {
    try {
      const { photo, title, description, totalAmount, id, currentAmount } =
        ctx.request.body;

      let wish = await wishListService
        .createQueryBuilder("wish_list")
        .select()
        .where("wish_list.id = :id", {
          id,
        })
        .execute();

      ctx.assert(wish, 404, "Has not found the wish by user");

      wish = transfDaTa(wish, "wish_list_")[0];

      const updatedWishItem = await wishListService.merge(
        wish as unknown as WishList,
        {
          photo,
          title,
          description,
          total_amount: totalAmount,
          current_amount: currentAmount,
        }
      );
      wishListService.save(updatedWishItem);

      ctx.status = 200;
      ctx.body = { message: "Wish has been updated" };

      userLogger.debug(`wish.routes.patch: Wish has been updated`);
    } catch (error: any) {
      userLogger.error(`wish.routes.patch: ${error}`);
      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

// wish/:wishId/amount
wishListRouter.patch(
  "/:wishId/amount",
  { validate: { type: CONTENT_TYPE.JSON, body: updateSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkWLPermissions(PERMISSIONS_TYPE.EDIT),

  async (ctx: Context) => {
    try {
      const { wishId }: { wishId: WishList["id"] } = ctx.params;

      let { currentAmount } = ctx.request.body;

      let wish = await wishListService
        .createQueryBuilder("wish_list")
        .select()
        .where("wish_list.id = :id", {
          id: wishId,
        })
        .execute();

      ctx.assert(wish, 404, "Has not found the wish by user");

      wish = transfDaTa(wish, "wish_list_")[0];
      currentAmount += Number(wish.current_amount);

      const updatedWishItem = await wishListService.merge(
        wish as unknown as WishList,
        {
          current_amount: currentAmount,
        }
      );
      wishListService.save(updatedWishItem);
      const newHistory = historyService.create({
        type: "expense",
        amount: currentAmount,
        wish_list: wishId,
        user: ctx.state.user.userId,
      });

      ctx.body = {
        message: "Wish has been updated",
        wish,
      };

      await historyService.save(newHistory);
    } catch (error: any) {
      userLogger.error(`wish.routes.patch: wishId/amount: ${error}`);
      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/wish/:wishId - update isFavorite column
wishListRouter.patch(
  "/:wishId",
  { validate: { type: CONTENT_TYPE.JSON, body: updateFavoriteSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { isFavorite } = ctx.request.body;
      const { wishId }: { wishId: string } = ctx.params;
      const user_id = ctx.state.user.userId;

      await userWishService
        .createQueryBuilder("user_wish_list")
        .where({ wish_list_id: wishId })
        .andWhere({ user_id })
        .update({ is_favorite: isFavorite })
        .execute();

      ctx.status = 200;
      ctx.body = {
        message: "Wish has been updated",
      };

      userLogger.debug(`wish.routes.patch:wishId: Wish has been updated`);
    } catch (error: any) {
      userLogger.error(`wish.routes.patch:wishId: ${error}`);
      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/wish/delete/:wishId
wishListRouter.delete(
  "/:wishId",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkWLPermissions(PERMISSIONS_TYPE.DELETE),
  async (ctx: Context) => {
    try {
      const id: WishList["id"] = ctx.params.wishId;
      const wish = await wishListService
        .createQueryBuilder("wish_list")
        .select()
        .where("wish_list.id = :id", {
          id,
        })
        .execute();

      ctx.assert(wish, 404, "Has not found the wish by user");

      await wishListService
        .createQueryBuilder("wish_list")
        .delete()
        .where("wish_list.id = :id", {
          id,
        })
        .execute();

      ctx.body = {
        message: "Wish has been deleted",
      };

      userLogger.debug(`wish.routes.delete:wishId: Wish has been deleted`);
    } catch (error: any) {
      userLogger.error(`wish.routes.delete: ${error}`);
      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/wish/delete/ - with query(wishId) - delete connection
wishListRouter.delete(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, query: deleteSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkWLPermissions(PERMISSIONS_TYPE.READ),
  async (ctx: Context) => {
    try {
      const { wishId } = ctx.request.query;
      const result = await wishListService
        .createQueryBuilder("user_wish_list")
        .delete()
        .from("user_wish_list")
        .where(
          "user_wish_list.user_id = :userId AND user_wish_list.wish_list_id = :id",
          {
            id: wishId,
            userId: ctx.state.user.userId,
          }
        )
        .execute();

      ctx.body = {
        message: "Connection to the wish has been deleted",
        result,
      };
      userLogger.debug(`wish.routes.delete: Wish has been deleted`);
    } catch (error: any) {
      userLogger.error(`wish.routes.delete: ${error}`);
      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

export { wishListRouter as wishListRouters };
