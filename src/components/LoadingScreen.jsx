import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { BrandMark } from './BrandMark';

export function LoadingScreen({ label = 'Loading Smart Copy…' }) {
  return (
    <Box
      id="main-content"
      component="main"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 3 }}
    >
      <Stack
        sx={{ alignItems: 'center' }}
        spacing={2}
        role="status"
        aria-live="polite"
      >
        <BrandMark size={54} />
        <CircularProgress size={28} thickness={5} />
        <Typography color="text.secondary">{label}</Typography>
      </Stack>
    </Box>
  );
}
