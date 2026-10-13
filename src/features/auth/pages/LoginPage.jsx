import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Feedback from '../../../components/feedback/Feedback';
import Icon from '../../../components/ui/Icon';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login({ username, password });
      navigate('/main-page');
    } catch (err) {
      setError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-layout">
      <div className="auth-story">
        <p className="eyebrow">CONSISTENCY STARTS HERE</p>
        <h1>
          Eat with
          <br />
          intention.
          <br />
          <span className="accent-text">
            Live with
            <br />
            energy.
          </span>
        </h1>
        <p className="muted">
          Your food, your numbers, your everyday progress. All in one place.
        </p>
        <div className="story-stamp">
          N/
          <span>
            NUTRITION
            <br />
            IN FOCUS
          </span>
        </div>
      </div>
      <section className="auth-panel">
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2>Welcome Back</h2>
        <p className="muted">Login to your nutrition workspace.</p>
        <form onSubmit={submit} aria-busy={busy}>
          <label htmlFor="login-username">
            Username
            <input
              id="login-username"
              autoComplete="username"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label htmlFor="login-password">
            Password
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <Feedback error={error} />
          <button
            className="button primary full-width"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Logging in…' : 'Login'}
            <Icon name="arrow" />
          </button>
        </form>
        <p className="auth-switch">
          New here?{' '}
          <Link to="/register" className="text-link">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}
