import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '../theme';
import { SnippetDialog } from './SnippetDialog';

function renderDialog(props) {
  return render(
    <ThemeProvider theme={theme}>
      <SnippetDialog onClose={vi.fn()} onSave={vi.fn()} {...props} />
    </ThemeProvider>,
  );
}

function useMobileViewport() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query) => ({
      matches: query.includes('max-width'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe('SnippetDialog', () => {
  it('replaces form contents when a different snippet is edited', () => {
    const { rerender } = renderDialog({
      mode: 'edit',
      snippet: { id: 'one', content: 'First snippet' },
    });

    expect(screen.getByLabelText('Snippet Text')).toHaveValue('First snippet');

    rerender(
      <ThemeProvider theme={theme}>
        <SnippetDialog
          mode="edit"
          snippet={{ id: 'two', content: 'Second snippet' }}
          onClose={vi.fn()}
          onSave={vi.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Snippet Text')).toHaveValue('Second snippet');
  });

  it('saves a new snippet from the create dialog', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderDialog({ mode: 'create', onSave });

    expect(
      screen.getByRole('heading', { name: 'New Snippet' }),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText('Snippet Text'), 'Office hours');
    await user.click(screen.getByRole('button', { name: 'Create Snippet' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Office hours');
    });
  });

  it('keeps long edit content intact with actions available', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const content = Array.from(
      { length: 120 },
      (_, index) => `Reusable line ${index + 1}`,
    ).join('\n');

    renderDialog({
      mode: 'edit',
      snippet: { id: 'long', content },
      onSave,
    });

    expect(screen.getByLabelText('Snippet Text')).toHaveValue(content);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(content));
  });

  it('uses a full-screen editor with save and cancel in the mobile header', async () => {
    useMobileViewport();
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSave = vi.fn();

    renderDialog({
      mode: 'edit',
      snippet: { id: 'mobile', content: 'Mobile snippet' },
      onClose,
      onSave,
    });

    expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperFullScreen');
    expect(screen.getByRole('heading', { name: 'Edit Snippet' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledWith('Mobile snippet'));

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
