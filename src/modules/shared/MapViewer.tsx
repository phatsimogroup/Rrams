import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Layers, Filter, Save, Share2, Plus } from 'lucide-react';
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
  const [showCustomMapModal, setShowCustomMapModal] = useState(false);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [customMapConfig, setCustomMapConfig] = useState({
    name: '',
    vciThreshold: '',
    potholeThreshold: '',
    surfaceType: '',
  });

  const filteredRoads = roads.filter(road => {
    if (filters.roadClass && road.roadClass !== filters.roadClass) return false;
    if (filters.municipality && road.municipality !== filters.municipality) return false;
    if (customMapConfig.vciThreshold && road.conditionIndex && road.conditionIndex >= Number(customMapConfig.vciThreshold)) return false;
    if (customMapConfig.surfaceType && road.surfaceType !== customMapConfig.surfaceType) return false;
    return true;
  });

  const handleSaveCustomMap = () => {
    alert(`Custom map "${customMapConfig.name}" saved successfully!`);
    setShowCustomMapModal(false);
  };

  const handleSaveCustomReport = () => {
    alert('Custom report created and shared successfully!');
    setShowCustomReportModal(false);
  };

  const getConditionColor = (index: number) => {
    if (index >= 80) return '#10b981';
    if (index >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="flex h-full">
      <div className="w-80 bg-white p-4 shadow-lg overflow-auto">
        <div className="mb-4 space-y-2">
          <button
            onClick={() => setShowCustomMapModal(true)}
            className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Create Custom Map
          </button>
          <button
            onClick={() => setShowCustomReportModal(true)}
            className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={20} />
            Create Custom Report
          </button>
        </div>

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

      {/* Custom Map Modal */}
      {showCustomMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Custom Map</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Map Name</label>
                <input
                  type="text"
                  value={customMapConfig.name}
                  onChange={(e) => setCustomMapConfig({ ...customMapConfig, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Roads with Poor Condition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">VCI Lower Than</label>
                <input
                  type="number"
                  value={customMapConfig.vciThreshold}
                  onChange={(e) => setCustomMapConfig({ ...customMapConfig, vciThreshold: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Surface Type</label>
                <select
                  value={customMapConfig.surfaceType}
                  onChange={(e) => setCustomMapConfig({ ...customMapConfig, surfaceType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All</option>
                  <option value="paved">Paved</option>
                  <option value="unpaved">Unpaved</option>
                  <option value="gravel">Gravel</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveCustomMap}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={20} />
                  Save Map
                </button>
                <button
                  onClick={() => setShowCustomMapModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Report Modal */}
      {showCustomReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Custom Report</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., High Pothole Roads"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="chart">Chart Format</option>
                  <option value="table">Tabular Format</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pothole Extent Above (%)</label>
                <input
                  type="number"
                  value={customMapConfig.potholeThreshold}
                  onChange={(e) => setCustomMapConfig({ ...customMapConfig, potholeThreshold: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Municipality</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="">All Municipalities</option>
                  {SA_MUNICIPALITIES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveCustomReport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Share2 size={20} />
                  Create & Share
                </button>
                <button
                  onClick={() => setShowCustomReportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
