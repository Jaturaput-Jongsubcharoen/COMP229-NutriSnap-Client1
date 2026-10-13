import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getEntries } from '../services/nutritionService';
export default function useEntries() {
  const { token } = useAuth();
  const [state, setState] = useState({
    entries: [],
    loading: Boolean(token),
    error: '',
  });
  const [revision, setRevision] = useState(0);
  const request = useRef(null);
  useEffect(() => {
    if (!token) {
      setState({ entries: [], loading: false, error: '' });
      request.current = null;
      return;
    }
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: '' }));
    if (
      request.current?.token !== token ||
      request.current?.revision !== revision
    ) {
      request.current = { token, revision, promise: getEntries() };
    }
    request.current.promise
      .then((entries) => {
        if (active) setState({ entries, loading: false, error: '' });
      })
      .catch((error) => {
        if (active)
          setState({ entries: [], loading: false, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [token, revision]);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  return { ...state, reload };
}
