import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Feedback from '../../components/feedback/Feedback';
const DashboardPage = lazy(
  () => import('../../features/dashboard/pages/DashboardPage')
);
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(
  () => import('../../features/auth/pages/RegisterPage')
);
const TextSearchPage = lazy(
  () => import('../../features/food-search/pages/TextSearchPage')
);
const BarcodePage = lazy(
  () => import('../../features/barcode/pages/BarcodePage')
);
const PredictImagePage = lazy(
  () => import('../../features/ai-estimate/pages/PredictImagePage')
);
const AddItemPage = lazy(
  () => import('../../features/nutrition/pages/AddItemPage')
);
const HistoryPage = lazy(
  () => import('../../features/nutrition/pages/HistoryPage')
);
export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="route-loading">
          <Feedback loading />
        </div>
      }
    >
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/main-page" element={<DashboardPage />} />
          <Route path="/MainPage" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/text-search" element={<TextSearchPage />} />
          <Route path="/barcode" element={<BarcodePage />} />
          <Route path="/predict-image" element={<PredictImagePage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
