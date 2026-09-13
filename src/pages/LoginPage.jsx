import { useState } from 'react';
import { Alert, Button, Link as MuiLink, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthLayout } from '../components/AuthLayout';
import { FormTextField } from '../components/FormTextField';
import { SocialButtons } from '../components/SocialButtons';
import { signInWithEmail, signInWithSocialProvider } from '../firebase/auth';
import { getErrorMessage } from '../utils/errors';
import { loginSchema } from '../utils/validation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [socialBusy, setSocialBusy] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const returnTo = from
    ? `${from.pathname}${from.search || ''}${from.hash || ''}`
    : '/dashboard';

  async function handleSocial(provider) {
    setError('');
    setSocialBusy(provider);
    try {
      const result = await signInWithSocialProvider(provider, returnTo);
      if (result) navigate(returnTo, { replace: true });
    } catch (socialError) {
      setError(
        getErrorMessage(
          socialError,
          'Sign-in could not be completed. Try again.',
        ),
      );
    } finally {
      setSocialBusy('');
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Open Your Copy Shelf"
      description="Sign in to find the snippets you have saved."
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      ) : null}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values, actions) => {
          setError('');
          try {
            await signInWithEmail(values.email, values.password);
            navigate(returnTo, { replace: true });
          } catch (submitError) {
            setError(getErrorMessage(submitError));
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
              <FormTextField
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
              <MuiLink
                component={Link}
                to="/forgot-password"
                sx={{ alignSelf: 'flex-end', fontWeight: 680 }}
              >
                Forgot Password?
              </MuiLink>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || Boolean(socialBusy)}
              >
                {isSubmitting ? 'Signing In…' : 'Sign In'}
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
        to="/signup"
        sx={{ display: 'block', mt: 3, textAlign: 'center', fontWeight: 680 }}
      >
        New to Smart Copy? Create an Account
      </MuiLink>
    </AuthLayout>
  );
}
