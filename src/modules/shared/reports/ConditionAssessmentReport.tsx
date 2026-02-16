import React from 'react';
import { useForm } from 'react-hook-form';
import { Download } from 'lucide-react';
import { useStore } from '@/store';
import { SA_MUNICIPALITIES } from '@/utils/constants';

export const ConditionAssessmentReport: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const { conditions } = useStore();

  const onSubmit = (data: any) => {
    alert(`Generating Condition Assessment Report in ${data.format} format...`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Condition Assessment Report</h2>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date From</label>
            <input type="date" {...register('dateFrom')} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date To</label>
            <input type="date" {...register('dateTo')} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Condition Threshold</label>
          <select {...register('threshold')} className="w-full px-3 py-2 border rounded-lg">
            <option value="">All Conditions</option>
            <option value="poor">Poor (&lt; 40)</option>
            <option value="fair">Fair (40-70)</option>
            <option value="good">Good (&gt; 70)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <div className="flex gap-4">
            <label><input type="radio" {...register('format')} value="pdf" defaultChecked /> PDF</label>
            <label><input type="radio" {...register('format')} value="excel" /> Excel</label>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">Preview: {conditions.length} condition assessments</p>
        </div>
        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 w-full justify-center">
          <Download size={20} />
          Generate Report
        </button>
      </form>
    </div>
  );
};
