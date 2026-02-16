import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { RoadInventoryReport } from './reports/RoadInventoryReport';
import { ConditionAssessmentReport } from './reports/ConditionAssessmentReport';
import { TrafficAnalysisReport } from './reports/TrafficAnalysisReport';
import { TMH18ExportReport } from './reports/TMH18ExportReport';
import { MaintenancePriorityReport } from './reports/MaintenancePriorityReport';

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('');

  const reportTypes = [
    { value: 'inventory', label: 'Road Inventory Report', component: RoadInventoryReport },
    { value: 'condition', label: 'Condition Assessment Report', component: ConditionAssessmentReport },
    { value: 'traffic', label: 'Traffic Analysis Report', component: TrafficAnalysisReport },
    { value: 'tmh18', label: 'TMH18 Export', component: TMH18ExportReport },
    { value: 'maintenance', label: 'Maintenance Priority Report', component: MaintenancePriorityReport },
  ];

  const selectedReport = reportTypes.find(r => r.value === reportType);
  const ReportComponent = selectedReport?.component;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Report Types</h2>
          <div className="space-y-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  reportType === type.value ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FileText size={16} className="inline mr-2" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          {ReportComponent ? (
            <ReportComponent />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Select a report type to configure
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
