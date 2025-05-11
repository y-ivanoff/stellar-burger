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

const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('Customer Action Tests', () => {
  const mockSet = jest.fn();

  describe('Login Request Action Tests', () => {
    test('Waiting action test response after login request', () => {
      const store = setupStore();
      store.dispatch({ type: loginUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoadong).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Error action test after login request', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: loginUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Successful Login Action Test', () => {
      const mockedPayload = {
        accessToken:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjBhMjMwYzJmMzBjMDAxY2IyMmVjMyIsImlhdCI6MTc0Njk4Nzk4OSwiZXhwIjoxNzQ2OTg5MTg5fQ.2SdD24vaDy3xVkzUI9MU7Ap_CC9V-bgcmnggjeMV8ug',
        refreshToken:
          '52950115beee9f6ec6f6b417f6439a2be3d987434845bdf85f06909aad284daff665e2e8b536b873',
        user: {
          email: 'ur24.ivanov@yandex.ru',
          name: 'Yuri'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBeTruthy();
    });
  });

  describe('Registration Request Action Test', () => {
    test('Waiting action test response after registration request', () => {
      const store = setupStore();
      store.dispatch({ type: registerUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoadong).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Error action test after registration request', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: registerUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Successful Registration Action test', () => {
      const mockedPayload = {
        accessToken:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjBhMjMwYzJmMzBjMDAxY2IyMmVjMyIsImlhdCI6MTc0Njk4Nzk4OSwiZXhwIjoxNzQ2OTg5MTg5fQ.2SdD24vaDy3xVkzUI9MU7Ap_CC9V-bgcmnggjeMV8ug',
        refreshToken:
          '52950115beee9f6ec6f6b417f6439a2be3d987434845bdf85f06909aad284daff665e2e8b536b873',
        user: {
          email: 'ur24.ivanov@yandex.ru',
          name: 'Yuri'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: registerUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBeTruthy();
    });
  });

  describe('Logout request action test', () => {
    test('Waiting action test response after logout request', () => {
      const store = setupStore();
      store.dispatch({ type: logoutUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoadong).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Error action test after logout request', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: logoutUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Successful Logout action test', () => {
      const mockedPayload = {
        message: 'Successful logout'
      };
      const store = setupStore();
      store.dispatch({
        type: logoutUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toBeNull();
      expect(state.user.isAuthorized).toBeFalsy();
    });
  });

  describe('Testing the action of requesting changes to the clients data', () => {
    test('Waiting action test response after client data change request', () => {
      const store = setupStore();
      store.dispatch({ type: updateUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoadong).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Error action test after client data change request', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: updateUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Test the action of successfully changing the clients data', () => {
      const mockedPayload = {
        user: {
          email: 'ur24.ivanov@yandex.ru',
          name: 'Yuri'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: updateUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBeTruthy();
    });
  });

  describe('Password Recovery Request Action Test', () => {
    test('Waiting action test response after password recovery request', () => {
      const store = setupStore();
      store.dispatch({ type: forgotPasswordThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoadong).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Error action test after password recovery request', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: forgotPasswordThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Successful Password Recovery Action Test', () => {
      const mockedPayload = {
        message: 'Reset email sent'
      };
      const store = setupStore();
      store.dispatch({
        type: forgotPasswordThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toBeNull();
      expect(state.user.isAuthorized).toBeFalsy();
    });
  });

  describe('Password Change Request Action test', () => {
    test('Waiting action test response after password change request', () => {
      const store = setupStore();
      store.dispatch({ type: resetPasswordThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoadong).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Error action test after password change request', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: resetPasswordThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Password Change Action Test', () => {
      const mockedPayload = {
        message: 'Password successfully reset'
      };
      const store = setupStore();
      store.dispatch({
        type: resetPasswordThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toBeNull();
      expect(state.user.isAuthorized).toBeFalsy();
    });
  });

  describe('User Data Request action test', () => {
    test('Waiting action test response after requesting user data', () => {
      const store = setupStore();
      store.dispatch({ type: getUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoadong).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Error action test after requesting user data', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: getUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Test the action of a successful user data request', () => {
      const mockedPayload = {
        user: {
          email: 'ur24.ivanov@yandex.ru',
          name: 'Yuri'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: getUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoadong).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBeTruthy();
    });
  });
});
