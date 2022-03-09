/* eslint-disable no-console */
import moment from 'moment';
import { makeAutoObservable, runInAction } from 'mobx';

import { IInitialCommunal, IResetForm, ICommunalBD } from 'types';
import { post, patch, get } from 'services';
import { tryConvert, dateNow } from './helpers';

export class CommunalStore {
  communal: IInitialCommunal = { water: 0, gas: 0, heating: 0, timestamp: moment(dateNow).format('YYYY-MM-DD') };

  historyCommunal: ICommunalBD[] = [];

  historyTotal: number[] = [];

  historyMonths: string[] = [];

  totalSum: number = 0;

  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getTotalSum({ water, gas, heating }: IInitialCommunal) {
    runInAction(() => {
      this.totalSum = tryConvert(water, 'water') + tryConvert(gas, 'gas') + tryConvert(heating, 'heating');
    });
  }

  getMonthsAndTotalAmount = () => {
    runInAction(() => {
      this.historyCommunal.map((el: ICommunalBD) => {
        const month = moment(`${el.timestamp}`, 'YYYY/MM/DD').format('MMMM');
        const indexOfMonth: number | undefined = this.historyMonths.findIndex((historyMonth) => historyMonth === month);

        if (indexOfMonth >= 0) {
          this.historyTotal[indexOfMonth] = el.total;
        } else {
          this.historyTotal = [...this.historyTotal, el.total];
          this.historyMonths = [...this.historyMonths, month];
        }
      });
    });
  };

  sortCommunalByData = (communalData: ICommunalBD[]) =>
    communalData.sort((prev: ICommunalBD, next: ICommunalBD) => {
      const prevData: any = new Date(prev.timestamp);
      const nextData: any = new Date(next.timestamp);
      return prevData - nextData;
    });

  getCommunal = async () => {
    try {
      runInAction(async () => {
        const res: { communal: ICommunalBD[] } = await get('/communal');

        this.historyCommunal = res.communal?.length ? this.sortCommunalByData(res.communal) : res.communal;
        if (this.historyCommunal.length) {
          this.getMonthsAndTotalAmount();
        }
      });
    } catch {
      Error('something went wrong');
    } finally {
      this.isLoading = false;
    }
  };

  postCommunal = async (data: IInitialCommunal, { resetForm }: IResetForm) => {
    const { timestamp, water, gas, heating } = data;
    this.getTotalSum(data);

    const timeUTC = moment(timestamp).format();
    const communalData = this.historyCommunal.find((el) => moment(el.timestamp).isSame(timestamp, 'month'));

    const request = communalData ? patch : post;

    const postBody: Omit<ICommunalBD, 'id'> = {
      bills: { water, gas, heating },
      total: this.totalSum,
      timestamp: timeUTC,
    };
    const patchBody = { ...postBody, id: communalData?.id };
    const requestBody = communalData ? patchBody : postBody;

    try {
      this.isLoading = true;
      await request('/communal', requestBody);

      resetForm();
    } catch {
      Error('something went wrong');
    } finally {
      this.isLoading = false;
    }
  };
}
