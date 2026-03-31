import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import SetupPage from './pages/setup/SetupPage';
import HomePage from './pages/home/HomePage';
import AreaPage from './pages/area/AreaPage';
import MaterialConfigPage from './pages/material/MaterialConfigPage';
import ContainerConfigPage from './pages/container/ContainerConfigPage';
import StagingAreaPage from './pages/staging/StagingAreaPage';
import WorkflowConfigPage from './pages/workflow/WorkflowConfigPage';
import ExecutionSourcePage from './pages/execution-source/ExecutionSourcePage';
import SettingsPage from './pages/settings/SettingsPage';

const SETUP_KEY = 'mts_setup_complete';

function RequireSetup({ children }: { children: React.ReactNode }) {
  const done = localStorage.getItem(SETUP_KEY) === 'true';
  return done ? <>{children}</> : <Navigate to="/setup" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route
        path="/"
        element={
          <RequireSetup>
            <AppLayout />
          </RequireSetup>
        }
      >
        {/* Default: empty state homepage */}
        <Route index element={<HomePage />} />

        {/* Area-based view */}
        <Route path="area/:areaId" element={<AreaPage />} />

        {/* Sidebar pages */}
        <Route path="execution-source" element={<ExecutionSourcePage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Legacy redirects */}
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="device-setup" element={<Navigate to="/execution-source" replace />} />
        <Route path="external-system-links" element={<Navigate to="/settings" replace />} />

        {/* Config pages */}
        <Route path="material" element={<MaterialConfigPage />} />
        <Route path="container" element={<ContainerConfigPage />} />
        <Route path="staging" element={<StagingAreaPage />} />
        <Route path="workflow" element={<WorkflowConfigPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
