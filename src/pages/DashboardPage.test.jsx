import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { theme } from '../theme';
import DashboardPage from './DashboardPage';

const snippetState = vi.hoisted(() => ({
  current: { snippets: [], loading: false, error: '' },
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'user-one' },
    profile: { username: 'Ada', themeMode: 'light' },
  }),
}));

vi.mock('../hooks/useSnippets', () => ({
  useSnippets: () => snippetState.current,
}));

vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
}));

vi.mock('../components/AppShell', () => ({
  AppShell: ({ children, actions }) => (
    <div>
      {actions}
      {children}
    </div>
  ),
}));

vi.mock('../firebase/snippets', () => ({
  addSnippet: vi.fn(),
  removeSnippet: vi.fn(),
  setSnippetStarred: vi.fn(),
  updateSnippet: vi.fn(),
}));

function renderDashboard(path = '/dashboard') {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <DashboardPage />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    snippetState.current = { snippets: [], loading: false, error: '' };
  });

  it('shows a loading state while snippets are fetched', () => {
    snippetState.current = { snippets: [], loading: true, error: '' };
    renderDashboard();
    expect(screen.getByLabelText('Loading snippets')).toBeInTheDocument();
  });

  it('shows an error when snippets cannot be loaded', () => {
    snippetState.current = {
      snippets: [],
      loading: false,
      error: 'Your snippets could not be loaded.',
    };
    renderDashboard();
    expect(
      screen.getByText('Your snippets could not be loaded.'),
    ).toBeInTheDocument();
  });

  it('invites a first snippet when the shelf is empty', () => {
    renderDashboard();
    expect(
      screen.getByRole('heading', { name: 'Your Shelf Is Ready' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'New Snippet' })).toHaveLength(
      2,
    );
  });

  it('explains when search has no matches', () => {
    snippetState.current = {
      snippets: [
        {
          id: 'one',
          content: 'Office address',
          isStarred: false,
          createdAt: new Date('2024-01-01'),
        },
      ],
      loading: false,
      error: '',
    };
    renderDashboard('/dashboard?q=nothing-here');
    expect(
      screen.getByRole('heading', { name: 'No Matching Snippets' }),
    ).toBeInTheDocument();
  });

  it('explains when there are no favorites', () => {
    snippetState.current = {
      snippets: [
        {
          id: 'one',
          content: 'Office address',
          isStarred: false,
          createdAt: new Date('2024-01-01'),
        },
      ],
      loading: false,
      error: '',
    };
    renderDashboard('/dashboard?view=favorites');
    expect(
      screen.getByRole('heading', { name: 'No Favorites Yet' }),
    ).toBeInTheDocument();
  });

  it('renders snippet cards when there is copy to use', () => {
    snippetState.current = {
      snippets: [
        {
          id: 'one',
          content: 'Thanks for sending this over.',
          isStarred: true,
          createdAt: new Date('2024-01-01'),
        },
      ],
      loading: false,
      error: '',
    };
    renderDashboard();
    expect(
      screen.getByText('Thanks for sending this over.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /copy snippet/i }),
    ).toBeInTheDocument();
  });
});
