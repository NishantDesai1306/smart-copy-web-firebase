import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';
import { BrandMark } from '../components/BrandMark';

export default function NotFoundPage() {
  return (
    <Container
      id="main-content"
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        py: 5,
      }}
    >
      <Box>
        <BrandMark size={64} />
        <Typography component="h1" variant="h2" sx={{ mt: 3 }}>
          Page Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ my: 2 }}>
          The page may have moved, or the address may be incorrect.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Return Home
        </Button>
      </Box>
    </Container>
  );
}
