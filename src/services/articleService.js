import axios from 'axios';

const API = '/api/articles';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchArticles = () => axios.get(API);
export const fetchArticleById = (id) => axios.get(`${API}/${id}`);
export const createArticle = (data) => axios.post(API, data, { headers: getAuthHeaders() });
export const updateArticle = (id, data) => axios.put(`${API}/${id}`, data, { headers: getAuthHeaders() });
export const deleteArticle = (id) => axios.delete(`${API}/${id}`, { headers: getAuthHeaders() });
