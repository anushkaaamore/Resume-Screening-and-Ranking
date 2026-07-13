import api from './api';

export async function predictCandidate(payload) {
  const response = await api.post('/predict', payload);
  return response.data;
}

export async function getPredictionHistory(params = {}) {
  const response = await api.get('/predict/history', { params });
  return response.data;
}
