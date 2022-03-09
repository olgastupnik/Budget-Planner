import { Users } from "../entity";
import {
  DeleteResult,
  FindConditions,
  FindOneOptions,
  getRepository,
  Repository,
} from "typeorm";
import { userLogger } from "../libs";

interface IUserService {
  findOne: (params: FindOneOptions<Users>) => Promise<Users | undefined>;
  create: (params: Partial<Users>) => Users;
  merge: (user: Users, params: Partial<Users>) => Users;
  save: (params: Partial<Users>) => Promise<Partial<Users> & Users>;
  delete: (
    params: FindConditions<Users> | string | string[]
  ) => Promise<DeleteResult>;
}

export class UserService implements IUserService {
  private _repository: Repository<Users>;

  private get repository(): Repository<Users> {
    if (!this._repository) {
      this.repository = getRepository(Users);
    }
    return this._repository;
  }

  private set repository(repository: Repository<Users>) {
    this._repository = repository;
  }

  findOne(params: FindOneOptions<Users>): Promise<Users | undefined> {
    try {
      userLogger.debug("userService.findOne", params);
      return this.repository.findOne(params);
    } catch (e) {
      userLogger.error("userService.findOne", e);
      throw e;
    }
  }

  create(params: Partial<Users>): Users {
    try {
      userLogger.debug("userService.create", params);
      return this.repository.create(params);
    } catch (e) {
      userLogger.error("userService.create", e);
      throw e;
    }
  }

  merge(user: Users, params: Partial<Users>): Users {
    try {
      userLogger.debug("userService.merge", params);
      return this.repository.merge(user, { ...params });
    } catch (e) {
      userLogger.error("userService.merge", e);
      throw e;
    }
  }

  save(params: Partial<Users>): Promise<Partial<Users> & Users> {
    try {
      userLogger.debug("userService.save", params);
      return this.repository.save(params);
    } catch (e) {
      userLogger.error("userService.save", e);
      throw e;
    }
  }

  delete(
    params: FindConditions<Users> | string | string[]
  ): Promise<DeleteResult> {
    try {
      userLogger.debug("userService.delete", params);
      return this.repository.delete(params);
    } catch (e) {
      userLogger.error("userService.delete", e);
      throw e;
    }
  }
}

export const userService = new UserService();
