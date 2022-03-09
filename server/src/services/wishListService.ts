import {
  Brackets,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from "typeorm";

import { Users, WishList } from "../entity";
import { userLogger } from "../libs";

interface IWishListService {
  findOne: (params: FindOneOptions<WishList>) => Promise<WishList | undefined>;
  find: (params: FindManyOptions<WishList>) => Promise<WishList[]>;
  create: (params: Partial<WishList>) => WishList;
  merge: (user: WishList, params: Partial<WishList>) => WishList;
  save: (params: Partial<WishList>) => Promise<Partial<WishList> & WishList>;
  delete: (
    params: Partial<WishList> | FindConditions<WishList> | string
  ) => Promise<DeleteResult>;
  createQueryBuilder?: (params: string) => SelectQueryBuilder<WishList>;
  getWishByUserId: (
    userId: Users["id"],
    is_owner?: boolean,
    select?: string
  ) => SelectQueryBuilder<WishList>;
}

export class WishListService implements IWishListService {
  private _repository: Repository<WishList>;

  private get repository(): Repository<WishList> {
    if (!this._repository) {
      this.repository = getRepository(WishList);
    }
    return this._repository;
  }

  private set repository(repository: Repository<WishList>) {
    this._repository = repository;
  }

  findOne(params: FindOneOptions<WishList>): Promise<WishList | undefined> {
    try {
      userLogger.debug("wishListService.findOne", params);
      return this.repository.findOne(params);
    } catch (e) {
      userLogger.error("wishListService.findOne", e);
      throw e;
    }
  }

  find(params: FindManyOptions<WishList>): Promise<WishList[]> {
    try {
      userLogger.debug("wishListService.find", params);
      return this.repository.find(params);
    } catch (e) {
      userLogger.error("wishListService.find", e);
      throw e;
    }
  }

  create(params: Partial<WishList>): WishList {
    try {
      userLogger.debug("wishListService.create", params);
      return this.repository.create(params);
    } catch (e) {
      userLogger.error("wishListService.create", e);
      throw e;
    }
  }

  merge(user: WishList, params: Partial<WishList>): WishList {
    try {
      userLogger.debug("wishListService.merge", params);
      return this.repository.merge(user, { ...params });
    } catch (e) {
      userLogger.error("wishListService.merge", e);
      throw e;
    }
  }

  save(params: Partial<WishList>): Promise<Partial<WishList> & WishList> {
    try {
      userLogger.debug("wishListService.save", params);
      return this.repository.save(params);
    } catch (e) {
      userLogger.error("wishListService.save", e);
      throw e;
    }
  }

  delete(
    params: Partial<WishList> | FindConditions<WishList> | string
  ): Promise<DeleteResult> {
    try {
      userLogger.debug("wishListService.delete", params);
      return this.repository.delete(params);
    } catch (e) {
      userLogger.error("wishListService.delete", e);
      throw e;
    }
  }

  createQueryBuilder(params: string): SelectQueryBuilder<WishList> {
    try {
      userLogger.debug("wishListService.createQueryBuilder", params);
      return this.repository.createQueryBuilder(params);
    } catch (e) {
      userLogger.error("wishListService.createQueryBuilder", e);
      throw e;
    }
  }

  getWishByUserId(
    userId: Users["id"],
    is_owner?: true | false,
    select?: string
  ): SelectQueryBuilder<WishList> {
    try {
      userLogger.debug("wishListService.getWishByUserId", userId);
      const query = this.repository
        .createQueryBuilder("wish_list")
        .leftJoinAndSelect(
          "user_wish_list",
          "user_wish_list",
          "wish_list.id = user_wish_list.wish_list_id"
        )
        .where(
          new Brackets((qb) => {
            qb.orWhere("user_wish_list.user_id = :userId", {
              userId,
            });
          })
        );

      typeof is_owner === "boolean"
        ? query.andWhere("user_wish_list.is_owner = :is_owner", {
            is_owner,
          })
        : query;
      return select ? query.select(select) : query;
    } catch (e) {
      userLogger.error("wishListService.getWishByUserId", e);
      throw e;
    }
  }
}

export const wishListService = new WishListService();
