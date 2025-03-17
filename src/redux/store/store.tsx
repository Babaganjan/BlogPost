// store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../slice/index';

const store = configureStore({
  reducer: rootReducer,
});

// Определяем тип RootState
export type RootState = ReturnType<typeof store.getState>;

// Определяем тип Dispatch для использования в приложении
export type AppDispatch = typeof store.dispatch;

export default store;
