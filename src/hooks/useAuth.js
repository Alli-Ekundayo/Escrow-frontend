import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const store = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      await store.login(credentials);
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      await store.register(payload);
      addToast('Account created. Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Registration failed';
      addToast(msg, 'error');
      throw err;
    }
  };

  const logout = () => {
    store.logout();
    navigate('/login');
  };

  return { ...store, login, register, logout };
};
