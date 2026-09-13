import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('maps sensitive auth failures to a shared message', () => {
    expect(getErrorMessage({ code: 'auth/user-not-found' })).toBe(
      'The email or password is incorrect. Try again.',
    );
    expect(getErrorMessage({ code: 'auth/wrong-password' })).toBe(
      'The email or password is incorrect. Try again.',
    );
  });

  it('uses a supplied fallback', () => {
    expect(getErrorMessage(null, 'Could not save.')).toBe('Could not save.');
  });

  it('explains blocked social popups', () => {
    expect(getErrorMessage({ code: 'auth/popup-blocked' })).toMatch(
      /Allow popups/,
    );
  });
});
