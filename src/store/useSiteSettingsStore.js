import { create } from 'zustand';
import { DEFAULT_SITE_SETTINGS } from '../lib/constants';

const useSiteSettingsStore = create((set, get) => ({
  settings: DEFAULT_SITE_SETTINGS,
  loaded: false,

  setSettings: (settings) => {
    set({ settings: { ...DEFAULT_SITE_SETTINGS, ...settings }, loaded: true });
    // Dinamik CSS değişkenlerini uygula
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
    }
  },

  updateSetting: (key, value) => {
    const current = get().settings;
    set({ settings: { ...current, [key]: value } });
  },

  getSetting: (key) => get().settings[key],
}));

export default useSiteSettingsStore;
