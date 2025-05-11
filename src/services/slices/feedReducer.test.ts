import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { getFeedThunk, getOrdersThunk } from './feedSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      feed: feedReducer
    }
  });

describe('Тесты экшенов ленты', () => {
  describe('Тесты экшена получения ленты', () => {
    test('Тест экшена ожидания ответ после запроса ленты', () => {
      const store = setupStore();
      store.dispatch({ type: getFeedThunk.pending.type });
      const state = store.getState();
      expect(state.feed.isLoading).toBeTruthy();
      expect(state.feed.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса ленты', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: getFeedThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBeFalsy();
      expect(state.feed.error).toBe(error);
    });
    test('Тест экшена успешного ответа получения ленты', () => {
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
          },
          {
            _id: '6820ca0bc2f30c001cb22f69',
            ingredients: [
              '643d69a5c3f7b9001cfa093d',
              '643d69a5c3f7b9001cfa0947',
              '643d69a5c3f7b9001cfa0943',
              '643d69a5c3f7b9001cfa093d'
            ],
            status: 'done',
            name: 'Space флюоресцентный фалленианский бургер',
            createdAt: '2025-05-11T16:02:19.716Z',
            updatedAt: '2025-05-11T16:02:20.462Z',
            number: 76820
          }
        ],
        total: 76449,
        totalToday: 77
      };
      const store = setupStore();
      store.dispatch({
        type: getFeedThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBeFalsy();
      expect(state.feed.error).toBeNull();
      expect(state.feed.orders).toEqual(mockedPayload.orders);
      expect(state.feed.total).toBe(mockedPayload.total);
      expect(state.feed.totalToday).toBe(mockedPayload.totalToday);
    });
  });
  describe('Тесты экшена получения ленты ЛК', () => {
    test('Тест экшена ожидания ответ после запроса ленты', () => {
      const store = setupStore();
      store.dispatch({ type: getOrdersThunk.pending.type });
      const state = store.getState();
      expect(state.feed.isLoading).toBeTruthy();
      expect(state.feed.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса ленты', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: getOrdersThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBeFalsy();
      expect(state.feed.error).toBe(error);
    });
    test('Тест экшена успешного ответа получения ленты', () => {
      const mockedPayload = {
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
      };
      const store = setupStore();
      store.dispatch({
        type: getOrdersThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBeFalsy();
      expect(state.feed.error).toBeNull();
      expect(state.feed.orders).toEqual(mockedPayload);
    });
  });
});
