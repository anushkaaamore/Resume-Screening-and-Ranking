import api from './api';

export async function createCandidate(payload) {
  const response = await api.post('/candidate', payload);
  return response.data;
}

export async function getCandidates(params = {}) {
  const response = await api.get('/candidate', { params });
  return response.data;
}

export async function updateCandidate(id, payload) {
  const response = await api.put(`/candidate/${id}`, payload);
  return response.data;
}

export async function deleteCandidate(id) {
  const response = await api.delete(`/candidate/${id}`);
  return response.data;
}
