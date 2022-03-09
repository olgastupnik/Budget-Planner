import { IResetForm } from 'types';

export interface IInitialCategory {
  title: string;
  description: string;
}

export interface ICategory extends IInitialCategory {
  isDefault: boolean;
  id: string;
}

export interface IItemCategory extends ICategory {
  remove: (id: string) => void;
}

export interface ICategoriesStore {
  categories: ICategory[];
  getCategories: () => void;
  addCategories: ({ title, description }: IInitialCategory, { resetForm }: IResetForm) => void;
  clearCategories: () => void;
  removeCategoryItem: (id: string) => void;
}
