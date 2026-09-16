import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ORIGIN = /^https?:\/\//.test(API_URL)
  ? new URL(API_URL).origin
  : window.location.origin;

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function extractErrorMessage(err) {
  return err?.response?.data?.error || 'Não foi possível completar a ação. Tente novamente.';
}

export function imageUrl(path) {
  if (!path) return null;
  return `${API_ORIGIN}${path}`;
}

export default client;
