export interface ILogin{
    email: string;
    password: string;
}

export interface ILoginStore{
    initialFormLogin: ILogin;
    login: ({ email, password }: ILogin)=> void;
}
