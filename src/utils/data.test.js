import { describe, expect, it } from 'vitest';
import {
  filterSnippets,
  normalizeProfile,
  normalizeSnippet,
  sortSnippets,
  toDate,
} from './data';

describe('legacy data compatibility', () => {
  it('normalizes snippets without stars and converts Firebase-like timestamps', () => {
    const date = new Date('2024-03-01T10:00:00Z');
    expect(
      normalizeSnippet('one', {
        owner: 'u1',
        content: 'Hello',
        createdAt: { toDate: () => date },
      }),
    ).toEqual({
      id: 'one',
      owner: 'u1',
      content: 'Hello',
      isStarred: false,
      createdAt: date,
      updatedAt: null,
    });
  });

  it('reads legacy profilePicture without overwriting canonical avatarUrl', () => {
    expect(
      normalizeProfile(
        { username: 'Ada', profilePicture: 'legacy.png' },
        { email: 'ada@example.com' },
      ),
    ).toMatchObject({
      email: 'ada@example.com',
      username: 'Ada',
      avatarUrl: 'legacy.png',
    });
    expect(
      normalizeProfile({ avatarUrl: 'new.png', profilePicture: 'old.png' })
        .avatarUrl,
    ).toBe('new.png');
  });

  it('reads a saved theme mode and defaults missing values to light', () => {
    expect(normalizeProfile({ themeMode: 'dark' }).themeMode).toBe('dark');
    expect(normalizeProfile({}).themeMode).toBe('light');
  });

  it('handles valid and invalid timestamps', () => {
    expect(toDate('2025-01-01').getUTCFullYear()).toBe(2025);
    expect(toDate('not-a-date')).toBeNull();
  });
});

describe('snippet discovery', () => {
  const snippets = [
    {
      id: 'old',
      content: 'Office address',
      isStarred: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'new',
      content: 'Weekly reply',
      isStarred: false,
      updatedAt: new Date('2025-01-01'),
    },
  ];

  it('sorts by the newest available timestamp without mutation', () => {
    expect(sortSnippets(snippets).map(({ id }) => id)).toEqual(['new', 'old']);
    expect(snippets[0].id).toBe('old');
  });

  it('searches case-insensitively and filters favorites', () => {
    expect(filterSnippets(snippets, 'OFFICE', 'all')).toHaveLength(1);
    expect(
      filterSnippets(snippets, '', 'favorites').map(({ id }) => id),
    ).toEqual(['old']);
  });
});
