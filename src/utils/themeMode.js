export const THEME_STORAGE_KEY = 'smart-copy:theme-mode';
export const THEME_MODES = ['light', 'dark'];

export function normalizeThemeMode(value) {
  return value === 'dark' ? 'dark' : 'light';
}

export function readStoredThemeMode() {
  try {
    return normalizeThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'light';
  }
}

export function writeStoredThemeMode(mode) {
  const next = normalizeThemeMode(mode);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Private mode can block storage.
  }
  return next;
}

export function applyDocumentTheme(mode) {
  const next = normalizeThemeMode(mode);
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;
  const themeColor = next === 'dark' ? '#0c1220' : '#f6f8fc';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = themeColor;
  return next;
}
