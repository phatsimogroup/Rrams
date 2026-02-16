import React from 'react';
import { useForm } from 'react-hook-form';
import { Download } from 'lucide-react';
import { useStore } from '@/store';
import { SA_MUNICIPALITIES } from '@/utils/constants';

export const MaintenancePriorityReport: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const { roads, conditions } = useStore();

  const onSubmit = (data: any) => {
    alert(`Generating Maintenance Priority Report in ${data.format} format...`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Maintenance Priority Report</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Municipality</label>
          <select {...register('municipality')} className="w-full px-3 py-2 border rounded-lg">
            <option value="">All Municipalities</option>
            {SA_MUNICIPALITIES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Priority Level</label>
          <select {...register('priority')} className="w-full px-3 py-2 border rounded-lg">
            <option value="all">All Priorities</option>
            <option value="critical">Critical (Condition &lt; 30)</option>
            <option value="high">High (Condition 30-50)</option>
            <option value="medium">Medium (Condition 50-70)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select {...register('sortBy')} className="w-full px-3 py-2 border rounded-lg">
            <option value="condition">Worst Condition First</option>
            <option value="traffic">Highest Traffic First</option>
            <option value="class">Road Class Priority</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Budget Estimate</label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('includeBudget')} />
            Include maintenance cost estimates
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <div className="flex gap-4">
            <label><input type="radio" {...register('format')} value="pdf" defaultChecked /> PDF</label>
            <label><input type="radio" {...register('format')} value="excel" /> Excel</label>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="font-medium text-orange-900">Maintenance Priority Analysis</p>
          <p className="text-sm text-orange-700">Roads ranked by urgency and impact</p>
        </div>
        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 w-full justify-center">
          <Download size={20} />
          Generate Report
        </button>
      </form>
    </div>
  );
};
