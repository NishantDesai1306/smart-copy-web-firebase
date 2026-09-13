const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;

  if (typeof value.toDate === 'function') {
    const converted = value.toDate();
    return converted instanceof Date && !Number.isNaN(converted.getTime())
      ? converted
      : null;
  }

  const converted = new Date(value);
  return Number.isNaN(converted.getTime()) ? null : converted;
}

export function normalizeSnippet(id, data = {}) {
  return {
    id,
    owner: data.owner ?? '',
    content: typeof data.content === 'string' ? data.content : '',
    isStarred: data.isStarred === true,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export function normalizeProfile(data = {}, user = {}) {
  return {
    email: data.email || user.email || '',
    username:
      data.username ||
      user.displayName ||
      user.email?.split('@')[0] ||
      'Smart Copy user',
    avatarUrl: data.avatarUrl || data.profilePicture || user.photoURL || '',
    themeMode: data.themeMode === 'dark' ? 'dark' : 'light',
  };
}

export function sortSnippets(snippets) {
  return snippets.toSorted((left, right) => {
    const leftTime = (left.updatedAt || left.createdAt)?.getTime() ?? 0;
    const rightTime = (right.updatedAt || right.createdAt)?.getTime() ?? 0;
    return rightTime - leftTime;
  });
}

export function filterSnippets(snippets, searchText, view) {
  const query = searchText.trim().toLocaleLowerCase();

  return snippets.filter((snippet) => {
    const matchesView = view !== 'favorites' || snippet.isStarred;
    const matchesQuery =
      query.length === 0 || snippet.content.toLocaleLowerCase().includes(query);
    return matchesView && matchesQuery;
  });
}

export function formatSnippetDate(snippet) {
  const date = snippet.updatedAt || snippet.createdAt;
  return date ? dateFormatter.format(date) : 'Saving…';
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'SC';
  return parts
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase())
    .join('');
}
