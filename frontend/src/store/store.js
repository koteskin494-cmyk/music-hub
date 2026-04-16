import { configureStore } from '@reduxjs/toolkit';
import tracksReducer from './tracksSlice';

export const store = configureStore({
  reducer: {
    tracks: tracksReducer
  }
});