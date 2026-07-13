import api from './api';

export async function getDashboardMetrics() {
  const response = await api.get('/dashboard');
  return response.data;
}

export async function getModelPerformance() {
  const response = await api.get('/model-performance');
  return response.data;
}
