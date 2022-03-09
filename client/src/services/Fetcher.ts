import { getToken } from '../helpers/auth';

const BASE_URL = 'http://localhost:3001/api';

export const CONTENT_TYPE = { 'Content-Type': 'application/json' };
const HEADERS = { ...CONTENT_TYPE, Authorization: `Bearer ${JSON.parse(getToken() as string)}` };

interface IOptions {
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE';
  headers?: {
    Authorization?: string;
    'Content-Type'?: string;
  };
  body?: string;
}

interface IRequest {
  url: string;
  options?: IOptions;
}

const request = ({ url, ...options }: IRequest) =>
  fetch(BASE_URL + url, options as IRequest['options'])
    .then((response) => response.json())
    .catch(() => new Error('something went wrong'));

export const get = (url = '') => request({ url, method: 'GET', headers: HEADERS } as IRequest);

export const post = (url = '', body: unknown, headers = {}) =>
  request({
    url,
    method: 'POST',
    headers: { ...headers, ...HEADERS },
    body: JSON.stringify(body),
  } as IRequest);

export const patch = (url = '', body: unknown) =>
  request({
    url,
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify(body),
  } as IRequest);

export const remove = (url = '') =>
  request({
    url,
    method: 'DELETE',
    headers: HEADERS,
  } as IRequest);
