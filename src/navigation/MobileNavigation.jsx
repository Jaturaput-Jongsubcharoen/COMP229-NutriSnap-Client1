import { NavLink, useLocation } from 'react-router-dom';
import { navigation } from './navigationConfig';
import Icon from '../components/ui/Icon';
export default function MobileNavigation() {
  const { pathname } = useLocation();
  return (
    <nav className="mobile-navigation" aria-label="Mobile navigation">
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
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
