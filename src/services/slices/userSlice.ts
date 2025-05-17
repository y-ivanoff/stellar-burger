import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import type { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isLoading: boolean;
  user: TUser | null;
  isAuthorized: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  error: null
};

interface AuthResponse {
  user: TUser;
  accessToken: string;
  refreshToken: string;
}

export const loginUserThunk = createAsyncThunk<
  AuthResponse | TUser,
  TLoginData
>('user/login', (loginData) => loginUserApi(loginData));

export const registerUserThunk = createAsyncThunk<
  AuthResponse | TUser,
  TRegisterData
>('user/register', (registerData) => registerUserApi(registerData));

export const logoutUserThunk = createAsyncThunk('user/logout', logoutApi);

export const updateUserThunk = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  (user) => updateUserApi(user)
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  (data: { email: string }) => forgotPasswordApi(data.email)
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  (data: { password: string; token: string }) =>
    resetPasswordApi(data.password, data.token)
);

export const getUserThunk = createAsyncThunk<AuthResponse | TUser>(
  'user/get',
  getUserApi
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const userData: TUser = 'user' in payload ? payload.user : payload;
        state.user = userData;
        state.isAuthorized = true;

        if ('accessToken' in payload) {
          setCookie('accessToken', payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
        }
      })

      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;

        const userData: TUser = 'user' in payload ? payload.user : payload;
        state.user = userData;
        state.isAuthorized = true;

        if ('accessToken' in payload) {
          setCookie('accessToken', payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
        }
      })

      // Logout
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.isAuthorized = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })

      // Update User
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload;
        state.isAuthorized = true;
      })

      // Forgot Password
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })

      // Reset Password
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })

      // Get User
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;

        const userData: TUser = 'user' in payload ? payload.user : payload;
        state.user = userData;
        state.isAuthorized = true;
      });
  }
});

export { initialState as userInitialState };
export const { clearUserError } = userSlice.actions;

export const getUserStateSelector = (state: { user: UserState }) => state.user;
export const getUserSelector = (state: { user: UserState }) => state.user.user;
export const isAuthorizedSelector = (state: { user: UserState }) =>
  state.user.isAuthorized;
export const getUserErrorSelector = (state: { user: UserState }) =>
  state.user.error;

export default userSlice.reducer;
