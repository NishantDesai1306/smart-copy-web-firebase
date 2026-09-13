import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeModeToggle } from './ThemeModeToggle';
import { theme } from '../theme';

const setThemeMode = vi.hoisted(() => vi.fn());
const enqueueSnackbar = vi.hoisted(() => vi.fn());
const themeMode = vi.hoisted(() => ({ current: 'light' }));

vi.mock('../contexts/ThemeModeContext', () => ({
  useThemeMode: () => ({
    mode: themeMode.current,
    setThemeMode,
  }),
}));

vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar }),
}));

function renderToggle() {
  return render(
    <ThemeProvider theme={theme}>
      <ThemeModeToggle />
    </ThemeProvider>,
  );
}

describe('ThemeModeToggle', () => {
  beforeEach(() => {
    setThemeMode.mockReset();
    enqueueSnackbar.mockReset();
    themeMode.current = 'light';
  });

  it('asks to switch into dark mode from light', async () => {
    const user = userEvent.setup();
    themeMode.current = 'light';
    setThemeMode.mockResolvedValue();
    renderToggle();

    await user.click(
      screen.getByRole('button', { name: 'Switch to dark mode' }),
    );
    expect(setThemeMode).toHaveBeenCalledWith('dark');
  });

  it('shows an error when the preference cannot be saved', async () => {
    const user = userEvent.setup();
    themeMode.current = 'dark';
    setThemeMode.mockRejectedValue(new Error('offline'));
    renderToggle();

    await user.click(
      screen.getByRole('button', { name: 'Switch to light mode' }),
    );
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'offline',
      expect.objectContaining({ variant: 'error' }),
    );
  });
});
