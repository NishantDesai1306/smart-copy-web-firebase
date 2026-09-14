import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Form, Formik } from 'formik';
import { useSearchParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { AppShell } from '../components/AppShell';
import { FormTextField } from '../components/FormTextField';
import { useAuth } from '../contexts/AuthContext';
import { changePassword, linkSocialProvider } from '../firebase/auth';
import { uploadUserAvatar } from '../firebase/avatar';
import { updateUserProfile } from '../firebase/profile';
import { getInitials } from '../utils/data';
import { getErrorMessage } from '../utils/errors';
import { getChangePasswordSchema, profileSchema } from '../utils/validation';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [params, setParams] = useSearchParams();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [linking, setLinking] = useState('');
  const fileInput = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const tab = params.get('tab') === 'security' ? 'security' : 'account';
  const hasPassword = user.providerData.some(
    ({ providerId }) => providerId === 'password',
  );
  const providerLabel = user.providerData.some(
    ({ providerId }) => providerId === 'google.com',
  )
    ? 'Google'
    : 'Facebook';
  const passwordSchema = useMemo(
    () => getChangePasswordSchema(hasPassword),
    [hasPassword],
  );
  const providerIds = user.providerData.map(({ providerId }) => providerId);

  async function handleLink(provider) {
    setLinking(provider);
    try {
      await linkSocialProvider(provider);
      enqueueSnackbar(
        `${provider === 'google' ? 'Google' : 'Facebook'} account linked.`,
        { variant: 'success' },
      );
    } catch (error) {
      enqueueSnackbar(
        getErrorMessage(error, 'The provider could not be linked.'),
        { variant: 'error' },
      );
    } finally {
      setLinking('');
    }
  }

  async function handleAvatar(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      setUploadError('Choose an image smaller than 5 MB.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      await uploadUserAvatar(user.uid, file);
      enqueueSnackbar('Profile photo updated.', { variant: 'success' });
    } catch (error) {
      setUploadError(
        getErrorMessage(error, 'The profile photo could not be uploaded.'),
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
        <Typography component="h1" variant="h2">
          Profile & Security
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Keep your account details current and secure.
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, value) =>
            setParams(value === 'account' ? {} : { tab: value })
          }
          sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="account" label="Account" />
          <Tab value="security" label="Security" />
        </Tabs>
        <Box
          sx={{
            mt: 4,
            p: { xs: 2.5, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          {tab === 'account' ? (
            <>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2.5}
                sx={{ mb: 4, alignItems: { xs: 'flex-start', sm: 'center' } }}
              >
                <Avatar
                  src={profile?.avatarUrl || undefined}
                  alt={profile?.username || 'Profile'}
                  sx={{
                    width: 88,
                    height: 88,
                    bgcolor: 'primary.main',
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(profile?.username)}
                </Avatar>
                <Stack
                  spacing={1.5}
                  sx={{ minWidth: 0, alignItems: 'flex-start' }}
                >
                  <input
                    ref={fileInput}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CameraAltOutlinedIcon />}
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading…' : 'Change Photo'}
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    PNG, JPG, GIF, or WebP. Maximum 5 MB.
                  </Typography>
                </Stack>
              </Stack>
              {uploadError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {uploadError}
                </Alert>
              ) : null}
              <Formik
                initialValues={{ username: profile?.username || '' }}
                enableReinitialize
                validationSchema={profileSchema}
                onSubmit={async (values, actions) => {
                  try {
                    await updateUserProfile(user.uid, values);
                    enqueueSnackbar('Profile updated.', { variant: 'success' });
                  } catch (error) {
                    actions.setStatus(
                      getErrorMessage(
                        error,
                        'Your profile could not be updated.',
                      ),
                    );
                  } finally {
                    actions.setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, status }) => (
                  <Form noValidate>
                    <Stack spacing={2.5}>
                      {status ? <Alert severity="error">{status}</Alert> : null}
                      <FormTextField
                        name="username"
                        label="Name"
                        autoComplete="name"
                      />
                      <TextField
                        label="Email"
                        value={profile?.email || user.email || ''}
                        disabled
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        {isSubmitting ? 'Saving…' : 'Save Changes'}
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <>
              <Typography variant="h3" component="h2">
                {hasPassword ? 'Change Password' : 'Add a Password'}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                {hasPassword
                  ? 'Confirm your current password before choosing a new one.'
                  : `Reauthenticate with ${providerLabel}, then add an email password to this account.`}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ mb: 4 }}
              >
                <Button
                  variant="outlined"
                  disabled={
                    providerIds.includes('google.com') || Boolean(linking)
                  }
                  onClick={() => handleLink('google')}
                >
                  {providerIds.includes('google.com')
                    ? 'Google Connected'
                    : linking === 'google'
                      ? 'Connecting…'
                      : 'Connect Google'}
                </Button>
                <Button
                  variant="outlined"
                  disabled={
                    providerIds.includes('facebook.com') || Boolean(linking)
                  }
                  onClick={() => handleLink('facebook')}
                >
                  {providerIds.includes('facebook.com')
                    ? 'Facebook Connected'
                    : linking === 'facebook'
                      ? 'Connecting…'
                      : 'Connect Facebook'}
                </Button>
              </Stack>
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmNewPassword: '',
                }}
                validationSchema={passwordSchema}
                onSubmit={async (values, actions) => {
                  try {
                    await changePassword(values);
                    actions.resetForm();
                    enqueueSnackbar(
                      hasPassword
                        ? 'Password changed.'
                        : 'Password sign-in added.',
                      { variant: 'success' },
                    );
                  } catch (error) {
                    actions.setStatus(
                      getErrorMessage(
                        error,
                        'Your password could not be changed.',
                      ),
                    );
                  } finally {
                    actions.setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, status }) => (
                  <Form noValidate>
                    <Stack spacing={2.5}>
                      {status ? <Alert severity="error">{status}</Alert> : null}
                      {hasPassword ? (
                        <FormTextField
                          name="currentPassword"
                          label="Current Password"
                          type="password"
                          autoComplete="current-password"
                        />
                      ) : null}
                      <FormTextField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        autoComplete="new-password"
                      />
                      <FormTextField
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        autoComplete="new-password"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        {isSubmitting
                          ? 'Updating…'
                          : hasPassword
                            ? 'Change Password'
                            : 'Add Password'}
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </Box>
      </Container>
    </AppShell>
  );
}
