import { act, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { describe, expect, it } from 'vitest';
import { OfflineNotice } from './OfflineNotice';
import { theme } from '../theme';

function renderNotice() {
  return render(
    <ThemeProvider theme={theme}>
      <OfflineNotice />
    </ThemeProvider>,
  );
}

describe('OfflineNotice', () => {
  it('stays hidden while the browser is online', () => {
    renderNotice();
    expect(screen.queryByText(/you’re offline/i)).not.toBeInTheDocument();
  });

  it('warns when the connection drops', () => {
    renderNotice();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.getByText(/you’re offline/i)).toBeInTheDocument();
  });
});
