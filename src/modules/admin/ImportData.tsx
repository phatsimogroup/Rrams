import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export const ImportData: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      alert('Data imported successfully!');
      setFile(null);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Import Data</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Import Type</label>
          <select className="w-full px-3 py-2 border rounded-lg">
            <option>Road Inventory (Shapefile/GeoJSON)</option>
            <option>Condition Data (CSV/Excel)</option>
            <option>Traffic Data (CSV/Excel)</option>
            <option>GIS Layers (Shapefile)</option>
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Drag and drop file here or click to browse</p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
            accept=".shp,.geojson,.csv,.xlsx"
          />
          <label htmlFor="file-upload" className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-blue-700">
            Select File
          </label>
        </div>

        {file && (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <FileText className="text-green-600" />
            <span className="flex-1">{file.name}</span>
            <CheckCircle className="text-green-600" />
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          {importing ? 'Importing...' : 'Import Data'}
        </button>
      </div>
    </div>
  );
};
