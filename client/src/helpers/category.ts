import { ICategory } from 'types';

export const findCategoryByTitle = (title: string, categories: ICategory[]): ICategory | undefined => {
  return categories.find((el: ICategory) => el.title === title);
};

export const findCategoryById = (id: string, categories: ICategory[]): ICategory | undefined => {
  return categories.find((el: ICategory) => el.id === id);
};
