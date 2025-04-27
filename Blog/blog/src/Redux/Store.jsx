import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import searchReducer from './SearchSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
});
