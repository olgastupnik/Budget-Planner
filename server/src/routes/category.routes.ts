import { Context } from "koa";
import { getManager, Like, Brackets } from "typeorm";
import router from "koa-joi-router";
import passport from "koa-passport";

import { checkPermissions } from "../middleware";
import { Category } from "../entity";
import { userCategoryService, categoryService } from "../services";
import { transfDaTa, userLogger } from "../libs";
import {
  categorySchema,
  deleteCategoryAdminSchema,
  categoryAdminSchema,
  deleteCategorySchema,
} from "../validate";
import { CONTENT_TYPE, ROLES_TYPE, STRATEGY_TYPE } from "../constants";

const categoryRouter: router.Router = router();
categoryRouter.prefix("/category");

//api/category
categoryRouter.post(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, body: categorySchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const { body } = ctx.request;
      const categories = categoryService.create({
        ...body,
      });

      await getManager().transaction(async (transactionalEntityManager) => {
        const cat: Category = (await transactionalEntityManager.save(
          categories
        )) as unknown as Category;
        const userCategory = userCategoryService.create({
          category_id: cat.id,
          user_id: ctx.state.user.userId,
        });
        await transactionalEntityManager.save(userCategory);
      });

      ctx.status = 201;
      ctx.body = { message: "Category has been created" };
      userLogger.debug(`category.routes.post: Category has been created`);
    } catch (error: any) {
      userLogger.error(`category.routes.post: ${error}`);

      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);
//api/category/admin
categoryRouter.post(
  "/admin",
  { validate: { type: CONTENT_TYPE.JSON, body: categoryAdminSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkPermissions(ROLES_TYPE.ADMIN),
  async (ctx: Context) => {
    try {
      const { body } = ctx.request;
      const category = categoryService.create({
        ...body,
      });
      await categoryService.save(category);

      ctx.status = 201;
      ctx.body = { message: "Category has been created" };
      userLogger.debug(
        `category.routes.post: Default category has been created`
      );
    } catch (error: any) {
      userLogger.error(`category.routes.post: ${error}`);

      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/category/
categoryRouter.get(
  "/",
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const search = ctx.request.query.search;

      const query = categoryService.getCategoryByUserId(ctx.state.user.userId);

      if (search) {
        query.andWhere([
          { title: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
        ]);
      }

      const categories = await query.execute();
      let renameCategories = transfDaTa(categories, "category_");
      renameCategories = renameCategories.map((item) => {
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          isDefault: item.is_default,
        };
      });
      ctx.body = { categories: renameCategories };
      userLogger.debug(
        `category.routes.get: Category has been received: ${[categories]}`
      );
    } catch (error: any) {
      userLogger.error(`category.routes.get: ${error}`);

      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

//api/category/
categoryRouter.delete(
  "/",
  { validate: { type: CONTENT_TYPE.JSON, query: deleteCategorySchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  async (ctx: Context) => {
    try {
      const id: Partial<Category["id"]> | undefined = ctx.request.query
        .id as Partial<Category["id"]>;
      const { clear } = ctx.request.query;

      if (id) {
        const category = await categoryService.findOneById(id);

        ctx.assert(category, 404, " Category wasn't found");

        const result = await userCategoryService
          .createQueryBuilder("user_categories")
          .delete()
          .where({ category_id: id })
          .andWhere({ user_id: ctx.state.user.userId })
          .execute();

        ctx.body = {
          message: "Category was deleted successfully!",
          details: result,
        };
      }

      if (clear) {
        const result = await userCategoryService.delete({
          user_id: ctx.state.user.userId,
        });
        ctx.body = {
          message: "All categories has been deleted successfully",
          details: result,
        };
        userLogger.debug(`category.routes.delete: Category has been deleted`);
      }
    } catch (error: any) {
      userLogger.error(`category.routes.delete: ${error}`);

      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

// category/admin
categoryRouter.delete(
  "/admin",
  { validate: { type: CONTENT_TYPE.JSON, query: deleteCategoryAdminSchema } },
  passport.authenticate(STRATEGY_TYPE.BEARER_STRATEGY, { session: false }),
  checkPermissions(ROLES_TYPE.ADMIN),
  async (ctx: Context) => {
    try {
      const { ids } = ctx.request.query;
      const clear = ctx.request.query.clear;

      if (ids) {
        await categoryService.delete(ids);
        userLogger.debug(
          `history.routes.delete: histories were deleted successfully by id`
        );
      }

      if (clear && clear === "true") {
        await categoryService.delete({ is_default: true });
        userLogger.debug(
          `history.routes.delete: All default histories were deleted successfully`
        );
      }

      ctx.body = {
        message: "Category was deleted successfully!",
      };

      userLogger.debug(
        `category.routes.delete.byId: Category was deleted successfully!`
      );
    } catch (error: any) {
      userLogger.error(`category.routes.delete.byId: ${error}`);

      ctx.throw(error.status || 500, error.message || "internal server error");
    }
  }
);

export { categoryRouter as categoryRoutes };
