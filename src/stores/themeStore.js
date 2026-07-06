import { create } from 'zustand';

const getInitialDark = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create((set, get) => ({
  isDark: getInitialDark(),

  toggle: () => {
    const next = !get().isDark;
    set({ isDark: next });
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  },

  init: () => {
    const dark = getInitialDark();
    document.documentElement.classList.toggle('dark', dark);
    set({ isDark: dark });
  },
}));
