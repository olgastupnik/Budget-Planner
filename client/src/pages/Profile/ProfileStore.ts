import { makeAutoObservable } from 'mobx';

import { IInitFormProfile, IUser, IPasswords, IResetForm } from 'types';
import { patch, get } from '../../services/Fetcher';

export class ProfileStore {
  initialForm: IInitFormProfile = { firstName: '', lastName: '', email: '' };

  initialChangePassword: IPasswords = { fPassword: '', sPassword: '' };

  userId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = ({ firstName, lastName, email, id }: IUser) => {
    this.userId = id;
    this.initialForm = { firstName, lastName, email };
  };

  getUser = () => {
    get('/user').then((res) => {
      this.setUser(res);
    });
  };

  patchUser = (body: IInitFormProfile) => {
    patch('/user', body);
  };

  changePassword = async ({ fPassword, sPassword }: IPasswords, { resetForm }: IResetForm) => {
    try {
      await patch('/user/password/repeat', { password: fPassword, repeatedPassword: sPassword });
      resetForm();
    } catch {
      Error('something went wrong');
    }
  };
}
