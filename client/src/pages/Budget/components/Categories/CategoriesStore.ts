import { makeAutoObservable, runInAction } from 'mobx';

import { get, post, remove } from 'services';
import { ICategory, IInitialCategory, IResetForm, IConstructorProps } from 'types';

export class CategoriesStore {
  categories: ICategory[] = [];

  closeModal: () => void;

  constructor({ rootStore }: IConstructorProps) {
    makeAutoObservable(this);
    this.closeModal = rootStore.modalStore.closeModal;
  }

  getCategories = async () => {
    try {
      const { categories }: { categories: ICategory[] } = await get('/category');
      runInAction(() => {
        this.categories = [...categories];
      });
    } catch {
      Error('something went wrong');
    }
  };

  addCategories = async ({ title, description }: IInitialCategory, { resetForm }: IResetForm) => {
    try {
      await post('/category', { title, description });

      this.getCategories();
      resetForm();

      this.closeModal();
    } catch {
      Error('something went wrong');
    }
  };

  clearCategories = async () => {
    try {
      await remove('/category?clear=true');
      this.categories = this.categories.filter((el: ICategory) => el.isDefault === true);
    } catch {
      Error('something went wrong');
    }
  };

  removeCategoryItem = async (id: string) => {
    try {
      await remove(`/category/${id}`);
      this.categories = this.categories.filter((el: ICategory) => el.id !== id);
    } catch {
      Error('something went wrong');
    }
  };
}
