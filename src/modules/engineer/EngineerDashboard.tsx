import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Camera, MapPin, Activity, BarChart3, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store';

export const EngineerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { conditions, traffic, user } = useStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const myConditions = conditions.filter(c => c.engineerId === user?.id);
  const myTraffic = traffic.filter(t => t.engineerId === user?.id);
  const pendingSync = conditions.filter(c => c.syncStatus === 'offline').length;

  const recentActivity = [
    ...myConditions.slice(-5).map(c => ({ type: 'Condition', date: c.inspectionDate, status: c.syncStatus })),
    ...myTraffic.slice(-5).map(t => ({ type: 'Traffic', date: t.countDate, status: 'synced' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Engineer Dashboard</h1>
        <p className="text-gray-600">Field Data Capture & Assessment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Assessments</p>
              <p className="text-3xl font-bold text-blue-600">{myConditions.length}</p>
            </div>
            <div className="p-4 rounded-full bg-blue-100">
              <Activity size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Traffic Counts</p>
              <p className="text-3xl font-bold text-green-600">{myTraffic.length}</p>
            </div>
            <div className="p-4 rounded-full bg-green-100">
              <BarChart3 size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Sync</p>
              <p className="text-3xl font-bold text-orange-600">{pendingSync}</p>
            </div>
            <div className="p-4 rounded-full bg-orange-100">
              <Clock size={32} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Connection</p>
              <p className="text-lg font-bold text-purple-600">{isOnline ? 'Online' : 'Offline'}</p>
            </div>
            <div className="p-4 rounded-full bg-purple-100">
              {isOnline ? <Wifi size={32} className="text-purple-600" /> : <WifiOff size={32} className="text-purple-600" />}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/condition')} 
              className="w-full flex items-center gap-3 px-4 py-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <Camera size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Capture Condition</p>
                <p className="text-sm text-gray-600">Assess road condition with photos & GPS</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/traffic')} 
              className="w-full flex items-center gap-3 px-4 py-4 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200"
            >
              <div className="p-2 bg-green-600 rounded-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Record Traffic</p>
                <p className="text-sm text-gray-600">Count vehicles and traffic volume</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/map')} 
              className="w-full flex items-center gap-3 px-4 py-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200"
            >
              <div className="p-2 bg-purple-600 rounded-lg">
                <MapPin size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">View Map</p>
                <p className="text-sm text-gray-600">Locate roads and view assessments</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${activity.type === 'Condition' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {activity.type === 'Condition' ? <Activity size={20} className="text-blue-600" /> : <BarChart3 size={20} className="text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.type} Assessment</p>
                    <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                  {activity.status === 'synced' ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <Clock size={20} className="text-orange-600" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">My Assessment Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={myConditions.slice(-7).map((c, idx) => ({
            day: `Day ${idx + 1}`,
            assessments: idx + 1,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
            <Line type="monotone" dataKey="assessments" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
