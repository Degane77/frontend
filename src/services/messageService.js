import axios from 'axios';

export const getMessages = async (userId) => {
  if (!userId) throw new Error('User ID is required to fetch messages');
  return axios.get(`/api/messages/user/${userId}`);
};

export const sendMessage = async (data) => {
  return axios.post('/api/messages', data);
};

export const getDoctorMessages = async (doctorId) => {
  return axios.get(`/api/messages/doctor/${doctorId}`);
};

export const getAllMessages = async () => {
  return axios.get('/api/messages');
};

export const markAsRead = async (messageId) => {
  return axios.patch(`/api/messages/${messageId}/read`);
};
