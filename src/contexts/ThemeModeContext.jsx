import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { updateThemeMode } from '../firebase/profile';
import {
  applyDocumentTheme,
  normalizeThemeMode,
  readStoredThemeMode,
  writeStoredThemeMode,
} from '../utils/themeMode';

const ThemeModeContext = createContext(null);

export function ThemeModeProvider({ children }) {
  const { user, profile } = useAuth();
  const [optimisticMode, setOptimisticMode] = useState(null);

  const mode = normalizeThemeMode(
    optimisticMode || profile?.themeMode || readStoredThemeMode(),
  );

  useEffect(() => {
    applyDocumentTheme(mode);
    writeStoredThemeMode(mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      async setThemeMode(nextMode) {
        const next = normalizeThemeMode(nextMode);
        const previous = mode;
        if (next === previous) return;

        setOptimisticMode(next);
        writeStoredThemeMode(next);
        applyDocumentTheme(next);

        if (!user) return;

        try {
          await updateThemeMode(user.uid, next);
        } catch (error) {
          setOptimisticMode(previous);
          writeStoredThemeMode(previous);
          applyDocumentTheme(previous);
          throw error;
        }
      },
    }),
    [mode, user],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider.');
  }
  return context;
}
