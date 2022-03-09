import {
  DeleteResult,
  FindConditions,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from "typeorm";

import { UserWishList } from "./../entity";
import { userLogger } from "../libs";

interface IUserWishService {
  create: (params: Partial<UserWishList>) => UserWishList;
  delete: (
    params: Partial<UserWishList> | FindConditions<UserWishList>
  ) => Promise<DeleteResult>;
  createQueryBuilder: (params: string) => SelectQueryBuilder<UserWishList>;
  save: (
    params: Partial<UserWishList>
  ) => Promise<Partial<UserWishList> & UserWishList>;
}

export class UserWishService implements IUserWishService {
  private _repository: Repository<UserWishList>;

  private get repository(): Repository<UserWishList> {
    if (!this._repository) {
      this.repository = getRepository(UserWishList);
    }
    return this._repository;
  }

  private set repository(repository: Repository<UserWishList>) {
    this._repository = repository;
  }

  create(params: Partial<UserWishList>): UserWishList {
    try {
      userLogger.debug("userWishService.create", params);
      return this.repository.create(params);
    } catch (e) {
      userLogger.error("userWishService.create", e);
      throw e;
    }
  }

  delete(
    params: Partial<UserWishList> | FindConditions<UserWishList>
  ): Promise<DeleteResult> {
    try {
      userLogger.debug("userWishService.delete", params);
      return this.repository.delete(params);
    } catch (e) {
      userLogger.error("userWishService.delete", e);
      throw e;
    }
  }

  createQueryBuilder(params: string): SelectQueryBuilder<UserWishList> {
    try {
      userLogger.debug("userWishService.createQueryBuilder", params);
      return this.repository.createQueryBuilder(params);
    } catch (e) {
      userLogger.error("userWishService.createQueryBuilder", e);
      throw e;
    }
  }

  save(
    params: Partial<UserWishList>
  ): Promise<Partial<UserWishList> & UserWishList> {
    try {
      userLogger.debug("userWishService.save", params);
      return this.repository.save(params);
    } catch (e) {
      userLogger.error("userWishService.save", e);
      throw e;
    }
  }
}

export const userWishService = new UserWishService();
