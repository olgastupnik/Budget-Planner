import { ICategoriesStore, IAccountStore, IHistoryStore, IRootStore } from 'types';
import { HistoryStore, AccountStore, CategoriesStore } from './components';

export class BudgetStore {
  historyStore: IHistoryStore;

  accountStore: IAccountStore;

  categoriesStore: ICategoriesStore;

  rootStore: IRootStore;

  constructor(rootStore: IRootStore) {
    this.rootStore = rootStore;
    this.historyStore = new HistoryStore(this);
    this.accountStore = new AccountStore(this);
    this.categoriesStore = new CategoriesStore(this);
  }
}
