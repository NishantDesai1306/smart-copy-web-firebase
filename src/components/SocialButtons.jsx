import { Button, Divider, Stack, Typography } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import GoogleIcon from '@mui/icons-material/Google';

export function SocialButtons({ disabled, onGoogle, onFacebook }) {
  return (
    <>
      <Stack direction="row" spacing={2} sx={{ my: 3, alignItems: 'center' }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary">
          OR
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Stack>
      <Stack spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          disabled={disabled}
          onClick={onGoogle}
        >
          Continue with Google
        </Button>
        <Button
          variant="outlined"
          startIcon={<FacebookRoundedIcon />}
          disabled={disabled}
          onClick={onFacebook}
        >
          Continue with Facebook
        </Button>
      </Stack>
    </>
  );
}
