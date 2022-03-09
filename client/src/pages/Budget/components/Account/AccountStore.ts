import { makeAutoObservable, runInAction } from 'mobx';

import { post, patch, get } from 'services';
import {
  IHistory,
  IBudgetAmount,
  IResetForm,
  IProfileStore,
  IRootStore,
  IConstructorProps,
  TEditBudget,
  IBudgetStore,
} from 'types';
import { DEFAULT_TYPE_INPUT_NOTES } from '../../constants';

export class AccountStore {
  initialAmount = 0;

  rootStore: IRootStore;

  closeModal: () => void;

  userId: number | null;

  profileStore: IProfileStore;

  budgetStore: IBudgetStore;

  constructor({ rootStore }: IConstructorProps) {
    makeAutoObservable(this);
    this.budgetStore = rootStore.budgetStore;
    this.closeModal = rootStore.modalStore.closeModal;
    this.userId = rootStore.profileStore.userId;
    this.profileStore = rootStore.profileStore;
    this.rootStore = rootStore;
  }

  getInitial = async () => {
    try {
      const { budgetAmount }: { budgetAmount: number } = await get('/user');
      this.initialAmount = +Number(budgetAmount).toFixed(2);
    } catch {
      Error('something went wrong');
    }
  };

  formSubmit = ({ budgetAmount }: IBudgetAmount, { resetForm }: IResetForm) => {
    try {
      patch('/user', { budgetAmount });
      runInAction(() => {
        this.initialAmount = budgetAmount;
      });
      resetForm();
      this.closeModal();
    } catch {
      Error('something went wrong');
    }
  };

  clearBudgetAmount = () => {
    try {
      patch('/user', { budgetAmount: 0 }).then(() => {
        this.rootStore.budgetStore.historyStore.deleteHistory();
      });
      runInAction(() => {
        this.initialAmount = 0;
      });
    } catch {
      Error('something went wrong');
    }
  };

  editBudget: TEditBudget = ({ amount, type, category_id }) => {
    if (
      DEFAULT_TYPE_INPUT_NOTES ||
      (!DEFAULT_TYPE_INPUT_NOTES && this.rootStore.budgetStore.historyStore.budgetAmount >= amount)
    ) {
      const payload = {
        amount,
        type,
        category: category_id,
      };

      post('/history', payload).then(() => {
        this.rootStore.budgetStore.historyStore.getHistory();
      });
    }
  };
}
