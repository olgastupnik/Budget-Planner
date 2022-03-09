import { History } from "../entity";
import {
  DeleteResult,
  FindConditions,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { userLogger } from "../libs";

interface IHistoryService {
  create: (params: Partial<History>) => History;
  save: (params: Partial<History>) => Promise<Partial<History> & History>;
  delete: (
    params: Partial<History> | FindConditions<History> | string | string[]
  ) => Promise<DeleteResult>;
  createQueryBuilder: (params: string) => SelectQueryBuilder<History>;
}

export class HistoryService implements IHistoryService {
  private _repository: Repository<History>;

  private get repository(): Repository<History> {
    if (!this._repository) {
      this.repository = getRepository(History);
    }
    return this._repository;
  }

  private set repository(repository: Repository<History>) {
    this._repository = repository;
  }

  create(params: Partial<History>): History {
    try {
      userLogger.debug("historyService.create", params);
      return this.repository.create(params);
    } catch (e) {
      userLogger.error("historyService.create", e);
      throw e;
    }
  }

  save(params: Partial<History>): Promise<Partial<History> & History> {
    try {
      userLogger.debug("historyService.save", params);
      return this.repository.save(params);
    } catch (e) {
      userLogger.error("historyService.save", e);
      throw e;
    }
  }

  delete(
    params: Partial<History> | FindConditions<History> | string | string[]
  ): Promise<DeleteResult> {
    try {
      userLogger.debug("historyService.delete", params);
      return this.repository.delete(params);
    } catch (e) {
      userLogger.error("historyService.delete", e);
      throw e;
    }
  }
  createQueryBuilder(params: string): SelectQueryBuilder<History> {
    try {
      userLogger.debug("historyService.createQueryBuilder", params);
      return this.repository.createQueryBuilder(params);
    } catch (e) {
      userLogger.error("historyService.createQueryBuilder", e);
      throw e;
    }
  }
}

export const historyService = new HistoryService();
