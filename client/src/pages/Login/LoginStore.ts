import { makeAutoObservable } from 'mobx';

import { ILoginStore, ILogin, IProfile, IUser } from 'types';
import { setToken } from 'helpers';
import { post } from '../../services/Fetcher';

export class LoginStore implements ILoginStore {
  initialFormLogin = { email: '', password: '' };

  setUser: (body: IUser) => void;

  constructor({ profileStore }: IProfile) {
    makeAutoObservable(this);
    this.setUser = profileStore.setUser;
  }

  login = async ({ email, password }: ILogin) => {
    try {
      const { token, user } = await post('/user/login', { email, password });
      await setToken(token);
      this.setUser(user);
    } catch {
      Error('something went wrong');
    }
  };
}
