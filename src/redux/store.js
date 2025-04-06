// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
