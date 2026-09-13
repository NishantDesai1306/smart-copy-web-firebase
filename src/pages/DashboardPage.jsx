import { useDeferredValue, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import { useSearchParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { AppShell } from '../components/AppShell';
import { SnippetCard } from '../components/SnippetCard';
import { SnippetDialog } from '../components/SnippetDialog';
import { useAuth } from '../contexts/AuthContext';
import {
  addSnippet,
  removeSnippet,
  setSnippetStarred,
  updateSnippet,
} from '../firebase/snippets';
import { useSnippets } from '../hooks/useSnippets';
import { copyText } from '../utils/clipboard';
import { filterSnippets } from '../utils/data';
import { getErrorMessage } from '../utils/errors';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { snippets, loading, error } = useSnippets(user?.uid);
  const [params, setParams] = useSearchParams();
  const [dialog, setDialog] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const query = params.get('q') || '';
  const view = params.get('view') === 'favorites' ? 'favorites' : 'all';
  const deferredQuery = useDeferredValue(query);
  const visibleSnippets = useMemo(
    () => filterSnippets(snippets, deferredQuery, view),
    [deferredQuery, snippets, view],
  );

  function updateParam(name, value, defaultValue = '') {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(name);
    else next.set(name, value);
    setParams(next, { replace: true });
  }

  async function perform(operation, successMessage, fallback) {
    try {
      await operation();
      enqueueSnackbar(successMessage, { variant: 'success' });
      return true;
    } catch (operationError) {
      enqueueSnackbar(getErrorMessage(operationError, fallback), {
        variant: 'error',
      });
      return false;
    }
  }

  async function handleSave(content) {
    const editing = dialog?.mode === 'edit';
    const saved = await perform(
      () =>
        editing
          ? updateSnippet(dialog.snippet.id, content)
          : addSnippet(user.uid, content),
      editing ? 'Snippet updated.' : 'Snippet created.',
      'The snippet could not be saved.',
    );
    if (saved) setDialog(null);
  }

  async function handleCopy(snippet) {
    try {
      await copyText(snippet.content);
      enqueueSnackbar('Copied to clipboard.', { variant: 'success' });
    } catch {
      enqueueSnackbar('Copy failed. Select the text and copy it manually.', {
        variant: 'error',
      });
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const deleted = await perform(
      () => removeSnippet(pendingDelete.id),
      'Snippet deleted.',
      'The snippet could not be deleted.',
    );
    setDeleting(false);
    if (deleted) setPendingDelete(null);
  }

  const search = (
    <TextField
      value={query}
      onChange={(event) => updateParam('q', event.target.value)}
      placeholder="Search snippets"
      aria-label="Search snippets"
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: { xs: '100%', md: 420 },
        maxWidth: '100%',
        ml: { md: 'auto' },
      }}
    />
  );

  return (
    <AppShell
      actions={
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>{search}</Box>
      }
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Box sx={{ display: { md: 'none' }, mb: 3 }}>{search}</Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={2.5}
          sx={{
            alignItems: { sm: 'flex-end' },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              color="secondary.dark"
              sx={{
                fontSize: 12,
                fontWeight: 780,
                letterSpacing: '.09em',
                textTransform: 'uppercase',
              }}
            >
              {profile?.username
                ? `${profile.username}’s Copy Shelf`
                : 'Your Copy Shelf'}
            </Typography>
            <Typography component="h1" variant="h2" sx={{ mt: 1 }}>
              Snippets
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Find it, copy it, keep moving.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setDialog({ mode: 'create' })}
          >
            New Snippet
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={2}
          sx={{
            mt: 4,
            mb: 3,
            justifyContent: 'space-between',
            alignItems: { sm: 'center' },
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={view}
            size="small"
            onChange={(_, next) => next && updateParam('view', next, 'all')}
            aria-label="Snippet view"
          >
            <ToggleButton value="all" aria-label="Show all snippets">
              <ViewAgendaOutlinedIcon sx={{ mr: 1 }} />
              All
            </ToggleButton>
            <ToggleButton value="favorites" aria-label="Show favorite snippets">
              <StarRoundedIcon sx={{ mr: 1 }} />
              Favorites
            </ToggleButton>
          </ToggleButtonGroup>
          {!loading && !error ? (
            <Typography color="text.secondary" aria-live="polite">
              {visibleSnippets.length}{' '}
              {visibleSnippets.length === 1 ? 'snippet' : 'snippets'}
            </Typography>
          ) : null}
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}
        {loading ? (
          <Box
            aria-label="Loading snippets"
            sx={{
              display: 'grid',
              alignItems: 'start',
              gridTemplateColumns: '1fr',
              gap: 2.5,
            }}
          >
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rounded" height={190} />
            ))}
          </Box>
        ) : visibleSnippets.length ? (
          <Box
            sx={{
              display: 'grid',
              alignItems: 'start',
              gridTemplateColumns: '1fr',
              gap: 2.5,
            }}
          >
            {visibleSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onCopy={handleCopy}
                onEdit={(item) => setDialog({ mode: 'edit', snippet: item })}
                onDelete={setPendingDelete}
                onToggleFavorite={(item) =>
                  perform(
                    () => setSnippetStarred(item.id, !item.isStarred),
                    item.isStarred
                      ? 'Removed from Favorites.'
                      : 'Added to Favorites.',
                    'The favorite could not be updated.',
                  )
                }
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              py: 10,
              px: 3,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 4,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h3" component="h2">
              {query
                ? 'No Matching Snippets'
                : view === 'favorites'
                  ? 'No Favorites Yet'
                  : 'Your Shelf Is Ready'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3 }}>
              {query
                ? 'Try a different search term.'
                : view === 'favorites'
                  ? 'Star a snippet to keep it close.'
                  : 'Save your first reusable piece of text.'}
            </Typography>
            {!query && view === 'all' ? (
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setDialog({ mode: 'create' })}
              >
                New Snippet
              </Button>
            ) : null}
          </Box>
        )}
      </Container>

      <SnippetDialog
        mode={dialog?.mode}
        snippet={dialog?.snippet}
        onClose={() => setDialog(null)}
        onSave={handleSave}
      />
      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete This Snippet?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete Snippet'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
