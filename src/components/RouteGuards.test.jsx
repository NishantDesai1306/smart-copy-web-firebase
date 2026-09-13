import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicOnly, RequireAuth } from './RouteGuards';

const authState = vi.hoisted(() => ({ current: {} }));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => authState.current,
}));

function renderRoutes(element, path = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/dashboard" element={element} />
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('route guards', () => {
  beforeEach(() => {
    authState.current = { user: null, loading: false, redirectPath: '' };
  });

  it('redirects signed-out users from private routes', () => {
    renderRoutes(
      <RequireAuth>
        <div>Private content</div>
      </RequireAuth>,
    );
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('renders private routes for authenticated users', () => {
    authState.current = { user: { uid: 'user-one' }, loading: false };
    renderRoutes(
      <RequireAuth>
        <div>Private content</div>
      </RequireAuth>,
    );
    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  it('redirects authenticated users away from public-only screens', () => {
    authState.current = {
      user: { uid: 'user-one' },
      loading: false,
      redirectPath: '/dashboard',
    };
    renderRoutes(
      <PublicOnly>
        <div>Login form</div>
      </PublicOnly>,
    );
    expect(screen.queryByText('Login form')).not.toBeInTheDocument();
  });

  it('shows a loading screen while auth is unresolved', () => {
    authState.current = { user: null, loading: true };
    renderRoutes(
      <RequireAuth>
        <div>Private content</div>
      </RequireAuth>,
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Opening your snippets…',
    );
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
});
