import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, GlobalStyles } from '@mui/material';
import theme from './theme';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/login/LoginPage';
import TabletLayout from './components/layout/TabletLayout';
import RequestHistoryPage from './pages/requester/RequestHistoryPage';
import CreateRequestPage from './pages/requester/CreateRequestPage';
import CheckoutPage from './pages/requester/CheckoutPage';
import ContainerSelectionPage from './pages/requester/ContainerSelectionPage';
import ContainerCheckoutPage from './pages/requester/ContainerCheckoutPage';
import ReturnTrolleyPage from './pages/requester/ReturnTrolleyPage';
import StagingAreaPage from './pages/requester/StagingAreaPage';
import WIPInventoryPage from './pages/requester/WIPInventoryPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ApprovalsPage from './pages/approver/ApprovalsPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const user = useAuthStore((s) => s.user);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'approver' ? '/approvals' : '/history'} replace /> : <LoginPage />} />
      <Route
        path="/"
        element={<AuthGuard><TabletLayout /></AuthGuard>}
      >
        <Route index element={<Navigate to={user?.role === 'approver' ? '/approvals' : '/history'} replace />} />
        <Route path="history" element={<RequestHistoryPage />} />
        <Route path="history/create" element={<CreateRequestPage />} />
        <Route path="history/checkout" element={<CheckoutPage />} />
        <Route path="history/container" element={<ContainerSelectionPage />} />
        <Route path="history/container-checkout" element={<ContainerCheckoutPage />} />
        <Route path="history/return-trolley" element={<ReturnTrolleyPage />} />
        <Route path="staging" element={<StagingAreaPage />} />
        <Route path="inventory" element={<WIPInventoryPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: '#e9e9e9' } }} />
      <Box sx={{ maxWidth: 1366, mx: 'auto', height: '100vh', overflow: 'hidden' }}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}
