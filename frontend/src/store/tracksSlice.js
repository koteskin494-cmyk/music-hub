import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  error: null
};

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTracks: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    addTrack: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateTrack: (state, action) => {
      const index = state.list.findIndex(track => track._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeTrack: (state, action) => {
      state.list = state.list.filter(track => track._id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { setLoading, setTracks, addTrack, updateTrack, removeTrack, setError, clearError } = tracksSlice.actions;
export default tracksSlice.reducer;