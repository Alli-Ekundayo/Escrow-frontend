import client from './client';

export const register = (data) => client.post('/auth/register/', data);
export const login = (data) => client.post('/auth/login/', data);
export const refreshToken = (refresh) => client.post('/auth/token/refresh/', { refresh });
export const getProfile = () => client.get('/auth/profile/');
export const updateProfile = (data) => client.patch('/auth/profile/', data);
export const withdraw = (data) => client.post('/auth/withdraw/', data);
export const searchUsers = (q) => client.get('/auth/users/search/', { params: { q } }).then((r) => r.data);
export const debugWallet = () => client.post('/auth/debug-wallet/');
