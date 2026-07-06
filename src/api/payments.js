import client from './client';

export const getTransactions = () => client.get('/payments/transactions/').then((r) => r.data);

export const simulateIncomingTransfer = (payload) =>
  client.post('/payments/webhook/', payload).then((r) => r.data);
