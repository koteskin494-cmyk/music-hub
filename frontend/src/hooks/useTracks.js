import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useTracks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }, []);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/tracks`, getAuthHeaders());
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tracks');
      setLoading(false);
      return [];
    }
  }, [getAuthHeaders]);

  const createTrack = useCallback(async (data) => {
    try {
      const res = await axios.post(`${API_URL}/tracks`, data, getAuthHeaders());
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message);
      throw err;
    }
  }, [getAuthHeaders]);

  const updateTrack = useCallback(async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/tracks/${id}`, data, getAuthHeaders());
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message);
      throw err;
    }
  }, [getAuthHeaders]);

  const deleteTrack = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/tracks/${id}`, getAuthHeaders());
      return true;
    } catch (err) {
      setError(err.response?.data?.message);
      throw err;
    }
  }, [getAuthHeaders]);

  return {
    loading,
    error,
    fetchTracks,
    createTrack,
    updateTrack,
    deleteTrack
  };
};