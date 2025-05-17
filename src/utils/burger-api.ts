import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

export const URL = 'https://norma.nomoreparties.space/api/';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err: unknown) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

type TUserResponse = TServerResponse<{ user: TUser }>;

export type TLoginData = {
  email: string;
  password: string;
};

const checkSuccess = <T>(res: T & { success?: boolean }): Promise<T> => {
  if (res?.success) {
    return Promise.resolve(res);
  }
  return Promise.reject(res);
};

const request = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  fetch(`${URL}${endpoint}`, options)
    .then((res) => checkResponse<T & { success?: boolean }>(res))
    .then((res) => checkSuccess<T>(res));

const refreshToken = (): Promise<TRefreshResponse> =>
  request<TRefreshResponse>('auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((refreshData) => {
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    setCookie('accessToken', refreshData.accessToken);
    return refreshData;
  });

const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          authorization: refreshData.accessToken
        }
      };
      return request<T>(endpoint, newOptions);
    }
    return Promise.reject(err);
  }
};

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  request<TIngredientsResponse>('ingredients').then((data) => data.data);

export const getFeedsApi = (): Promise<TOrdersData> =>
  request<TFeedsResponse>('orders/all').then((data) => data);

export const getOrdersApi = (): Promise<TOrder[]> =>
  fetchWithRefresh<TOrdersData>('orders', {
    headers: {
      authorization: getCookie('accessToken') || ''
    }
  }).then((data) => data.orders);

export const orderBurgerApi = (ingredients: string[]): Promise<TOrder> =>
  fetchWithRefresh<{ order: TOrder }>('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify({ ingredients })
  }).then((data) => data.order);

export const getOrderByNumberApi = (number: number): Promise<TOrder> =>
  request<TOrderResponse>(`orders/${number}`).then((data) => data.orders[0]);

export const registerUserApi = (data: TRegisterData): Promise<TAuthResponse> =>
  request('auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  });

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> =>
  request('auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  });

export const forgotPasswordApi = (email: string): Promise<void> =>
  request('password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ email })
  }).then(() => undefined);

export const resetPasswordApi = (
  password: string,
  token: string
): Promise<void> =>
  request('password-reset/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ password, token })
  }).then(() => undefined);

export const getUserApi = (): Promise<TUser> =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    headers: {
      authorization: getCookie('accessToken') || ''
    }
  }).then((data) => data.user);

export const updateUserApi = (user: Partial<TRegisterData>): Promise<TUser> =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify(user)
  }).then((data) => data.user);

export const logoutApi = (): Promise<void> =>
  request('auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then(() => undefined);
