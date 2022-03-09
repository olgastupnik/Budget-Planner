import { IResetForm } from 'types';

export interface IInitFormProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IPasswords {
  fPassword: string;
  sPassword: string;
}

export interface IUser extends IInitFormProfile {
  id: number;
}

export interface IProfileStore {
  initialChangePassword: IPasswords;
  initialForm: IInitFormProfile;
  userId: number | null;

  setUser: ({ firstName, lastName, email, id }: IUser) => void;
  getUser: () => void;
  patchUser: (body: IInitFormProfile) => void;
  changePassword: (body: IPasswords, { resetForm }: IResetForm) => void;
}

export interface IProfile {
  profileStore: IProfileStore;
}
