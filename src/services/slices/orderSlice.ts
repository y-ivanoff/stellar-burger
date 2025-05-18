import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export interface OrderState {
  isLoading: boolean;
  order: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  isLoading: false,
  order: null,
  error: null
};

interface OrderResponse {
  orders: TOrder[];
}

declare type Payload = OrderResponse | TOrder;

export const getOrderThunk = createAsyncThunk<Payload, number>(
  'feed/getOrder',
  (number) => getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if ('orders' in payload) {
          state.order = payload.orders[0] || null;
        } else {
          state.order = payload;
        }
      });
  }
});

export { initialState as orderInitialState };

export const getOrderSelector = (state: { order: OrderState }) =>
  state.order.order;

export default orderSlice.reducer;
