import { makeAutoObservable, reaction, runInAction } from 'mobx';

import { IHistory, IRootStore, IConstructorProps, ICurrentValue, IProfileStore } from 'types';
import { get, remove } from 'services';

export class HistoryStore {
  budgetAmount: number = 0;

  history: IHistory[] = [];

  profileStore: IProfileStore;

  rootStore: IRootStore;

  historiesLength: number = 0;

  amountOfPages: number = 0;

  currentPage: number = 1;

  constructor({ rootStore }: IConstructorProps) {
    makeAutoObservable(this);
    this.profileStore = rootStore.profileStore;
    this.rootStore = rootStore;

    reaction(
      () => this.historiesLength,
      () => {
        runInAction(() => {
          this.amountOfPages = Math.ceil(this.historiesLength / 10);
        });
      },
      { fireImmediately: true },
    );

    reaction(
      () => this.history,
      () => {
        runInAction(() => {
          this.budgetAmount = this.history.reduce((accumulator: number, currentValue: ICurrentValue): number => {
            return (accumulator +=
              currentValue.type === 'income' ? Number(currentValue.amount) : -Number(currentValue.amount));
          }, this.rootStore.budgetStore.accountStore.initialAmount);
        });
      },
      { fireImmediately: true },
    );
  }

  getHistory = () => {
    try {
      get(`/history?page=${this.currentPage}`).then((res: { histories: IHistory[]; historiesLength: number }) => {
        runInAction(() => {
          this.history = res.histories;
          this.historiesLength = res.historiesLength;
        });
      });
    } catch {
      Error('something went wrong');
    }
  };

  changePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    if (event.currentTarget.textContent === '>') {
      this.currentPage = this.currentPage < this.amountOfPages ? this.currentPage + 1 : this.currentPage;
    } else if (event.currentTarget.textContent === '<') {
      this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
    } else {
      this.currentPage = Number(event.currentTarget.textContent);
    }
    this.getHistory();
  };

  filterHistory = (type: string) => {
    let filterHistory: IHistory[] = [];
    if (type === 'all') {
      filterHistory = this.history;
    } else {
      filterHistory = this.history.filter((el: IHistory) => el.type === type);
    }
    return filterHistory;
  };

  deleteHistory = () => {
    try {
      remove('/history?deleteAll=true');
      runInAction(() => {
        this.history = [];
      });
    } catch {
      Error('something went wrong');
    }
  };
}
