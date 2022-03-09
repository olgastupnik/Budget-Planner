import { UserCategory } from "../entity";
import {
  DeleteResult,
  FindConditions,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { userLogger } from "../libs";

interface IUserCategoryService {
  create: (params: Partial<UserCategory>) => UserCategory;
  delete: (
    params: Partial<UserCategory> | FindConditions<UserCategory>
  ) => Promise<DeleteResult>;
  createQueryBuilder: (params: string) => SelectQueryBuilder<UserCategory>;
}

export class UserCategoryService implements IUserCategoryService {
  private _repository: Repository<UserCategory>;

  private get repository(): Repository<UserCategory> {
    if (!this._repository) {
      this.repository = getRepository(UserCategory);
    }
    return this._repository;
  }

  private set repository(repository: Repository<UserCategory>) {
    this._repository = repository;
  }

  create(params: Partial<UserCategory>): UserCategory {
    try {
      userLogger.debug("userCategoryService.create", params);
      return this.repository.create(params);
    } catch (e) {
      userLogger.error("userCategoryService.create", e);
      throw e;
    }
  }

  delete(
    params: Partial<UserCategory> | FindConditions<UserCategory>
  ): Promise<DeleteResult> {
    try {
      userLogger.debug("userCategoryService.delete", params);
      return this.repository.delete(params);
    } catch (e) {
      userLogger.error("userCategoryService.delete", e);
      throw e;
    }
  }

  createQueryBuilder(params: string): SelectQueryBuilder<UserCategory> {
    try {
      userLogger.debug("UserCategoryService.createQueryBuilder", params);
      return this.repository.createQueryBuilder(params);
    } catch (e) {
      userLogger.error("UserCategoryService.createQueryBuilder", e);
      throw e;
    }
  }
}

export const userCategoryService = new UserCategoryService();
