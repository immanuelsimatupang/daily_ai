import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Buat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API untuk autentikasi
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// API untuk artikel
export const articleAPI = {
  getArticles: (params) => api.get('/articles', { params }),
  getArticleById: (id) => api.get(`/articles/${id}`),
  createArticle: (articleData) => api.post('/articles', articleData),
  updateArticle: (id, articleData) => api.put(`/articles/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
};

// API untuk manajemen pengguna
export const userAPI = {
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  setAdminRole: (id, isAdmin) => api.put(`/users/${id}/role`, { isAdmin }),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
};

export default api;