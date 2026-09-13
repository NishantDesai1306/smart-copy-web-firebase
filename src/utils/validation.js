import * as Yup from 'yup';

const password = Yup.string()
  .min(6, 'Use at least 6 characters.')
  .required('Enter your password.');

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Enter your email.'),
  password,
});

export const signupSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(2, 'Use at least 2 characters.')
    .required('Enter your name.'),
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Enter your email.'),
  password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match.')
    .required('Confirm your password.'),
});

export const resetPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Enter your email.'),
});

export const snippetSchema = Yup.object({
  content: Yup.string().trim().required('Enter the text you want to save.'),
});

export const profileSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(2, 'Use at least 2 characters.')
    .required('Enter your name.'),
});

export function getChangePasswordSchema(requiresCurrentPassword) {
  return Yup.object({
    currentPassword: requiresCurrentPassword
      ? Yup.string().required('Enter your current password.')
      : Yup.string(),
    newPassword: password.label('New password'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match.')
      .required('Confirm your new password.'),
  });
}
