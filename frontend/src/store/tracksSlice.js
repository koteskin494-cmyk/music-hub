import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://music-hub-backend.onrender.com/api' 
  : 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};


export const fetchTracks = createAsyncThunk(
  'tracks/fetchTracks',
  async ({ search = '', sortBy = 'createdAt', order = 'desc' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    
    const response = await axios.get(`${API_URL}/tracks?${params.toString()}`, getAuthHeaders());
    return response.data;
  }
);

export const fetchTrackById = createAsyncThunk(
  'tracks/fetchTrackById',
  async (id) => {
    const response = await axios.get(`${API_URL}/tracks/${id}`, getAuthHeaders());
    return response.data;
  }
);

export const createTrack = createAsyncThunk(
  'tracks/createTrack',
  async (trackData) => {
    const response = await axios.post(`${API_URL}/tracks`, trackData, getAuthHeaders());
    return response.data;
  }
);

export const updateTrack = createAsyncThunk(
  'tracks/updateTrack',
  async ({ id, trackData }) => {
    const response = await axios.put(`${API_URL}/tracks/${id}`, trackData, getAuthHeaders());
    return response.data;
  }
);

export const deleteTrack = createAsyncThunk(
  'tracks/deleteTrack',
  async (id) => {
    await axios.delete(`${API_URL}/tracks/${id}`, getAuthHeaders());
    return id;
  }
);

const tracksSlice = createSlice({
  name: 'tracks',
  initialState: {
    list: [],
    currentTrack: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTrack: (state) => {
      state.currentTrack = null;
    }
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(fetchTrackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrackById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrack = action.payload;
      })
      .addCase(fetchTrackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    
      .addCase(createTrack.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      
      .addCase(updateTrack.fulfilled, (state, action) => {
        state.list = state.list.map(track =>
          track._id === action.payload._id ? action.payload : track
        );
        state.currentTrack = action.payload;
      })
      
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.list = state.list.filter(track => track._id !== action.payload);
        if (state.currentTrack?._id === action.payload) {
          state.currentTrack = null;
        }
      });
  }
});

export const { clearError, clearCurrentTrack } = tracksSlice.actions;
export default tracksSlice.reducer;