import { IModalStore, ICommunalStore, IProfileStore, IRegistrationStore, ILoginStore, IBudgetStore } from 'types';
import { LoginStore } from '../pages/Login';
import { ProfileStore } from '../pages/Profile';
import { ModalStore } from '../components/Modal';
import { CommunalStore } from '../pages/Communal';
import { BudgetStore } from '../pages/Budget/BudgetStore';
import { RegistrationStore } from '../pages/Registration';

export class RootStore {
  budgetStore: IBudgetStore;

  profileStore: IProfileStore;

  communalStore: ICommunalStore;

  modalStore: IModalStore;

  registrationStore: IRegistrationStore;

  loginStore: ILoginStore;

  constructor() {
    this.modalStore = new ModalStore();
    this.profileStore = new ProfileStore();
    this.communalStore = new CommunalStore();
    this.registrationStore = new RegistrationStore();
    this.loginStore = new LoginStore(this);
    this.budgetStore = new BudgetStore(this);
  }
}
