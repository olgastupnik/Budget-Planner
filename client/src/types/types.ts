import { IModalStore, IBudgetStore, ICommunalStore, IProfileStore, IRegistrationStore, ILoginStore } from 'types';

export interface IResetForm {
  resetForm: () => void;
}

export interface IHistoryHook {
  from: {
    pathname: string;
  };
}

export interface IRootStore {
  budgetStore: IBudgetStore;
  profileStore: IProfileStore;
  communalStore: ICommunalStore;
  modalStore: IModalStore;
  registrationStore: IRegistrationStore;
  loginStore: ILoginStore;
}

export interface IConstructorProps {
  rootStore: IRootStore;
}
