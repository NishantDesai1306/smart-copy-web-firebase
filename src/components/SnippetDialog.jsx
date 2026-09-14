import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Form, Formik } from 'formik';
import { FormTextField } from './FormTextField';
import { snippetSchema } from '../utils/validation';

export function SnippetDialog({ mode, snippet, onClose, onSave }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEditing = mode === 'edit';
  const title = isEditing ? 'Edit Snippet' : 'New Snippet';

  return (
    <Dialog
      open={Boolean(mode)}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="sm"
      scroll="paper"
      slots={isMobile ? { transition: Slide } : undefined}
      slotProps={{
        paper: {
          sx: {
            m: { xs: 0, sm: 4 },
            width: { xs: '100%', sm: 'calc(100% - 64px)' },
            height: { xs: '100dvh', sm: 'auto' },
            maxHeight: {
              xs: '100dvh',
              sm: 'calc(100dvh - 64px)',
            },
            borderRadius: { xs: 0, sm: '22px' },
            overflow: 'hidden',
          },
        },
        ...(isMobile ? { transition: { direction: 'up' } } : {}),
      }}
      aria-labelledby="snippet-dialog-title"
    >
      <Formik
        key={`${mode ?? 'closed'}-${snippet?.id ?? 'new'}`}
        enableReinitialize
        initialValues={{ content: snippet?.content || '' }}
        validationSchema={snippetSchema}
        onSubmit={async (values, actions) => {
          try {
            await onSave(values.content);
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Box
            component={Form}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              height: { xs: '100%', sm: 'auto' },
              maxHeight: 'inherit',
              overflow: 'hidden',
            }}
          >
            {isMobile ? (
              <AppBar
                position="static"
                color="inherit"
                elevation={0}
                sx={{
                  flex: '0 0 auto',
                  borderBottom: 1,
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  backgroundImage: 'none',
                }}
              >
                <Toolbar
                  disableGutters
                  sx={{
                    minHeight: '64px',
                    px: 1,
                    pt: 'env(safe-area-inset-top)',
                  }}
                >
                  <Button
                    color="inherit"
                    onClick={onClose}
                    disabled={isSubmitting}
                    sx={{ minWidth: 72, px: 1 }}
                  >
                    Cancel
                  </Button>
                  <Typography
                    id="snippet-dialog-title"
                    component="h2"
                    variant="subtitle1"
                    noWrap
                    sx={{
                      flex: 1,
                      px: 1,
                      textAlign: 'center',
                      fontWeight: 760,
                    }}
                  >
                    {title}
                  </Typography>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ minWidth: 72, px: 1 }}
                  >
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </Button>
                </Toolbar>
              </AppBar>
            ) : (
              <DialogTitle id="snippet-dialog-title" sx={{ flex: '0 0 auto' }}>
                {title}
              </DialogTitle>
            )}
            <DialogContent
              dividers={!isMobile}
              sx={{
                flex: '1 1 auto',
                minHeight: 0,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                p: { xs: 2, sm: undefined },
                pt: { xs: 2, sm: '16px !important' },
              }}
            >
              <FormTextField
                name="content"
                label="Snippet Text"
                placeholder="Paste or type reusable text…"
                multiline
                minRows={7}
                maxRows={14}
                autoComplete="off"
                sx={{
                  height: { xs: '100%', sm: 'auto' },
                  '& .MuiInputBase-root': {
                    alignItems: 'flex-start',
                    height: { xs: '100%', sm: 'auto' },
                  },
                  '& textarea': {
                    height: { xs: '100% !important', sm: 'auto' },
                    maxHeight: '100%',
                    overflow: 'auto !important',
                  },
                }}
              />
            </DialogContent>
            {!isMobile && (
              <DialogActions sx={{ flex: '0 0 auto' }}>
                <Button onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving…'
                    : isEditing
                      ? 'Save Changes'
                      : 'Create Snippet'}
                </Button>
              </DialogActions>
            )}
          </Box>
        )}
      </Formik>
    </Dialog>
  );
}
