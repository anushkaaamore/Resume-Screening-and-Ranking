import api from './api';

export async function loginRecruiter(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function registerRecruiter(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}
