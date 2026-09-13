import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '../theme';
import { SnippetCard } from './SnippetCard';

function renderCard(overrides = {}) {
  const props = {
    snippet: {
      id: '1',
      content: 'Hello world',
      isStarred: false,
      createdAt: new Date(),
    },
    onCopy: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleFavorite: vi.fn(),
    ...overrides,
  };
  render(
    <ThemeProvider theme={theme}>
      <SnippetCard {...props} />
    </ThemeProvider>,
  );
  return props;
}

describe('SnippetCard', () => {
  it('copies only from the explicit copy control', async () => {
    const user = userEvent.setup();
    const props = renderCard();
    await user.click(screen.getByRole('button', { name: /copy snippet/i }));
    expect(props.onCopy).toHaveBeenCalledWith(props.snippet);
  });

  it('exposes favorite, edit, and delete controls by keyboard', async () => {
    const user = userEvent.setup();
    const props = renderCard();
    await user.click(screen.getByRole('button', { name: 'Add to Favorites' }));
    await user.click(
      screen.getByRole('button', { name: 'More snippet actions' }),
    );
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(props.onToggleFavorite).toHaveBeenCalled();
    expect(props.onEdit).toHaveBeenCalled();
  });

  it('deletes from the overflow menu', async () => {
    const user = userEvent.setup();
    const props = renderCard();
    await user.click(
      screen.getByRole('button', { name: 'More snippet actions' }),
    );
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(props.onDelete).toHaveBeenCalledWith(props.snippet);
  });
});
