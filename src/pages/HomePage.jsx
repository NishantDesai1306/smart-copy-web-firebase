import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Link } from 'react-router';
import { BrandMark } from '../components/BrandMark';
import { ThemeModeToggle } from '../components/ThemeModeToggle';
import { useAuth } from '../contexts/AuthContext';

const features = [
  [
    SearchRoundedIcon,
    'Find It Fast',
    'Search every saved snippet as you type.',
  ],
  [
    ContentCopyRoundedIcon,
    'Copy with Intent',
    'One clear button copies exactly what you expect.',
  ],
  [
    StarRoundedIcon,
    'Keep Favorites Close',
    'Pin the snippets you reach for most.',
  ],
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 80 }}>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ flex: 1, alignItems: 'center' }}
            >
              <BrandMark size={42} />
              <Typography
                sx={{
                  fontWeight: 790,
                  fontSize: 21,
                  letterSpacing: '-0.035em',
                }}
              >
                Smart Copy
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <ThemeModeToggle />
              {user ? (
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  Open Snippets
                </Button>
              ) : (
                <>
                  <Button component={Link} to="/login" color="inherit">
                    Sign In
                  </Button>
                  <Button component={Link} to="/signup" variant="contained">
                    Get Started
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box id="main-content" component="main">
        <Container
          maxWidth="lg"
          sx={{ pt: { xs: 8, md: 13 }, pb: { xs: 10, md: 16 } }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'minmax(0, 1.02fr) minmax(400px, .98fr)',
              },
              alignItems: 'center',
              gap: { xs: 8, md: 10 },
            }}
          >
            <Box>
              <Typography
                component="p"
                sx={{
                  mb: 2,
                  color: 'secondary.dark',
                  fontWeight: 780,
                  letterSpacing: '.09em',
                  textTransform: 'uppercase',
                  fontSize: 12,
                }}
              >
                Your Personal Copy Shelf
              </Typography>
              <Typography
                variant="h1"
                component="h1"
                sx={{ maxWidth: 720, textWrap: 'balance' }}
              >
                Keep the words you reuse within reach.
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 610,
                  color: 'text.secondary',
                  fontSize: { xs: 18, md: 20 },
                  lineHeight: 1.65,
                }}
              >
                Smart Copy turns repeated replies, addresses, links, and notes
                into a quiet, searchable stack—ready the moment you need them.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ mt: 4.5 }}
              >
                <Button
                  component={Link}
                  to={user ? '/dashboard' : '/signup'}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  {user ? 'Open Your Snippets' : 'Create Your Copy Shelf'}
                </Button>
                {!user ? (
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                  >
                    Sign In
                  </Button>
                ) : null}
              </Stack>
            </Box>

            <HeroStack />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              mt: { xs: 10, md: 15 },
            }}
          >
            {features.map(([Icon, title, description]) => (
              <Box
                key={title}
                sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}
              >
                <Icon color="primary" aria-hidden="true" />
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ mt: 2, fontWeight: 760 }}
                >
                  {title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

function HeroStack() {
  const snippets = [
    ['Quick Reply', 'Thanks for sending this over—I’ll take a look today.'],
    ['Office Address', '18 King Street East, Toronto, ON'],
    ['Weekly Call', 'meet.example.com/team-weekly'],
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 390, sm: 470 },
        perspective: 900,
      }}
      aria-hidden="true"
    >
      <Box
        sx={{
          position: 'absolute',
          inset: '6% 2% 3% 8%',
          borderRadius: '42% 58% 63% 37% / 45% 35% 65% 55%',
          bgcolor: (theme) => theme.palette.custom.slip,
          transform: 'rotate(-7deg)',
        }}
      />
      {snippets.map(([label, content], index) => (
        <Box
          key={label}
          sx={{
            position: 'absolute',
            top: `${index * 27 + 6}%`,
            left: `${index * 5}%`,
            right: `${10 - index * 3}%`,
            zIndex: index + 1,
            p: { xs: 2.4, sm: 3 },
            border: '1px solid',
            borderColor: 'divider',
            borderLeft: '6px solid',
            borderLeftColor: index === 1 ? 'secondary.main' : 'primary.main',
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 22px 60px rgba(16,24,40,.12)',
            transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between' }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: 'Roboto Mono Variable, monospace',
                  color: 'text.secondary',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: { xs: 15, sm: 17 },
                  overflowWrap: 'anywhere',
                }}
              >
                {content}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: 2,
                color: 'primary.main',
                bgcolor: 'primary.light',
              }}
            >
              <ContentCopyRoundedIcon />
            </Box>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
