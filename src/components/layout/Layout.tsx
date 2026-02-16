import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Map, Database, Activity, BarChart3, Users, Bell, LogOut } from 'lucide-react';
import { useStore } from '@/store';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { user, setUser } = useStore();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home, roles: ['admin', 'engineer', 'viewer'] },
    { name: 'Map', path: '/map', icon: Map, roles: ['admin', 'engineer', 'viewer'] },
    { name: 'Inventory', path: '/inventory', icon: Database, roles: ['admin', 'engineer', 'viewer'] },
    { name: 'Condition', path: '/condition', icon: Activity, roles: ['admin', 'engineer'] },
    { name: 'Traffic', path: '/traffic', icon: BarChart3, roles: ['admin', 'engineer'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['admin', 'engineer', 'viewer'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
    { name: 'Announcements', path: '/announcements', icon: Bell, roles: ['admin'] },
  ];

  const filteredNav = navigation.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">RRAMS</h1>
          <p className="text-sm text-gray-600">{user?.fullName}</p>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{user?.role}</span>
        </div>
        <nav className="p-4 space-y-2">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
