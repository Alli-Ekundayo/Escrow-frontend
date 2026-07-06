import client from './client';

export const getDisputes = () => client.get('/disputes/').then((r) => r.data?.results ?? r.data);
export const getDispute = (id) => client.get(`/disputes/${id}/`).then((r) => r.data);
export const raiseDispute = (data) => client.post('/disputes/', data);
export const submitEvidence = (id, evidence) =>
  client.post(`/disputes/${id}/submit-evidence/`, { evidence });
export const resolveDispute = (id) => client.post(`/disputes/${id}/resolve/`);

