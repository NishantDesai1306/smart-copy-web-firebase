import { IconButton, Tooltip } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useSnackbar } from 'notistack';
import { useThemeMode } from '../contexts/ThemeModeContext';
import { getErrorMessage } from '../utils/errors';

export function ThemeModeToggle() {
  const { mode, setThemeMode } = useThemeMode();
  const { enqueueSnackbar } = useSnackbar();
  const nextMode = mode === 'dark' ? 'light' : 'dark';
  const label =
    nextMode === 'dark' ? 'Switch to dark mode' : 'Switch to light mode';

  async function handleToggle() {
    try {
      await setThemeMode(nextMode);
    } catch (error) {
      enqueueSnackbar(
        getErrorMessage(error, 'Theme preference could not be saved.'),
        { variant: 'error' },
      );
    }
  }

  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={handleToggle} color="inherit">
        {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}
