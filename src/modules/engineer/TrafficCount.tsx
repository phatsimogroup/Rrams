import React from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import { useStore } from '@/store';
import { Traffic } from '@/types';

interface TrafficFormData {
  roadId: string;
  cars: number;
  trucks: number;
  buses: number;
  motorcycles: number;
  peakHour: string;
}

export const TrafficCount: React.FC = () => {
  const { roads, addTraffic, user } = useStore();
  const { register, handleSubmit, reset, watch } = useForm<TrafficFormData>();

  const vehicleCounts = watch(['cars', 'trucks', 'buses', 'motorcycles']);
  const totalVolume = vehicleCounts.reduce((sum, val) => sum + (Number(val) || 0), 0);

  const onSubmit = (data: TrafficFormData) => {
    const traffic: Traffic = {
      id: Date.now().toString(),
      roadId: data.roadId,
      countDate: new Date(),
      vehicleTypes: {
        cars: data.cars,
        trucks: data.trucks,
        buses: data.buses,
        motorcycles: data.motorcycles,
      },
      totalVolume,
      peakHour: data.peakHour,
      engineerId: user?.id || '',
    };

    addTraffic(traffic);
    reset();
    alert('Traffic count saved successfully!');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Traffic Count</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Road</label>
          <select {...register('roadId', { required: true })} className="w-full px-3 py-2 border rounded-lg">
            <option value="">Select Road</option>
            {roads.map((road) => (
              <option key={road.id} value={road.id}>
                {road.roadName}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4">Vehicle Counts</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cars</label>
              <input
                type="number"
                {...register('cars', { required: true, min: 0 })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trucks</label>
              <input
                type="number"
                {...register('trucks', { required: true, min: 0 })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Buses</label>
              <input
                type="number"
                {...register('buses', { required: true, min: 0 })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Motorcycles</label>
              <input
                type="number"
                {...register('motorcycles', { required: true, min: 0 })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-lg font-bold">Total Volume: {totalVolume}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Peak Hour</label>
          <input
            type="time"
            {...register('peakHour', { required: true })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 w-full justify-center">
          <Save size={20} />
          Submit Traffic Count
        </button>
      </form>
    </div>
  );
};
