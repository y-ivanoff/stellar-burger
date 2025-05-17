import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getUserThunk
} from './userSlice';

const DEFAULT_USER = {
  email: 'ur24.ivanov@yandex.ru',
  name: 'Yuri'
};

const DEFAULT_TOKENS = {
  accessToken:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjBhMjMwYzJmMzBjMDAxY2IyMmVjMyIsImlhdCI6MTc0Njk4Nzk4OSwiZXhwIjoxNzQ2OTg5MTg5fQ.2SdD24vaDy3xVkzUI9MU7Ap_CC9V-bgcmnggjeMV8ug',
  refreshToken:
    '52950115beee9f6ec6f6b417f6439a2be3d987434845bdf85f06909aad284daff665e2e8b536b873'
};

const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('Customer Action Tests', () => {
  describe('Login Request Action Tests', () => {
    test('Pending action test', () => {
      const store = setupStore();
      store.dispatch({ type: loginUserThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Rejected action test', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: loginUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Fulfilled action test', () => {
      const mockedPayload = {
        ...DEFAULT_TOKENS,
        user: DEFAULT_USER
      };
      const store = setupStore();
      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual(DEFAULT_USER);
      expect(state.isAuthorized).toBeTruthy();
    });
  });

  describe('Registration Request Action Test', () => {
    test('Pending action test', () => {
      const store = setupStore();
      store.dispatch({ type: registerUserThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Rejected action test', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: registerUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Fulfilled action test', () => {
      const mockedPayload = {
        ...DEFAULT_TOKENS,
        user: DEFAULT_USER
      };
      const store = setupStore();
      store.dispatch({
        type: registerUserThunk.fulfilled.type,
        payload: DEFAULT_USER
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual(DEFAULT_USER);
      expect(state.isAuthorized).toBeTruthy();
    });
  });

  describe('Logout Request Action Test', () => {
    test('Pending action test', () => {
      const store = setupStore();
      store.dispatch({ type: logoutUserThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Rejected action test', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: logoutUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Fulfilled action test', () => {
      const store = setupStore();
      store.dispatch({
        type: logoutUserThunk.fulfilled.type,
        payload: { message: 'Successful logout' }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
    });
  });

  describe('Update User Data Action Test', () => {
    test('Pending action test', () => {
      const store = setupStore();
      store.dispatch({ type: updateUserThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Rejected action test', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: updateUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Fulfilled action test', () => {
      const store = setupStore();
      store.dispatch({
        type: updateUserThunk.fulfilled.type,
        payload: DEFAULT_USER
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual(DEFAULT_USER);
      expect(state.isAuthorized).toBeTruthy();
    });
  });

  describe('Forgot Password Action Test', () => {
    test('Pending action test', () => {
      const store = setupStore();
      store.dispatch({ type: forgotPasswordThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Rejected action test', () => {
      const store = setupStore();
      const error = 'Password reset failed';
      store.dispatch({
        type: forgotPasswordThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Fulfilled action test', () => {
      const mockedPayload = { message: 'Reset email sent' };
      const store = setupStore();
      store.dispatch({
        type: forgotPasswordThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
    });
  });

  describe('Reset Password Action Test', () => {
    test('Pending action test', () => {
      const store = setupStore();
      store.dispatch({ type: resetPasswordThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Rejected action test', () => {
      const store = setupStore();
      const error = 'Password reset failed';
      store.dispatch({
        type: resetPasswordThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Fulfilled action test', () => {
      const mockedPayload = { message: 'Password successfully reset' };
      const store = setupStore();
      store.dispatch({
        type: resetPasswordThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
    });
  });

  describe('Get User Data Action Test', () => {
    test('Pending action test', () => {
      const store = setupStore();
      store.dispatch({ type: getUserThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('Rejected action test', () => {
      const store = setupStore();
      const error = 'Failed to fetch user';
      store.dispatch({
        type: getUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe(error);
    });

    test('Fulfilled action test', () => {
      const mockedPayload = { user: DEFAULT_USER };
      const store = setupStore();
      store.dispatch({
        type: getUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual(DEFAULT_USER);
      expect(state.isAuthorized).toBeTruthy();
    });
  });
});
