import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import '@fontsource-variable/manrope';
import '@fontsource-variable/roboto-mono';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeModeContext';
import { OfflineNotice } from './components/OfflineNotice';
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt';
import { createAppTheme } from './theme';
import './styles.css';

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3600}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <BrowserRouter>
          <App />
          <OfflineNotice />
          <PwaUpdatePrompt />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeModeProvider>
        <ThemedApp />
      </ThemeModeProvider>
    </AuthProvider>
  </StrictMode>,
);
