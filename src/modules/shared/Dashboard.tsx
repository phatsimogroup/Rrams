import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, TrendingUp, TrendingDown, MapPin, Activity, BarChart3, AlertTriangle, Map, Layers, FileText, Users, UserCheck, Search } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store';
import { DashboardMetrics } from '@/types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { roads, conditions, traffic } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
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

  const MetricCard: React.FC<{ title: string; value: string | number; icon: any; color: string; trend?: number }> = 
    ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          {trend !== undefined && (
            <span className={`flex items-center text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1">{Math.abs(trend)}% from last month</span>
            </span>
          )}
        </div>
        <div className="p-4 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon size={32} style={{ color }} />
        </div>
      </div>
    </div>
  );

  const categories = [
    'Overview',
    'Road network',
    'Road Condition',
    'Treatments',
    'Traffic',
    'Structures',
    'Assessment Status',
    'Distress Summary',
    'Distress Summary - Deduct',
    'Quarterly Reports',
    'Prioritized Roads',
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">RRAMS Dashboard</h1>
          <p className="text-gray-600">Road & Runway Asset Management System</p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Top Stats Bar */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <div className="bg-white px-6 py-3 rounded-lg shadow flex items-center gap-3 min-w-fit">
          <Map className="text-blue-600" size={24} />
          <div>
            <p className="text-2xl font-bold text-gray-800">8</p>
            <p className="text-sm text-gray-600">Maps</p>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow flex items-center gap-3 min-w-fit">
          <Layers className="text-green-600" size={24} />
          <div>
            <p className="text-2xl font-bold text-gray-800">17</p>
            <p className="text-sm text-gray-600">Layers</p>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow flex items-center gap-3 min-w-fit">
          <FileText className="text-orange-600" size={24} />
          <div>
            <p className="text-2xl font-bold text-gray-800">1</p>
            <p className="text-sm text-gray-600">Documents</p>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow flex items-center gap-3 min-w-fit cursor-pointer hover:bg-gray-50">
          <BarChart3 className="text-purple-600" size={24} />
          <p className="text-sm text-gray-600">Forms</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow flex items-center gap-3 min-w-fit cursor-pointer hover:bg-gray-50">
          <Activity className="text-red-600" size={24} />
          <p className="text-sm text-gray-600">Data Reviewer</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow flex items-center gap-3 min-w-fit cursor-pointer hover:bg-gray-50">
          <Users className="text-indigo-600" size={24} />
          <p className="text-sm text-gray-600">People</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow flex items-center gap-3 min-w-fit cursor-pointer hover:bg-gray-50">
          <UserCheck className="text-teal-600" size={24} />
          <p className="text-sm text-gray-600">Groups</p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Total Road Network" 
          value={`${metrics.totalRoadLength.toFixed(0)} km`} 
          icon={MapPin}
          color="#2563eb"
          trend={5.2}
        />
        <MetricCard 
          title="Average Condition Index" 
          value={metrics.averageConditionIndex.toFixed(1)} 
          icon={Activity}
          color="#10b981"
          trend={-2.1}
        />
        <MetricCard 
          title="Paved Roads" 
          value={`${metrics.pavedPercentage.toFixed(1)}%`} 
          icon={BarChart3}
          color="#f59e0b"
        />
        <MetricCard 
          title="Condition Assessments" 
          value={conditions.length} 
          icon={AlertTriangle}
          color="#8b5cf6"
          trend={12.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Km by Surface Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'EARTH', value: 0 },
              { name: 'FLEX', value: 0 },
              { name: 'GRAV', value: 0 },
              { name: 'TRACK', value: 0 },
              { name: 'UNVERIFIED', value: 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Km by Municipality</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Elias Motsoaledi', FLEX: 0, TRACK: 0, GRAV: 0, EARTH: 0 },
              { name: 'Ephraim Mogale', FLEX: 0, TRACK: 0, GRAV: 0, EARTH: 0 },
              { name: 'Fetakgomo Tubatse', FLEX: 0, TRACK: 0, GRAV: 0, EARTH: 0 },
              { name: 'Makhuduthamaga', FLEX: 0, TRACK: 0, GRAV: 0, EARTH: 0 },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="FLEX" stackId="a" fill="#2563eb" />
              <Bar dataKey="TRACK" stackId="a" fill="#10b981" />
              <Bar dataKey="GRAV" stackId="a" fill="#f59e0b" />
              <Bar dataKey="EARTH" stackId="a" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Deduct VCI Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'EARTH', Very_Good: 0, Good: 0, Fair: 0, Poor: 0, Very_Poor: 0 },
              { name: 'FLEX', Very_Good: 0, Good: 0, Fair: 0, Poor: 0, Very_Poor: 0 },
              { name: 'GRAV', Very_Good: 0, Good: 0, Fair: 0, Poor: 0, Very_Poor: 0 },
              { name: 'TRACK', Very_Good: 0, Good: 0, Fair: 0, Poor: 0, Very_Poor: 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="Very_Good" stackId="a" fill="#10b981" />
              <Bar dataKey="Good" stackId="a" fill="#84cc16" />
              <Bar dataKey="Fair" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Poor" stackId="a" fill="#f97316" />
              <Bar dataKey="Very_Poor" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Average VCI - Aggregate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { year: '2023', TRACK: 0, EARTH: 0, GRAV: 0, FLEX: 0 },
              { year: '2024', TRACK: 0, EARTH: 0, GRAV: 0, FLEX: 0 },
              { year: '2025', TRACK: 0, EARTH: 0, GRAV: 0, FLEX: 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Line type="monotone" dataKey="TRACK" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="EARTH" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="GRAV" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="FLEX" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Average VCI - Deduct</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { year: '2023', TRACK: 0, EARTH: 0, GRAV: 0, FLEX: 0 },
              { year: '2024', TRACK: 0, EARTH: 0, GRAV: 0, FLEX: 0 },
              { year: '2025', TRACK: 0, EARTH: 0, GRAV: 0, FLEX: 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[46, 96]} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Line type="monotone" dataKey="TRACK" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="EARTH" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="GRAV" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="FLEX" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
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
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Road Assessments Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assessor</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Surface</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Length</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">VCI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-500">No data available</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">1 - 5 of 0 items</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Network Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Surface</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Length Km</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">% Network</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assessed</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">% Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">No data available</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">1 - 5 of 0 items</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Paved Treatments Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Municipality</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Surface</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Treatment</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-500">No data available</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">1 - 5 of 0 items</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Unpaved Treatments Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Municipality</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Surface</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Treatment</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-500">No data available</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">1 - 5 of 0 items</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Structures Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Municipality</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Culvert Major</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bridge</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Culvert Lesser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-500">No data available</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600">1 - 2 of 0 items</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button 
            onClick={() => navigate('/condition')} 
            className="flex items-center gap-3 px-4 py-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Add Condition Assessment</p>
              <p className="text-sm text-gray-600">Capture road condition data</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/traffic')} 
            className="flex items-center gap-3 px-4 py-4 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200"
          >
            <div className="p-2 bg-green-600 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Add Traffic Count</p>
              <p className="text-sm text-gray-600">Record traffic volume data</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/import')} 
            className="flex items-center gap-3 px-4 py-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200"
          >
            <div className="p-2 bg-purple-600 rounded-lg">
              <Upload size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Import Data</p>
              <p className="text-sm text-gray-600">Upload GIS or CSV files</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/reports')} 
            className="flex items-center gap-3 px-4 py-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition border border-orange-200"
          >
            <div className="p-2 bg-orange-600 rounded-lg">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Generate Reports</p>
              <p className="text-sm text-gray-600">Export TMH18 and analytics</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
