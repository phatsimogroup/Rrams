import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, Save, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '@/store';
import { Condition } from '@/types';
import { SA_MUNICIPALITIES, SA_NATIONAL_ROADS, SA_PROVINCIAL_ROADS } from '@/utils/constants';

interface ConditionFormData {
  roadId: string;
  municipality: string;
  roadClass: string;
  specificRoad: string;
  cracking: number;
  rutting: number;
  potholes: number;
  structuralCondition: number;
  ridingQuality: number;
}

export const ConditionCapture: React.FC = () => {
  const { roads, addCondition, user } = useStore();
  const { register, handleSubmit, reset, watch } = useForm<ConditionFormData>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [gpsLocation, setGpsLocation] = useState<[number, number]>([0, 0]);

  const roadClass = watch('roadClass');

  const getRoadOptions = () => {
    if (roadClass === 'primary') return SA_NATIONAL_ROADS;
    if (roadClass === 'secondary') return SA_PROVINCIAL_ROADS;
    return [];
  };

  const getGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error('GPS Error:', error)
      );
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const onSubmit = (data: ConditionFormData) => {
    const overallIndex = (
      (100 - data.cracking) * 0.3 +
      (100 - data.rutting) * 0.3 +
      (100 - data.potholes) * 0.2 +
      data.structuralCondition * 0.1 +
      data.ridingQuality * 0.1
    );

    const condition: Condition = {
      id: Date.now().toString(),
      roadId: data.roadId,
      inspectionDate: new Date(),
      surfaceDefects: {
        cracking: data.cracking,
        rutting: data.rutting,
        potholes: data.potholes,
      },
      structuralCondition: data.structuralCondition,
      ridingQuality: data.ridingQuality,
      overallIndex,
      photos,
      gpsLocation,
      engineerId: user?.id || '',
      syncStatus: isOnline ? 'synced' : 'offline',
    };

    addCondition(condition);
    reset();
    setPhotos([]);
    alert(isOnline ? 'Condition saved and synced!' : 'Condition saved offline. Will sync when online.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Condition Capture</h1>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-2 text-green-600">
              <Wifi size={20} />
              Online
            </span>
          ) : (
            <span className="flex items-center gap-2 text-red-600">
              <WifiOff size={20} />
              Offline
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Municipality</label>
            <select {...register('municipality', { required: true })} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select Municipality</option>
              {SA_MUNICIPALITIES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Road Class</label>
            <select {...register('roadClass', { required: true })} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select Road Class</option>
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
            <select {...register('specificRoad', { required: true })} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select {roadClass === 'primary' ? 'National' : 'Provincial'} Road</option>
              {getRoadOptions().map(road => (
                <option key={road} value={road}>{road}</option>
              ))}
            </select>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4">Surface Defects (%)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cracking</label>
              <input
                type="number"
                {...register('cracking', { required: true, min: 0, max: 100 })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rutting</label>
              <input
                type="number"
                {...register('rutting', { required: true, min: 0, max: 100 })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Potholes</label>
              <input
                type="number"
                {...register('potholes', { required: true, min: 0, max: 100 })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0-100"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4">Condition Ratings (0-100)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Structural Condition</label>
              <input
                type="number"
                {...register('structuralCondition', { required: true, min: 0, max: 100 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Riding Quality</label>
              <input
                type="number"
                {...register('ridingQuality', { required: true, min: 0, max: 100 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4">Multimedia</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
              <Camera size={20} />
              Capture Photo
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
            </label>
            <button type="button" onClick={getGPSLocation} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <MapPin size={20} />
              Get GPS Location
            </button>
          </div>
          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {photos.map((photo, idx) => (
                <img key={idx} src={photo} alt={`Capture ${idx + 1}`} className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          )}
          {gpsLocation[0] !== 0 && (
            <p className="mt-2 text-sm text-gray-600">
              GPS: {gpsLocation[0].toFixed(6)}, {gpsLocation[1].toFixed(6)}
            </p>
          )}
        </div>

        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 w-full justify-center">
          <Save size={20} />
          Submit Condition Report
        </button>
      </form>
    </div>
  );
};
