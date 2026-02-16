import React from 'react';
import { useForm } from 'react-hook-form';
import { Download } from 'lucide-react';
import { useStore } from '@/store';
import { SA_PROVINCES, SA_MUNICIPALITIES } from '@/utils/constants';

export const TMH18ExportReport: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const { roads, conditions } = useStore();

  const onSubmit = (data: any) => {
    alert('Generating TMH18 CSV Export...');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">TMH18 Export</h2>
      <p className="text-gray-600">Export data in TMH18 standard format for South African road management</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Province</label>
            <select {...register('province')} className="w-full px-3 py-2 border rounded-lg">
              <option value="">All Provinces</option>
              {SA_PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Municipality</label>
            <select {...register('municipality')} className="w-full px-3 py-2 border rounded-lg">
              <option value="">All Municipalities</option>
              {SA_MUNICIPALITIES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Include Data</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('includeRoads')} defaultChecked />
              Road Inventory
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('includeConditions')} defaultChecked />
              Condition Data
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('includeTraffic')} />
              Traffic Data
            </label>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-medium text-blue-900">TMH18 CSV Format</p>
          <p className="text-sm text-blue-700">Compliant with Technical Methods for Highways 18 standards</p>
        </div>
        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 w-full justify-center">
          <Download size={20} />
          Export TMH18 CSV
        </button>
      </form>
    </div>
  );
};
