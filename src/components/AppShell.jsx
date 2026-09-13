import { useState } from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Link, useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase/auth';
import { getErrorMessage } from '../utils/errors';
import { getInitials } from '../utils/data';
import { BrandMark } from './BrandMark';
import { ThemeModeToggle } from './ThemeModeToggle';

export function AppShell({ children, actions }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { profile, error: authError } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function handleLogout() {
    setMenuAnchor(null);
    try {
      await logOut();
      navigate('/login', { replace: true });
    } catch (error) {
      enqueueSnackbar(
        getErrorMessage(error, 'Could not sign out. Try again.'),
        {
          variant: 'error',
        },
      );
    }
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        elevation={0}
        position="sticky"
        color="transparent"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'custom.bar',
          backdropFilter: 'blur(18px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: 68, md: 76 }, gap: 2 }}
          >
            <Stack
              component={Link}
              to="/dashboard"
              direction="row"
              spacing={1.25}
              sx={{
                alignItems: 'center',
                color: 'text.primary',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <BrandMark size={40} />
              <Typography
                component="span"
                sx={{
                  fontSize: 20,
                  fontWeight: 780,
                  letterSpacing: '-0.035em',
                }}
              >
                Smart Copy
              </Typography>
            </Stack>

            <Box sx={{ flex: 1, minWidth: 0 }}>{actions}</Box>

            <ThemeModeToggle />
            <Tooltip title="Account">
              <IconButton
                aria-label="Open account menu"
                onClick={(event) => setMenuAnchor(event.currentTarget)}
              >
                <Avatar
                  src={profile?.avatarUrl || undefined}
                  alt={profile?.username || 'Account'}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: 14,
                  }}
                >
                  {getInitials(profile?.username)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              slotProps={{ paper: { sx: { minWidth: 210, mt: 1 } } }}
            >
              <MenuItem
                component={Link}
                to="/dashboard/profile"
                onClick={() => setMenuAnchor(null)}
              >
                <ListItemIcon>
                  <PersonOutlineRoundedIcon fontSize="small" />
                </ListItemIcon>
                Profile & Security
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutRoundedIcon fontSize="small" />
                </ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {authError ? <Alert severity="warning">{authError}</Alert> : null}
      </Container>

      <Box id="main-content" component="main">
        {children}
      </Box>
    </Box>
  );
}
