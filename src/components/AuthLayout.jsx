import { Box, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';
import { BrandMark } from './BrandMark';
import { ThemeModeToggle } from './ThemeModeToggle';

export function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <Box
      id="main-content"
      component="main"
      sx={{ minHeight: '100vh', display: 'grid', alignItems: 'stretch' }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 1fr) minmax(420px, 0.82fr)',
          },
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' },
            alignContent: 'space-between',
            overflow: 'hidden',
            p: { md: 6, lg: 9 },
            color: 'white',
            bgcolor: '#101828',
            backgroundImage:
              'radial-gradient(circle at 18% 80%, rgba(0,166,166,.34), transparent 32%), radial-gradient(circle at 78% 12%, rgba(36,87,255,.5), transparent 34%)',
          }}
        >
          <Stack
            component={Link}
            to="/"
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              color: 'inherit',
              textDecoration: 'none',
              width: 'fit-content',
            }}
          >
            <BrandMark size={48} />
            <Typography sx={{ fontWeight: 780, fontSize: 23 }}>
              Smart Copy
            </Typography>
          </Stack>

          <Box sx={{ maxWidth: 660, py: 8 }}>
            <Typography
              variant="h2"
              sx={{ color: 'white', textWrap: 'balance' }}
            >
              Your useful words, always within reach.
            </Typography>
            <Typography
              sx={{ mt: 3, color: '#c9d6ee', fontSize: 18, maxWidth: 520 }}
            >
              Keep replies, addresses, links, and everyday notes in one calm
              place—then copy them in a tap.
            </Typography>
            <DemoSnippetStack />
          </Box>

          <Typography variant="caption" sx={{ color: '#91a0bb' }}>
            Fast to find. Clear to use. Yours to keep.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            display: 'grid',
            alignItems: 'center',
            px: { xs: 3, sm: 7, lg: 10 },
            py: 5,
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <ThemeModeToggle />
          </Box>
          <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
            <Stack
              component={Link}
              to="/"
              direction="row"
              spacing={1.25}
              sx={{
                alignItems: 'center',
                display: { md: 'none' },
                mb: 7,
                pr: 6,
                color: 'text.primary',
                textDecoration: 'none',
              }}
            >
              <BrandMark size={42} />
              <Typography sx={{ fontWeight: 780, fontSize: 21 }}>
                Smart Copy
              </Typography>
            </Stack>
            <Typography
              component="p"
              sx={{
                color: 'primary.main',
                fontWeight: 760,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                fontSize: 12,
              }}
            >
              {eyebrow}
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mt: 1, textWrap: 'balance' }}
            >
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
              {description}
            </Typography>
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function DemoSnippetStack() {
  const lines = [
    ['Delivery note', 'Please leave the package with reception.'],
    ['Meeting link', 'meet.example.com/weekly-sync'],
    ['Warm sign-off', 'Thanks again—speak soon!'],
  ];

  return (
    <Stack
      spacing={1.5}
      sx={{ mt: 6, maxWidth: 540, transform: 'rotate(-1.5deg)' }}
    >
      {lines.map(([label, content], index) => (
        <Box
          key={label}
          sx={{
            border: '1px solid rgba(255,255,255,.18)',
            borderLeft: '5px solid',
            borderLeftColor: index === 1 ? 'secondary.main' : 'primary.main',
            borderRadius: 2.5,
            bgcolor: 'rgba(255,255,255,.1)',
            backdropFilter: 'blur(8px)',
            p: 2,
            ml: `${index * 18}px !important`,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: '#9fb3d8',
              fontFamily: 'Roboto Mono Variable, monospace',
            }}
          >
            {label}
          </Typography>
          <Typography sx={{ mt: 0.5, color: 'white' }}>{content}</Typography>
        </Box>
      ))}
    </Stack>
  );
}
