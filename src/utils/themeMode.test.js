import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyDocumentTheme,
  normalizeThemeMode,
  readStoredThemeMode,
  writeStoredThemeMode,
} from './themeMode';

describe('theme mode helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
    document.documentElement.style.colorScheme = '';
    document.head.innerHTML = '<meta name="theme-color" content="#2457ff" />';
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('keeps dark mode and treats anything else as light', () => {
    expect(normalizeThemeMode('dark')).toBe('dark');
    expect(normalizeThemeMode('light')).toBe('light');
    expect(normalizeThemeMode(undefined)).toBe('light');
    expect(normalizeThemeMode('system')).toBe('light');
  });

  it('reads and writes the stored preference', () => {
    expect(readStoredThemeMode()).toBe('light');
    writeStoredThemeMode('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(readStoredThemeMode()).toBe('dark');
  });

  it('applies dark document colors', () => {
    applyDocumentTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(document.querySelector('meta[name="theme-color"]').content).toBe(
      '#0c1220',
    );
  });
});
