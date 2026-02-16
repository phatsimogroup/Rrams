import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store';
import { DashboardMetrics } from '@/types';

export const Dashboard: React.FC = () => {
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

  const MetricCard: React.FC<{ title: string; value: string | number; trend?: number }> = ({ title, value, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold">{value}</p>
        {trend !== undefined && (
          <span className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/condition')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
            <Plus size={20} />
            Add Condition
          </button>
          <button onClick={() => navigate('/traffic')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus size={20} />
            Add Traffic Count
          </button>
          <button onClick={() => navigate('/import')} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Upload size={20} />
            Import Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Road Length" value={`${metrics.totalRoadLength.toFixed(2)} km`} />
        <MetricCard title="% Paved" value={`${metrics.pavedPercentage.toFixed(1)}%`} />
        <MetricCard title="% Unpaved" value={`${metrics.unpavedPercentage.toFixed(1)}%`} />
        <MetricCard title="Avg Condition Index" value={metrics.averageConditionIndex.toFixed(2)} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Traffic Volume Trend (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.trafficVolumeTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
