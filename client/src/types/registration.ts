export interface IInitialRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IBodyReg extends IInitialRegistration {
  budgetAmount: number;
}

export interface IRegistrationStore {
  initialRegistration: IInitialRegistration;
  postReg: (body: IInitialRegistration) => void;
}
