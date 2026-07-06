import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as disputesApi from '../api/disputes';
import { useUIStore } from '../stores/uiStore';

export const useDisputes = () =>
  useQuery({
    queryKey: ['disputes'],
    queryFn: disputesApi.getDisputes,
    staleTime: 30_000,
  });

export const useDispute = (id) =>
  useQuery({
    queryKey: ['dispute', id],
    queryFn: () => disputesApi.getDispute(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'open' ? 5000 : false;
    },
  });

export const useRaiseDispute = () => {
  const addToast = useUIStore((s) => s.addToast);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => disputesApi.raiseDispute(data).then((r) => r.data),
    onSuccess: () => {
      addToast('Dispute raised successfully', 'success');
      qc.invalidateQueries({ queryKey: ['disputes'] });
    },
    onError: (err) => addToast(err.response?.data?.detail || 'Failed to raise dispute', 'error'),
  });
};

export const useSubmitEvidence = (id) => {
  const addToast = useUIStore((s) => s.addToast);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (evidence) => disputesApi.submitEvidence(id, evidence).then((r) => r.data),
    onSuccess: () => {
      addToast('Evidence submitted , AI is reviewing…', 'info');
      qc.invalidateQueries({ queryKey: ['dispute', id] });
    },
    onError: (err) => addToast(err.response?.data?.detail || 'Evidence submission failed', 'error'),
  });
};

export const useResolveDispute = (id) => {
  const addToast = useUIStore((s) => s.addToast);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => disputesApi.resolveDispute(id).then((r) => r.data),
    onSuccess: () => {
      addToast('Arbitration completed.', 'success');
      qc.invalidateQueries({ queryKey: ['dispute', id] });
      qc.invalidateQueries({ queryKey: ['disputes'] });
    },
    onError: (err) => addToast(err.response?.data?.detail || 'AI arbitration failed', 'error'),
  });
};

