import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getUser, login as requestLogin } from './services/authService';
export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(token));
  const userRequest = useRef(null);
  useEffect(() => {
    if (!token) {
      setUsername('');
      setLoading(false);
      setError('');
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    // Share the request across StrictMode's development effect replay.
    if (userRequest.current?.token !== token)
      userRequest.current = { token, promise: getUser() };
    userRequest.current.promise
      .then((data) => {
        if (active) setUsername(data.username || '');
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);
  const login = useCallback(async (credentials) => {
    const data = await requestLogin(credentials);
    if (!data.token)
      throw new Error('The login response did not include a session token.');
    localStorage.setItem('token', data.token);
    localStorage.setItem('userID', data.userID);
    userRequest.current = null;
    setToken(data.token);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    userRequest.current = null;
    setToken(null);
    setUsername('');
  }, []);
  return (
    <AuthContext.Provider
      value={{ token, username, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
