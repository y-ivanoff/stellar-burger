import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { getOrderThunk } from './orderSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

describe('Order Action Tests', () => {
  describe('Order Data Acquisition action Tests', () => {
    test('Test of waiting for a response after receiving the order data', () => {
      const store = setupStore();
      store.dispatch({ type: getOrderThunk.pending.type });
      const state = store.getState();
      expect(state.order.isLoading).toBeTruthy();
      expect(state.order.error).toBeNull();
    });
    test('Error action test after receiving the order data', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: getOrderThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.order.isLoading).toBeFalsy();
      expect(state.order.error).toBe(error);
    });
    test('Test the action of a successful response after receiving the order data', () => {
      const mockedPayload = {
        orders: [
          {
            _id: '6820a253c2f30c001cb22eca',
            ingredients: [
              '643d69a5c3f7b9001cfa093c',
              '643d69a5c3f7b9001cfa093e',
              '643d69a5c3f7b9001cfa0943',
              '643d69a5c3f7b9001cfa093c'
            ],
            status: 'done',
            name: 'Краторный space люминесцентный бургер',
            createdAt: '2025-05-11T13:12:51.630Z',
            updatedAt: '2025-05-11T13:12:52.431Z',
            number: 76798
          }
        ]
      };
      const store = setupStore();
      store.dispatch({
        type: getOrderThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.order.isLoading).toBeFalsy();
      expect(state.order.error).toBeNull();
      expect(state.order.order).toEqual(mockedPayload.orders[0]);
    });
  });
});
