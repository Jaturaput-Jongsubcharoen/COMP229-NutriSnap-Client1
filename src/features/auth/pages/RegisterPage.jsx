import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import Feedback from '../../../components/feedback/Feedback';
import Icon from '../../../components/ui/Icon';
export default function RegisterPage() {
  const [details, setDetails] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const change = (event) =>
    setDetails((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(details);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Unable to create an account. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-layout">
      <div className="auth-story">
        <p className="eyebrow">BUILD YOUR EVERYDAY</p>
        <h1>
          Small steps.
          <br />
          Strong habits.
          <br />
          <span className="accent-text">Start here.</span>
        </h1>
        <p className="muted">
          Make space for better nutrition. Your first step is a simple one.
        </p>
        <div className="story-stamp">
          N/
          <span>
            FUEL YOUR
            <br />
            POTENTIAL
          </span>
        </div>
      </div>
      <section className="auth-panel">
        <p className="eyebrow">MAKE IT YOURS</p>
        <h2>Create your account</h2>
        <p className="muted">Welcome New User. Let’s get you started.</p>
        <form onSubmit={submit} aria-busy={busy}>
          {[
            ['username', 'Username', 'text', 'username'],
            ['email', 'Email', 'email', 'email'],
            ['password', 'Password', 'password', 'new-password'],
          ].map(([key, label, type, autocomplete]) => (
            <label key={key} htmlFor={`register-${key}`}>
              {label}
              <input
                id={`register-${key}`}
                name={key}
                type={type}
                autoComplete={autocomplete}
                placeholder={label}
                value={details[key]}
                onChange={change}
                required
              />
            </label>
          ))}
          <Feedback error={error} />
          <button
            className="button primary full-width"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Creating account…' : 'Register'}
            <Icon name="arrow" />
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <Link className="text-link" to="/login">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}
