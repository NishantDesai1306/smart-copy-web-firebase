import { useEffect } from 'react';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRegisterSW } from 'virtual:pwa-register/react';

const LEGACY_CACHE_NAMES = ['cdn-files-v2', 'pages-cache-v1'];

export function PwaUpdatePrompt() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!('caches' in window)) return;
    Promise.all(
      LEGACY_CACHE_NAMES.map((name) => window.caches.delete(name)),
    ).catch(() => {});
  }, []);

  useEffect(() => {
    if (!needRefresh) return;

    const snackbarKey = enqueueSnackbar(
      'A fresh version of Smart Copy is ready.',
      {
        persist: true,
        variant: 'info',
        action: () => (
          <>
            <Button color="inherit" onClick={() => updateServiceWorker(true)}>
              Update Now
            </Button>
            <Button color="inherit" onClick={() => closeSnackbar(snackbarKey)}>
              Later
            </Button>
          </>
        ),
      },
    );

    return () => closeSnackbar(snackbarKey);
  }, [closeSnackbar, enqueueSnackbar, needRefresh, updateServiceWorker]);

  return null;
}
