import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  userRole: null,
  loading: true,

  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
  setLoading: (loading) => set({ loading }),

  clearAuth: () => set({ user: null, userRole: null, loading: false }),
}));

export default useAuthStore;
