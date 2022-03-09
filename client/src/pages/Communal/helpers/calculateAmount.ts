import { IInitialCommunal, TComunalCategory } from 'types';
import { COMMUNAL_RATIO } from '../constants';

export const Convert = (amount: number, title: TComunalCategory) => {
  return amount * COMMUNAL_RATIO[title];
};

export const tryConvert = (amount: number, title: TComunalCategory) => {
  const output = Convert(amount, title);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded;
};

export const filterAmount = (title: TComunalCategory, communal: Omit<IInitialCommunal, 'timestamp'>) => {
  const communalObj: Record<string, number> = communal;

  return communalObj[title];
};

export const getTotal = ({ water, gas, heating }: IInitialCommunal) => {
  const sum = tryConvert(water, 'water') + tryConvert(gas, 'gas') + tryConvert(heating, 'heating');

  return sum;
};
