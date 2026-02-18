import React from 'react';
import { useStore } from '@/store';
import { Dashboard as AdminDashboard } from '@/modules/shared/Dashboard';
import { EngineerDashboard } from '@/modules/engineer/EngineerDashboard';
import { ViewerDashboard } from '@/modules/viewer/ViewerDashboard';

export const RoleDashboard: React.FC = () => {
  const { user } = useStore();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'engineer') {
    return <EngineerDashboard />;
  }

  if (user?.role === 'viewer') {
    return <ViewerDashboard />;
  }

  return <AdminDashboard />;
};
