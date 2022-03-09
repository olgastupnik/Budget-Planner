import { makeAutoObservable } from 'mobx';

export class ModalStore {
  isOpenCategoriesModal: boolean = false;

  isOpenAccountModal: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  openCategoriesModal = (): void => {
    this.isOpenCategoriesModal = true;
  };

  openAccountModal = (): void => {
    this.isOpenAccountModal = true;
  };

  closeModal = (): void => {
    this.isOpenAccountModal = false;
    this.isOpenCategoriesModal = false;
  };
}
