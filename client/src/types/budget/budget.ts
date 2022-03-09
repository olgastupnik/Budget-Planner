import { IAccountStore, ICategoriesStore, IHistoryStore } from 'types';

export interface ICurrentValue {
  type: string;
  amount: number;
}

export interface IBudgetStore {
  historyStore: IHistoryStore;

  accountStore: IAccountStore;

  categoriesStore: ICategoriesStore;
}
