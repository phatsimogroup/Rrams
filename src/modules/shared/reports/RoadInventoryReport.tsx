import React from 'react';
import { useForm } from 'react-hook-form';
import { Download } from 'lucide-react';
import { useStore } from '@/store';
import { SA_MUNICIPALITIES, SA_NATIONAL_ROADS, SA_PROVINCIAL_ROADS } from '@/utils/constants';

export const RoadInventoryReport: React.FC = () => {
  const { register, handleSubmit, watch } = useForm();
  const { roads } = useStore();
  const roadClass = watch('roadClass');

  const getRoadOptions = () => {
    if (roadClass === 'primary') return SA_NATIONAL_ROADS;
    if (roadClass === 'secondary') return SA_PROVINCIAL_ROADS;
    return [];
  };

  const onSubmit = (data: any) => {
    alert(`Generating Road Inventory Report in ${data.format} format...`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Road Inventory Report</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-2">Road Class</label>
            <select {...register('roadClass')} className="w-full px-3 py-2 border rounded-lg">
              <option value="">All Classes</option>
              <option value="primary">National Roads (N-routes)</option>
              <option value="secondary">Provincial Roads (R-routes)</option>
              <option value="tertiary">District Roads</option>
              <option value="local">Local/Municipal Roads</option>
            </select>
          </div>
        </div>
        {(roadClass === 'primary' || roadClass === 'secondary') && (
          <div>
            <label className="block text-sm font-medium mb-2">Specific Road</label>
            <select {...register('specificRoad')} className="w-full px-3 py-2 border rounded-lg">
              <option value="">All {roadClass === 'primary' ? 'National' : 'Provincial'} Roads</option>
              {getRoadOptions().map(road => (
                <option key={road} value={road}>{road}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <div className="flex gap-4">
            <label><input type="radio" {...register('format')} value="pdf" defaultChecked /> PDF</label>
            <label><input type="radio" {...register('format')} value="excel" /> Excel</label>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">Preview: {roads.length} roads will be included</p>
        </div>
        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 w-full justify-center">
          <Download size={20} />
          Generate Report
        </button>
      </form>
    </div>
  );
};
