import { create } from 'zustand';

export const useUIStore = create((set) => ({
  toasts: [],
  modal: null,

  addToast: (message, type = 'info') => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 5000);
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  openModal: (modalName, data = null) => set({ modal: { name: modalName, data } }),
  closeModal: () => set({ modal: null }),
}));
