import { IResetForm, IHistoryType } from 'types';

export interface IBudgetAmount {
  budgetAmount: number;
}

export type TEditBudget = ({ amount, type, category_id, user }: IHistoryType) => void;

export interface IAccountStore {
  initialAmount: number;
  getInitial: () => void;
  formSubmit: ({ budgetAmount }: IBudgetAmount, { resetForm }: IResetForm) => void;
  clearBudgetAmount: () => void;
  editBudget: TEditBudget;
}
