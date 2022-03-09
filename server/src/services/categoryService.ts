import {
  Brackets,
  DeleteResult,
  FindConditions,
  FindOneOptions,
  getRepository,
  ObjectID,
  Repository,
  SelectQueryBuilder,
} from "typeorm";

import { Category, Users } from "../entity";
import { userLogger } from "../libs";

interface ICategoryService {
  findOne: (params: FindOneOptions<Category>) => Promise<Category | undefined>;
  findOneById: (id: string | ObjectID) => Promise<Category | undefined>;
  create: (params: Partial<Category>) => Category;
  save: (params: Partial<Category>) => Promise<Partial<Category> & Category>;
  delete: (
    params: Partial<Category> | FindConditions<Category> | string | string[]
  ) => Promise<DeleteResult>;
  createQueryBuilder: (params: string) => SelectQueryBuilder<Category>;
  getCategoryByUserId: (userId: Users["id"]) => SelectQueryBuilder<Category>;
}

export class CategoryService implements ICategoryService {
  private _repository: Repository<Category>;

  private get repository(): Repository<Category> {
    if (!this._repository) {
      this.repository = getRepository(Category);
    }
    return this._repository;
  }

  private set repository(repository: Repository<Category>) {
    this._repository = repository;
  }

  findOne(params: FindOneOptions<Category>): Promise<Category | undefined> {
    try {
      userLogger.debug("categoryService.findOne", params);
      return this.repository.findOne(params);
    } catch (e) {
      userLogger.error("categoryService.findOne", e);
      throw e;
    }
  }

  findOneById(id: string | ObjectID): Promise<Category | undefined> {
    try {
      userLogger.debug("categoryService.findOneById", id);
      return this.repository.findOne(id);
    } catch (e) {
      userLogger.error("categoryService.findOneById", e);
      throw e;
    }
  }

  create(params: Partial<Category>): Category {
    try {
      userLogger.debug("categoryService.create", params);
      return this.repository.create(params);
    } catch (e) {
      userLogger.error("categoryService.create", e);
      throw e;
    }
  }

  delete(
    params: Partial<Category> | FindConditions<Category> | string | string[]
  ): Promise<DeleteResult> {
    try {
      userLogger.debug("categoryService.delete", params);
      return this.repository.delete(params);
    } catch (e) {
      userLogger.error("categoryService.delete", e);
      throw e;
    }
  }

  save(params: Partial<Category>): Promise<Partial<Category> & Category> {
    try {
      userLogger.debug("categoryService.save", params);
      return this.repository.save(params);
    } catch (e) {
      userLogger.error("categoryService.save", e);
      throw e;
    }
  }

  createQueryBuilder(params: string): SelectQueryBuilder<Category> {
    try {
      userLogger.debug("categoryService.createQueryBuilder", params);
      return this.repository.createQueryBuilder(params);
    } catch (e) {
      userLogger.error("categoryService.createQueryBuilder", e);
      throw e;
    }
  }

  getCategoryByUserId(userId: Users["id"]): SelectQueryBuilder<Category> {
    try {
      userLogger.debug("categoryService.getCategoryByUserId");
      return this.createQueryBuilder("category")
        .leftJoin(
          "user_categories",
          "user_categories",
          "category.id = user_categories.category_id"
        )
        .where(
          new Brackets((qb) => {
            qb.orWhere({ is_default: true });
            qb.orWhere("user_categories.user_id = :userId", {
              userId,
            });
          })
        );
    } catch (e) {
      userLogger.error("categoryService.getCategoryByUserId", e);
      throw e;
    }
  }
}

export const categoryService = new CategoryService();
