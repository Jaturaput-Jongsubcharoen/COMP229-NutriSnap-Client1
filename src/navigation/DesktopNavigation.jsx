import { NavLink, useLocation } from 'react-router-dom';
import { navigation } from './navigationConfig';
import Icon from '../components/ui/Icon';
export default function DesktopNavigation() {
  const { pathname } = useLocation();
  return (
    <nav className="desktop-navigation" aria-label="Main navigation">
      <p className="eyebrow">Workspace</p>
      {navigation.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive ||
            (item.to === '/' && ['/main-page', '/MainPage'].includes(pathname))
              ? 'active'
              : undefined
          }
          end={item.to === '/'}
        >
          <Icon name={item.icon} />
          {item.label}
          <span className="nav-indicator" />
        </NavLink>
      ))}
    </nav>
  );
}
