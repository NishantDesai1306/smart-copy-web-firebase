import { createTheme } from '@mui/material/styles';

const typography = {
  fontFamily: 'Manrope Variable, system-ui, sans-serif',
  h1: {
    fontSize: 'clamp(2.6rem, 7vw, 5.8rem)',
    fontWeight: 760,
    letterSpacing: '-0.055em',
    lineHeight: 0.98,
  },
  h2: {
    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
    fontWeight: 740,
    letterSpacing: '-0.04em',
    lineHeight: 1.05,
  },
  h3: {
    fontSize: 'clamp(1.45rem, 2.5vw, 2rem)',
    fontWeight: 720,
    letterSpacing: '-0.025em',
    lineHeight: 1.15,
  },
  button: {
    fontWeight: 720,
    textTransform: 'none',
    letterSpacing: '-0.01em',
  },
};

const components = {
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        minHeight: 44,
        borderRadius: 12,
        paddingInline: 18,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: { root: { minWidth: 44, minHeight: 44 } },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        minHeight: 44,
        paddingInline: 16,
      },
    },
  },
  MuiTextField: {
    defaultProps: { fullWidth: true },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 22, backgroundImage: 'none' },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: { padding: '24px 24px 8px' },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: { padding: '8px 24px 4px' },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px 24px',
        gap: 12,
        '& > :not(style) ~ :not(style)': { marginLeft: 0 },
      },
    },
  },
  MuiTooltip: {
    defaultProps: { arrow: true },
  },
};

const palettes = {
  light: {
    mode: 'light',
    primary: {
      main: '#2457ff',
      dark: '#173cc7',
      light: '#e8edff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00a6a6',
      dark: '#007979',
      contrastText: '#ffffff',
    },
    warning: { main: '#f7b32b' },
    error: { main: '#c72c41' },
    background: {
      default: '#f6f8fc',
      paper: '#ffffff',
    },
    text: {
      primary: '#101828',
      secondary: '#526079',
    },
    divider: '#dce4f2',
    custom: {
      slip: '#eaf0fa',
      copyRail: '#e8edff',
      copyFg: '#173cc7',
      copyHover: '#d9e2ff',
      bar: 'rgba(246, 248, 252, 0.92)',
    },
  },
  dark: {
    mode: 'dark',
    primary: {
      main: '#6b8cff',
      dark: '#2457ff',
      light: '#1e2d55',
      contrastText: '#0c1220',
    },
    secondary: {
      main: '#2ec9c9',
      dark: '#00a6a6',
      contrastText: '#0c1220',
    },
    warning: { main: '#f7b32b' },
    error: { main: '#ff6b7d' },
    background: {
      default: '#0c1220',
      paper: '#151c2c',
    },
    text: {
      primary: '#e8eef8',
      secondary: '#9aa8bd',
    },
    divider: '#2a3548',
    custom: {
      slip: '#1b2436',
      copyRail: '#1e2d55',
      copyFg: '#c5d2ff',
      copyHover: '#2a3a63',
      bar: 'rgba(12, 18, 32, 0.88)',
    },
  },
};

export function createAppTheme(mode = 'light') {
  const resolved = mode === 'dark' ? 'dark' : 'light';
  return createTheme({
    palette: palettes[resolved],
    shape: { borderRadius: 16 },
    typography,
    components,
  });
}

export const theme = createAppTheme('light');
