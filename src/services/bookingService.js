
import axios from 'axios';

// Update payment status for a booking
export const updatePaymentStatus = (id, paymentData) => {
  return axios.put(`/api/bookings/${id}/payment-status`, paymentData, { headers: getAuthHeaders() });
};

const API = '/api/bookings';

// Get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new booking
export const createBooking = (bookingData, config = {}) => {
  // Merge config.headers with getAuthHeaders()
  const headers = { ...getAuthHeaders(), ...(config.headers || {}) };
  return axios.post(API, bookingData, { ...config, headers });
};

// Get user's bookings
export const getUserBookings = () => {
  return axios.get(`${API}/user`, { headers: getAuthHeaders() });
};

// Get booking by ID
export const getBookingById = (id) => {
  return axios.get(`${API}/${id}`, { headers: getAuthHeaders() });
};

// Update booking status
export const updateBookingStatus = (id, statusData) => {
  return axios.put(`${API}/${id}/status`, statusData, { headers: getAuthHeaders() });
};

// Cancel booking
export const cancelBooking = (id) => {
  return axios.put(`${API}/${id}/cancel`, {}, { headers: getAuthHeaders() });
};

// Get available time slots for a doctor
export const getAvailableSlots = (doctorId, date) => {
  return axios.get(`${API}/available-slots/${doctorId}/${date}`);
};

// Admin: Get all bookings
export const getAllBookings = () => {
  return axios.get(`${API}/admin/all`, { headers: getAuthHeaders() });
};

// Admin: Get doctor's bookings
export const getDoctorBookings = (doctorId) => {
  return axios.get(`${API}/admin/doctor/${doctorId}`, { headers: getAuthHeaders() });
};

// Admin: Delete booking
export const deleteBooking = (id) => {
  return axios.delete(`${API}/admin/${id}`, { headers: getAuthHeaders() });
};