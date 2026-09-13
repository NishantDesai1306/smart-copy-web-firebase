import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { theme } from '../theme';
import ProfilePage from './ProfilePage';

const authState = vi.hoisted(() => ({ current: {} }));
const updateUserProfile = vi.hoisted(() => vi.fn());
const uploadUserAvatar = vi.hoisted(() => vi.fn());
const changePassword = vi.hoisted(() => vi.fn());
const linkSocialProvider = vi.hoisted(() => vi.fn());
const enqueueSnackbar = vi.hoisted(() => vi.fn());

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => authState.current,
}));

vi.mock('../firebase/profile', () => ({
  updateUserProfile: (...args) => updateUserProfile(...args),
  uploadUserAvatar: (...args) => uploadUserAvatar(...args),
}));

vi.mock('../firebase/auth', () => ({
  changePassword: (...args) => changePassword(...args),
  linkSocialProvider: (...args) => linkSocialProvider(...args),
}));

vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar }),
}));

vi.mock('../components/AppShell', () => ({
  AppShell: ({ children }) => <div>{children}</div>,
}));

function signedInUser(overrides = {}) {
  return {
    user: {
      uid: 'user-one',
      email: 'ada@example.com',
      providerData: [{ providerId: 'password' }],
      ...overrides.user,
    },
    profile: {
      username: 'Ada',
      email: 'ada@example.com',
      avatarUrl: '',
      themeMode: 'light',
      ...overrides.profile,
    },
  };
}

function renderProfile(path = '/dashboard/profile') {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <ProfilePage />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    authState.current = signedInUser();
    updateUserProfile.mockReset().mockResolvedValue();
    uploadUserAvatar.mockReset().mockResolvedValue();
    changePassword.mockReset().mockResolvedValue();
    linkSocialProvider.mockReset().mockResolvedValue();
    enqueueSnackbar.mockReset();
  });

  it('shows the current name and a read-only email', () => {
    renderProfile();
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
    expect(screen.getByLabelText('Email')).toHaveValue('ada@example.com');
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('saves account name changes', async () => {
    const user = userEvent.setup();
    renderProfile();

    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith('user-one', {
        username: 'Ada Lovelace',
      });
    });
    expect(enqueueSnackbar).toHaveBeenCalledWith('Profile updated.', {
      variant: 'success',
    });
  });

  it('rejects a profile photo larger than 5 MB', async () => {
    const user = userEvent.setup();
    renderProfile();
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

    await user.upload(document.querySelector('input[type="file"]'), file);

    expect(
      screen.getByText('Choose an image smaller than 5 MB.'),
    ).toBeInTheDocument();
    expect(uploadUserAvatar).not.toHaveBeenCalled();
  });

  it('shows password change controls for email accounts', () => {
    renderProfile('/dashboard/profile?tab=security');
    expect(
      screen.getByRole('heading', { name: 'Change Password' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
  });

  it('lets a social-only account add a password', async () => {
    const user = userEvent.setup();
    authState.current = signedInUser({
      user: {
        uid: 'user-one',
        email: 'ada@example.com',
        providerData: [{ providerId: 'google.com' }],
      },
    });
    renderProfile('/dashboard/profile?tab=security');

    expect(
      screen.getByRole('heading', { name: 'Add a Password' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Google Connected' }),
    ).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Connect Facebook' }));
    await waitFor(() => {
      expect(linkSocialProvider).toHaveBeenCalledWith('facebook');
    });
  });
});
