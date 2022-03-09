export const setToken = (token: string) => sessionStorage.setItem('token', JSON.stringify(token));

export const getToken = (): string | null => sessionStorage.getItem('token');

export const isAuth = (): boolean => Boolean(getToken());

export const clearToken = (): void => sessionStorage.removeItem('token');

export const jwtDecode = (token: string) => {
  return JSON.parse(atob(token.split('.')[1]));
};
