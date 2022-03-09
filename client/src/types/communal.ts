import { IResetForm } from './types';

export interface IInitialCommunal {
  water: number;
  gas: number;
  heating: number;
  timestamp: string;
}

export interface ICommunalItem {
  title: string;
  price: number;
}

export interface ICommunalBD {
  bills: Omit<IInitialCommunal, 'timestamp'>;
  id: string;
  total: number;
  timestamp: string;
}

export interface ICommunal extends IInitialCommunal {
  id: number;
  total: number;
}

export interface ICommunalStore {
  communal: IInitialCommunal;
  historyCommunal: ICommunalBD[];
  historyTotal: number[];
  historyMonths: string[];
  totalSum: number;
  isLoading: boolean;

  sortCommunalByData: (communalData: ICommunalBD[]) => ICommunalBD[];
  getTotalSum: ({ water, gas, heating }: IInitialCommunal) => void;
  getMonthsAndTotalAmount: () => void;
  getCommunal: () => Promise<void>;
  postCommunal: (data: IInitialCommunal, { resetForm }: IResetForm) => Promise<void>;
}

export type TComunalCategory = 'gas' | 'water' | 'heating';
