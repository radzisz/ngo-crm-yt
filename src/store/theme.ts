import { create } from 'zustand';
import { ThemeMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system', // Default to system preference
  
  setMode: (mode: ThemeMode) => {
    set({ mode });
    applyTheme(mode);
  },
  
  toggleMode: () => {
    set((state) => {
      const newMode = state.mode === 'dark' ? 'light' : 'dark';
      applyTheme(newMode);
      return { mode: newMode };
    });
  },
}));

function applyTheme(mode: ThemeMode) {
  const isDark = 
    mode === 'dark' || 
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Initialize theme on load
export function initializeTheme() {
  const { mode } = useThemeStore.getState();
  applyTheme(mode);
  
  // Listen for system preference changes if in system mode
  if (mode === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const { mode } = useThemeStore.getState();
      if (mode === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
  
  return undefined;
}