import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../images/logo1.png';
import { useAuth } from '../../features/auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import DesktopNavigation from '../../navigation/DesktopNavigation';
import MobileNavigation from '../../navigation/MobileNavigation';
import Icon from '../ui/Icon';
import Feedback from '../feedback/Feedback';
export default function AppLayout() {
  const { token, username, loading, error, logout } = useAuth();
  const { preference, setPreference } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const main = useRef(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      main.current?.focus();
      window.scrollTo(0, 0);
      previousPath.current = pathname;
    }
  }, [pathname]);
  const signOut = () => {
    logout();
    navigate('/MainPage');
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link to="/" className="brand" aria-label="NutriSnap home">
          <span className="brand-mark">
            <img src={logo} alt="" />
          </span>
          <span>
            NUTRI<span className="accent-text">SNAP</span>
            <small>FUEL YOUR EVERYDAY.</small>
          </span>
        </Link>
        <DesktopNavigation />
        <div className="sidebar-note">
          <span className="eyebrow">Small steps. Strong habits.</span>
          <p>
            Know your food.
            <br />
            Own your progress.
          </p>
          <span className="sidebar-rule" />
          <small>NUTRITION / PERFORMANCE / YOU</small>
        </div>
        <div className="sidebar-footer">
          <span className="status-dot" /> Built for your everyday
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <Link to="/" className="mobile-brand" aria-label="NutriSnap home">
            <span className="mobile-brand-mark">
              <img src={logo} alt="" />
            </span>
            NUTRI<span className="accent-text">SNAP</span>
          </Link>
          <p className="topbar-label">YOUR NUTRITION WORKSPACE</p>
          <div className="topbar-actions">
            <label className="theme-control">
              <Icon name="sun" />
              <span className="sr-only">Color theme</span>
              <select
                aria-label="Color theme"
                value={preference}
                onChange={(event) => setPreference(event.target.value)}
              >
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>
            {token ? (
              <>
                <span className="user-label">
                  Username: {loading ? 'Loading…' : username || 'Signed in'}
                </span>
                <button className="button ghost compact" onClick={signOut}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="button ghost compact" to="/login">
                  Login
                </Link>
                <Link className="button primary compact" to="/register">
                  Sign up <Icon name="arrow" size={16} />
                </Link>
              </>
            )}
          </div>
        </header>
        <main id="main-content" ref={main} tabIndex={-1}>
          <Feedback
            error={error ? `Unable to load your profile: ${error}` : ''}
          />
          <Outlet />
        </main>
        <footer className="page-footer">
          <span>
            NUTRISNAP <span className="muted">/ NUTRI-KCAL</span>
          </span>
          <span>Make every bite count.</span>
        </footer>
      </div>
      <MobileNavigation />
    </div>
  );
}
