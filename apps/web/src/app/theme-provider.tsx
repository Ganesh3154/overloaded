'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: 'dark', setTheme: () => {} });

let themeListeners: Array<() => void> = [];

function subscribeTheme(callback: () => void) {
  themeListeners.push(callback);
  return () => {
    themeListeners = themeListeners.filter((l) => l !== callback);
  };
}

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem('theme');
  return stored === 'light' ? 'light' : 'dark';
}

function getServerThemeSnapshot(): Theme {
  return 'dark';
}

function writeTheme(t: Theme) {
  localStorage.setItem('theme', t);
  document.documentElement.classList.toggle('light', t === 'light');
  themeListeners.forEach((l) => l());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme: writeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
