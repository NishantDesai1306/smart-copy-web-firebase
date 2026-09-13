import { useState } from 'react';
import { Alert, Button, Link as MuiLink, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '../components/AuthLayout';
import { FormTextField } from '../components/FormTextField';
import { SocialButtons } from '../components/SocialButtons';
import { createAccount, signInWithSocialProvider } from '../firebase/auth';
import { getErrorMessage } from '../utils/errors';
import { signupSchema } from '../utils/validation';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [socialBusy, setSocialBusy] = useState('');
  const navigate = useNavigate();

  async function handleSocial(provider) {
    setError('');
    setSocialBusy(provider);
    try {
      const result = await signInWithSocialProvider(provider);
      if (result) navigate('/dashboard', { replace: true });
    } catch (socialError) {
      setError(
        getErrorMessage(
          socialError,
          'Sign-up could not be completed. Try again.',
        ),
      );
    } finally {
      setSocialBusy('');
    }
  }

  return (
    <AuthLayout
      eyebrow="Get Started"
      title="Build Your Copy Shelf"
      description="Create an account and save your first reusable snippet."
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      ) : null}
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={signupSchema}
        onSubmit={async (values, actions) => {
          setError('');
          try {
            await createAccount(values);
            navigate('/dashboard', { replace: true });
          } catch (submitError) {
            setError(getErrorMessage(submitError));
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <Stack spacing={2}>
              <FormTextField name="username" label="Name" autoComplete="name" />
              <FormTextField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                spellCheck={false}
              />
              <FormTextField
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
              />
              <FormTextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || Boolean(socialBusy)}
              >
                {isSubmitting ? 'Creating Account…' : 'Create Account'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      <SocialButtons
        disabled={Boolean(socialBusy)}
        onGoogle={() => handleSocial('google')}
        onFacebook={() => handleSocial('facebook')}
      />
      <MuiLink
        component={Link}
        to="/login"
        sx={{ display: 'block', mt: 3, textAlign: 'center', fontWeight: 680 }}
      >
        Already Have an Account? Sign In
      </MuiLink>
    </AuthLayout>
  );
}
