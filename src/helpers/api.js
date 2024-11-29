import axios from 'axios';

const API_URL = 'http://192.168.0.170:3003/api'; // URL вашего API

const api = axios.create({
  baseURL: API_URL,
});

// Добавляем токен в заголовок
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
