import client from './client';

export const getTransactions = () => client.get('/payments/transactions/').then((r) => r.data);
