import { useState } from 'react';
import { Alert, Button, Link as MuiLink, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { Link } from 'react-router';
import { AuthLayout } from '../components/AuthLayout';
import { FormTextField } from '../components/FormTextField';
import { requestPasswordReset } from '../firebase/auth';
import { getErrorMessage } from '../utils/errors';
import { resetPasswordSchema } from '../utils/validation';

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState({ type: '', message: '' });

  return (
    <AuthLayout
      eyebrow="Password Help"
      title="Reset Your Password"
      description="Enter your email and we will send reset instructions if an account matches."
    >
      {status.message ? (
        <Alert severity={status.type} sx={{ mb: 2.5 }}>
          {status.message}
        </Alert>
      ) : null}
      <Formik
        initialValues={{ email: '' }}
        validationSchema={resetPasswordSchema}
        onSubmit={async (values, actions) => {
          setStatus({ type: '', message: '' });
          try {
            await requestPasswordReset(values.email);
            setStatus({
              type: 'success',
              message:
                'If an account matches that email, reset instructions are on the way.',
            });
            actions.resetForm();
          } catch (submitError) {
            const genericMessage =
              'If an account matches that email, reset instructions are on the way.';
            const message =
              submitError?.code === 'auth/user-not-found'
                ? genericMessage
                : getErrorMessage(submitError);
            setStatus({
              type:
                submitError?.code === 'auth/user-not-found'
                  ? 'success'
                  : 'error',
              message,
            });
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <Stack spacing={2.25}>
              <FormTextField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                spellCheck={false}
              />
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Sending Instructions…'
                  : 'Send Reset Instructions'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      <MuiLink
        component={Link}
        to="/login"
        sx={{ display: 'block', mt: 3, textAlign: 'center', fontWeight: 680 }}
      >
        Return to Sign In
      </MuiLink>
    </AuthLayout>
  );
}
