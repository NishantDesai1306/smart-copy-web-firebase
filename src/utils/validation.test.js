import { describe, expect, it } from 'vitest';
import {
  getChangePasswordSchema,
  signupSchema,
  snippetSchema,
} from './validation';

describe('form validation', () => {
  it('rejects blank snippets', async () => {
    await expect(snippetSchema.validate({ content: '   ' })).rejects.toThrow(
      'Enter the text',
    );
  });

  it('requires matching signup passwords', async () => {
    await expect(
      signupSchema.validate({
        username: 'Ada',
        email: 'ada@example.com',
        password: 'secret1',
        confirmPassword: 'secret2',
      }),
    ).rejects.toThrow('Passwords must match');
  });

  it('only requires a current password for password accounts', async () => {
    const socialValues = {
      currentPassword: '',
      newPassword: 'secret1',
      confirmNewPassword: 'secret1',
    };
    await expect(
      getChangePasswordSchema(false).validate(socialValues),
    ).resolves.toBeTruthy();
    await expect(
      getChangePasswordSchema(true).validate(socialValues),
    ).rejects.toThrow('current password');
  });
});
