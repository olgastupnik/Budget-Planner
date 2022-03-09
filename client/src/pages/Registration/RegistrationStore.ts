import { makeAutoObservable } from 'mobx';

import { IInitialRegistration } from 'types';
import { post } from 'services';

export class RegistrationStore {
  initialRegistration: IInitialRegistration = { email: '', password: '', firstName: '', lastName: '' };

  constructor() {
    makeAutoObservable(this);
  }

  postReg = (body: IInitialRegistration) => {
    try {
      post('/user/register', body);
    } catch {
      Error('something went wrong');
    }
  };
}
