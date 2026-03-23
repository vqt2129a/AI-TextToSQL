import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const sendQuery = async (question, history = []) => {
  const { data } = await api.post('/api/query', { question, history });
  return data;
};

export const getStatus = async () => {
  const { data } = await api.get('/api/status');
  return data;
};

export const getDbInfo = async () => {
  const { data } = await api.get('/api/db-info');
  return data;
};

export default api;
