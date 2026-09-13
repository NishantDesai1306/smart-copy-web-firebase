import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';

export function OfflineNotice() {
  const [offline, setOffline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine === false,
  );

  useEffect(() => {
    function goOffline() {
      setOffline(true);
    }
    function goOnline() {
      setOffline(false);
    }

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <Alert
      severity="warning"
      sx={{
        position: 'fixed',
        zIndex: 1400,
        left: '50%',
        bottom: 16,
        width: 'min(92vw, 480px)',
        transform: 'translateX(-50%)',
        boxShadow: '0 12px 32px rgba(16, 24, 40, 0.16)',
      }}
    >
      You’re offline. Saved snippets will refresh when the connection returns.
    </Alert>
  );
}
