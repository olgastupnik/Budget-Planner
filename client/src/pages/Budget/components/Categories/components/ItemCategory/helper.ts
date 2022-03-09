import { IHistory, ICategory } from 'types';

export const calculateExpense = (histories: IHistory[], categories: ICategory[], title: string) => {
  const category = categories.find((el: ICategory) => el.title === title);

  return histories.reduce((accumulator, currentValue) => {
    if (currentValue.category_id === category?.id && currentValue.type === 'expense') {
      return Number(accumulator) + Number(currentValue.amount);
    }
    return accumulator;
  }, 0);
};
