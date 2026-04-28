import api from './index';

export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const updateCartItem = (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity });
export const removeFromCart = (itemId) => api.delete(`/cart/item/${itemId}`);
export const clearCart = () => api.delete('/cart/clear');
export const validatePromo = (code) => api.post('/cart/promo', { code });