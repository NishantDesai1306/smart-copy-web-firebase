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
});
