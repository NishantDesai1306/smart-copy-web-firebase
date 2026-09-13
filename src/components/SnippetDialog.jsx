import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { FormTextField } from './FormTextField';
import { snippetSchema } from '../utils/validation';

export function SnippetDialog({ mode, snippet, onClose, onSave }) {
  const isEditing = mode === 'edit';

  return (
    <Dialog open={Boolean(mode)} onClose={onClose} fullWidth maxWidth="sm">
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
          <Form>
            <DialogTitle>
              {isEditing ? 'Edit Snippet' : 'New Snippet'}
            </DialogTitle>
            <DialogContent
              sx={{ pt: '8px !important', overscrollBehavior: 'contain' }}
            >
              <FormTextField
                name="content"
                label="Snippet Text"
                placeholder="Paste or type reusable text…"
                multiline
                minRows={7}
                autoComplete="off"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving…'
                  : isEditing
                    ? 'Save Changes'
                    : 'Create Snippet'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
