import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as escrowApi from '../api/escrow';
import { useUIStore } from '../stores/uiStore';

export const useAgreements = () =>
  useQuery({
    queryKey: ['agreements'],
    queryFn: escrowApi.getAgreements,
    staleTime: 30_000,
  });

export const useAgreement = (id) =>
  useQuery({
    queryKey: ['agreement', id],
    queryFn: () => escrowApi.getAgreement(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'pending_proof' || status === 'active' ? 5000 : false;
    },
  });

export const useDraftWithAI = () => {
  const addToast = useUIStore((s) => s.addToast);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => escrowApi.draftWithAI(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agreements'] }),
    onError: (err) => addToast(err.response?.data?.detail || 'Failed to draft agreement', 'error'),
  });
};

export const useLockFunds = (id) => {
  const addToast = useUIStore((s) => s.addToast);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => escrowApi.lockFunds(id).then((r) => r.data),
    onSuccess: (data) => {
      const returnedStatus = (data?.status ?? data?.agreement?.status ?? '').toLowerCase();
      if (returnedStatus === 'active') {
        addToast('Escrow funded and activated from your wallet balance!', 'success');
      } else {
        addToast('Funding initialized. Complete the bank transfer to activate escrow.', 'success');
      }
      qc.invalidateQueries({ queryKey: ['agreement', id] });
      qc.invalidateQueries({ queryKey: ['agreements'] });
    },
    onError: (err) => addToast(err.response?.data?.detail || 'Failed to lock funds', 'error'),
  });
};

export const useSubmitProof = (id) => {
  const addToast = useUIStore((s) => s.addToast);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => escrowApi.submitProof(id, formData).then((r) => r.data),
    onSuccess: () => {
      addToast('Proof submitted , AI is verifying…', 'info');
      qc.invalidateQueries({ queryKey: ['agreement', id] });
    },
    onError: (err) => addToast(err.response?.data?.detail || 'Proof submission failed', 'error'),
  });
};

export const useReleaseFunds = (id) => {
  const addToast = useUIStore((s) => s.addToast);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => escrowApi.releaseFunds(id).then((r) => r.data),
    onSuccess: () => {
      addToast('Funds released to seller.', 'success');
      qc.invalidateQueries({ queryKey: ['agreement', id] });
    },
    onError: (err) => addToast(err.response?.data?.detail || 'Release failed', 'error'),
  });
};
