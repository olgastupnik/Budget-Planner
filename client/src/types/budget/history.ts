import { IProfileStore } from 'types';

export interface IHistoryType {
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  user: any;
}

export interface IHistory extends IHistoryType {
  userId: number;
  id: string;
}

export interface IInitValues {
  amount: number;
  type: 'income' | 'expense';
  categoryTitle: string;
}

export interface IHistoryStore {
  history: IHistory[];
  historiesLength: number;
  amountOfPages: number;
  currentPage: number;
  budgetAmount: number;
  profileStore: IProfileStore;
  getHistory: () => void;
  filterHistory: (type: string) => IHistory[];
  changePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  deleteHistory: () => void;
}
