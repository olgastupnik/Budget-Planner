import { Communal } from "../entity";
import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getRepository,
  Repository,
} from "typeorm";
import { userLogger } from "../libs";

interface ICommunalService {
  findOne: (params: FindOneOptions<Communal>) => Promise<Communal | undefined>;
  find: (params: FindManyOptions<Communal>) => Promise<Communal[]>;
  create: (params: Partial<Communal>) => Communal;
  merge: (user: Communal, params: Partial<Communal>) => Communal;
  save: (params: Partial<Communal>) => Promise<Partial<Communal> & Communal>;
  delete: (
    params: Partial<Communal> | FindConditions<Communal> | string
  ) => Promise<DeleteResult>;
}

export class CommunalService implements ICommunalService {
  private _repository: Repository<Communal>;

  private get repository(): Repository<Communal> {
    if (!this._repository) {
      this.repository = getRepository(Communal);
    }
    return this._repository;
  }

  private set repository(repository: Repository<Communal>) {
    this._repository = repository;
  }

  findOne(params: FindOneOptions<Communal>): Promise<Communal | undefined> {
    try {
      userLogger.debug("communalService.findOne", params);
      return this.repository.findOne(params);
    } catch (e) {
      userLogger.error("communalService.findOne", e);
      throw e;
    }
  }

  find(params: FindManyOptions<Communal>): Promise<Communal[]> {
    try {
      userLogger.debug("communalService.find", params);
      return this.repository.find(params);
    } catch (e) {
      userLogger.error("communalService.find", e);
      throw e;
    }
  }

  create(params: Partial<Communal>): Communal {
    try {
      userLogger.debug("communalService.create", params);
      return this.repository.create(params);
    } catch (e) {
      userLogger.error("communalService.create", e);
      throw e;
    }
  }

  merge(user: Communal, params: Partial<Communal>): Communal {
    try {
      userLogger.debug("communalService.merge", params);
      return this.repository.merge(user, { ...params });
    } catch (e) {
      userLogger.error("communalService.merge", e);
      throw e;
    }
  }

  save(params: Partial<Communal>): Promise<Partial<Communal> & Communal> {
    try {
      userLogger.debug("communalService.save", params);
      return this.repository.save(params);
    } catch (e) {
      userLogger.error("communalService.save", e);
      throw e;
    }
  }

  delete(
    params: Partial<Communal> | FindConditions<Communal> | string
  ): Promise<DeleteResult> {
    try {
      userLogger.debug("communalService.delete", params);
      return this.repository.delete(params);
    } catch (e) {
      userLogger.error("communalService.delete", e);
      throw e;
    }
  }
}

export const communalService = new CommunalService();
