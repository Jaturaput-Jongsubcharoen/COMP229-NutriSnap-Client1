export function savedTheme() {
  try {
    const value = localStorage.getItem('nutrisnap-theme');
    return ['dark', 'light'].includes(value) ? value : 'system';
  } catch {
    return 'system';
  }
}
export function resolveTheme(preference, systemDark) {
  return preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
}
