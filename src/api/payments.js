import api from './index';

export const createPaymentOrder = (orderId) => api.post('/payments/create', { orderId });
export const verifyPayment = (data) => api.post('/payments/verify', data);
export const getPaymentStatus = (orderId) => api.get(`/payments/status/${orderId}`);