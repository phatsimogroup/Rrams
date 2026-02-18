import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Activity, BarChart3, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store';
import { DashboardMetrics } from '@/types';

export const ViewerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { roads, conditions, traffic } = useStore();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRoadLength: 0,
    pavedPercentage: 0,
    unpavedPercentage: 0,
    averageConditionIndex: 0,
    trafficVolumeTrend: [],
  });

  useEffect(() => {
    const totalLength = roads.reduce((sum, road) => sum + road.length, 0);
    const pavedLength = roads.filter(r => r.surfaceType === 'paved').reduce((sum, r) => sum + r.length, 0);
    const avgCondition = conditions.length > 0
      ? conditions.reduce((sum, c) => sum + c.overallIndex, 0) / conditions.length
      : 0;

    const trafficTrend = traffic.slice(-7).map(t => ({
      date: new Date(t.countDate).toLocaleDateString(),
      volume: t.totalVolume,
    }));

    setMetrics({
      totalRoadLength: totalLength,
      pavedPercentage: totalLength > 0 ? (pavedLength / totalLength) * 100 : 0,
      unpavedPercentage: totalLength > 0 ? ((totalLength - pavedLength) / totalLength) * 100 : 0,
      averageConditionIndex: avgCondition,
      trafficVolumeTrend: trafficTrend,
    });
  }, [roads, conditions, traffic]);

  const roadClassData = [
    { name: 'National', value: roads.filter(r => r.roadClass === 'primary').length, color: '#2563eb' },
    { name: 'Provincial', value: roads.filter(r => r.roadClass === 'secondary').length, color: '#10b981' },
    { name: 'District', value: roads.filter(r => r.roadClass === 'tertiary').length, color: '#f59e0b' },
    { name: 'Local', value: roads.filter(r => r.roadClass === 'local').length, color: '#8b5cf6' },
  ];

  const conditionData = [
    { name: 'Good', value: conditions.filter(c => c.overallIndex >= 70).length, color: '#10b981' },
    { name: 'Fair', value: conditions.filter(c => c.overallIndex >= 40 && c.overallIndex < 70).length, color: '#f59e0b' },
    { name: 'Poor', value: conditions.filter(c => c.overallIndex < 40).length, color: '#ef4444' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Viewer Dashboard</h1>
        <p className="text-gray-600">Road Network Overview & Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Road Network</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.totalRoadLength.toFixed(0)} km</p>
              <span className="flex items-center text-sm mt-2 text-green-600">
                <TrendingUp size={16} />
                <span className="ml-1">5.2% from last month</span>
              </span>
            </div>
            <div className="p-4 rounded-full bg-blue-100">
              <MapPin size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Condition Index</p>
              <p className="text-3xl font-bold text-green-600">{metrics.averageConditionIndex.toFixed(1)}</p>
              <span className="flex items-center text-sm mt-2 text-red-600">
                <TrendingDown size={16} />
                <span className="ml-1">2.1% from last month</span>
              </span>
            </div>
            <div className="p-4 rounded-full bg-green-100">
              <Activity size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paved Roads</p>
              <p className="text-3xl font-bold text-orange-600">{metrics.pavedPercentage.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-full bg-orange-100">
              <BarChart3 size={32} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Assessments</p>
              <p className="text-3xl font-bold text-purple-600">{conditions.length}</p>
            </div>
            <div className="p-4 rounded-full bg-purple-100">
              <FileText size={32} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Traffic Volume Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.trafficVolumeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Road Classification</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roadClassData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roadClassData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Road Condition Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conditionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {conditionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Access</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/map')} 
              className="w-full flex items-center gap-3 px-4 py-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <MapPin size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">View Map</p>
                <p className="text-sm text-gray-600">Interactive road network map</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/inventory')} 
              className="w-full flex items-center gap-3 px-4 py-4 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200"
            >
              <div className="p-2 bg-green-600 rounded-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Road Inventory</p>
                <p className="text-sm text-gray-600">Browse all roads and details</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/reports')} 
              className="w-full flex items-center gap-3 px-4 py-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200"
            >
              <div className="p-2 bg-purple-600 rounded-lg">
                <FileText size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">View Reports</p>
                <p className="text-sm text-gray-600">Access generated reports</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
