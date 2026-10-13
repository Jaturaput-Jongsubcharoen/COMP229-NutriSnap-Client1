import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '../theme/ThemeProvider';
import AuthProvider from '../features/auth/AuthProvider';
import AppRoutes from './routes/AppRoutes';
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
