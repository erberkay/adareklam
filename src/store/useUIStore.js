import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  loadingScreenDone: false,
  activeModal: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setLoadingScreenDone: () => set({ loadingScreenDone: true }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));

export default useUIStore;
