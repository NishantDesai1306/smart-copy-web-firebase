import { useEffect, useState } from 'react';
import { subscribeToSnippets } from '../firebase/snippets';
import { getErrorMessage } from '../utils/errors';

export function useSnippets(userId) {
  const [state, setState] = useState({
    userId: null,
    snippets: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    return subscribeToSnippets(
      userId,
      (snippets) => setState({ userId, snippets, loading: false, error: '' }),
      (error) =>
        setState({
          userId,
          snippets: [],
          loading: false,
          error: getErrorMessage(error, 'Your snippets could not be loaded.'),
        }),
    );
  }, [userId]);

  if (!userId) return { snippets: [], loading: false, error: '' };
  if (state.userId !== userId)
    return { snippets: [], loading: true, error: '' };
  return state;
}
