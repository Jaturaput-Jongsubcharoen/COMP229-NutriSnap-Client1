import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { resolveTheme, savedTheme } from './themeStorage';
export default function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(savedTheme);
  const [systemDark, setSystemDark] = useState(
    () => matchMedia('(prefers-color-scheme: dark)').matches
  );
  const theme = resolveTheme(preference, systemDark);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event) => setSystemDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      if (preference === 'system') localStorage.removeItem('nutrisnap-theme');
      else localStorage.setItem('nutrisnap-theme', preference);
    } catch {
      /* Storage can be unavailable. */
    }
  }, [theme, preference]);
  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}
