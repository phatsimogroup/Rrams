import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Layers, Filter } from 'lucide-react';
import { useStore } from '@/store';
import { SA_MUNICIPALITIES } from '@/utils/constants';
import 'leaflet/dist/leaflet.css';

export const MapViewer: React.FC = () => {
  const { roads, conditions } = useStore();
  const [layers, setLayers] = useState({
    roads: true,
    conditions: true,
    traffic: false,
  });
  const [filters, setFilters] = useState({
    roadClass: '',
    municipality: '',
  });

  const filteredRoads = roads.filter(road => {
    if (filters.roadClass && road.roadClass !== filters.roadClass) return false;
    if (filters.municipality && road.municipality !== filters.municipality) return false;
    return true;
  });

  const getConditionColor = (index: number) => {
    if (index >= 80) return '#10b981';
    if (index >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="flex h-full">
      <div className="w-80 bg-white p-4 shadow-lg overflow-auto">
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-3">
            <Layers size={20} />
            Layer Controls
          </h3>
          <div className="space-y-2">
            {Object.entries(layers).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setLayers({ ...layers, [key]: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold mb-3">
            <Filter size={20} />
            Filters
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Road Class</label>
              <select
                value={filters.roadClass}
                onChange={(e) => setFilters({ ...filters, roadClass: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="primary">National Roads (N-routes)</option>
                <option value="secondary">Provincial Roads (R-routes)</option>
                <option value="tertiary">District Roads</option>
                <option value="local">Local/Municipal Roads</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Municipality</label>
              <select
                value={filters.municipality}
                onChange={(e) => setFilters({ ...filters, municipality: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Municipalities</option>
                {SA_MUNICIPALITIES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapContainer center={[-25.7479, 28.2293]} zoom={10} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {layers.roads && filteredRoads.map((road) => (
            <Polyline
              key={road.id}
              positions={road.coordinates}
              color={road.conditionIndex ? getConditionColor(road.conditionIndex) : '#3b82f6'}
              weight={4}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold">{road.roadName}</h4>
                  <p className="text-sm">Class: {road.roadClass}</p>
                  <p className="text-sm">Surface: {road.surfaceType}</p>
                  <p className="text-sm">Length: {road.length} km</p>
                  {road.conditionIndex && <p className="text-sm">Condition: {road.conditionIndex}</p>}
                </div>
              </Popup>
            </Polyline>
          ))}
          {layers.conditions && conditions.map((condition) => (
            <Marker key={condition.id} position={condition.gpsLocation}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold">Condition Report</h4>
                  <p className="text-sm">Overall Index: {condition.overallIndex}</p>
                  <p className="text-sm">Date: {new Date(condition.inspectionDate).toLocaleDateString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded shadow text-sm">
          Coordinates: -25.7479, 28.2293 | Scale: 1:50000
        </div>
      </div>
    </div>
  );
};
