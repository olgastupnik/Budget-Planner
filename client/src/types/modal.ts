export interface IModalStore {
  isOpenCategoriesModal: boolean;
  isOpenAccountModal: boolean;

  openCategoriesModal: () => void;
  openAccountModal: () => void;
  closeModal: () => void;
}
