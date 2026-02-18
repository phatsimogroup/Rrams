import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Login } from '@/components/auth/Login';
import { Layout } from '@/components/layout/Layout';
import { RoleDashboard } from '@/components/common/RoleDashboard';
import { MapViewer } from '@/modules/shared/MapViewer';
import { RoadInventory } from '@/modules/shared/RoadInventory';
import { Reports } from '@/modules/shared/Reports';
import { ConditionCapture } from '@/modules/engineer/ConditionCapture';
import { TrafficCount } from '@/modules/engineer/TrafficCount';
import { UserManagement } from '@/modules/admin/UserManagement';
import { Announcements } from '@/modules/admin/Announcements';
import { ImportData } from '@/modules/admin/ImportData';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleDashboard />} />
          <Route path="map" element={<MapViewer />} />
          <Route path="inventory" element={<RoadInventory />} />
          <Route path="condition" element={<ConditionCapture />} />
          <Route path="traffic" element={<TrafficCount />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="import" element={<ImportData />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
