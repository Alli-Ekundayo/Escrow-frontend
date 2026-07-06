import client from './client';

export const getAgreements = () => client.get('/escrow/').then((r) => r.data?.results ?? r.data);
export const getAgreement = (id) => client.get(`/escrow/${id}/`).then((r) => r.data);
export const draftWithAI = (data) => client.post('/escrow/draft-with-ai/', data);
export const lockFunds = (id) => client.post(`/escrow/${id}/lock-funds/`);
export const submitProof = (id, formData) =>
  client.post(`/escrow/${id}/submit-proof/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const releaseFunds = (id) => client.post(`/escrow/${id}/release-funds/`);
export const requestRefund = (id) => client.post(`/escrow/${id}/request-refund/`);
