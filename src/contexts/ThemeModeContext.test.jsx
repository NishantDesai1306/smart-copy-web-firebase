import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeModeProvider, useThemeMode } from './ThemeModeContext';
import { THEME_STORAGE_KEY } from '../utils/themeMode';

const authState = vi.hoisted(() => ({ current: {} }));
const updateThemeMode = vi.hoisted(() => vi.fn());

vi.mock('./AuthContext', () => ({
  useAuth: () => authState.current,
}));

vi.mock('../firebase/profile', () => ({
  updateThemeMode: (...args) => updateThemeMode(...args),
}));

function Probe() {
  const { mode, setThemeMode } = useThemeMode();
  return (
    <button type="button" onClick={() => setThemeMode('dark')}>
      {mode}
    </button>
  );
}

describe('ThemeModeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    updateThemeMode.mockReset();
    authState.current = { user: null, profile: null };
    document.head.innerHTML = '<meta name="theme-color" content="#2457ff" />';
  });

  it('uses the profile theme when the user is signed in', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    authState.current = {
      user: { uid: 'user-one' },
      profile: { themeMode: 'dark' },
    };

    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('dark');
  });

  it('saves the theme to Firestore for a signed-in user', async () => {
    const user = userEvent.setup();
    authState.current = {
      user: { uid: 'user-one' },
      profile: { themeMode: 'light' },
    };
    updateThemeMode.mockResolvedValue();

    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'light' }));

    await waitFor(() => {
      expect(updateThemeMode).toHaveBeenCalledWith('user-one', 'dark');
    });
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('does not write to Firestore when signed out', async () => {
    const user = userEvent.setup();
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'light' }));

    expect(updateThemeMode).not.toHaveBeenCalled();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
