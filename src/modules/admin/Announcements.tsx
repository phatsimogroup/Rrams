import React from 'react';
import { Plus, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store';

export const Announcements: React.FC = () => {
  const { announcements } = useStore();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="text-red-600" size={20} />;
      case 'medium': return <AlertTriangle className="text-orange-600" size={20} />;
      default: return <Info className="text-blue-600" size={20} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-600 bg-red-50';
      case 'medium': return 'border-l-4 border-orange-600 bg-orange-50';
      default: return 'border-l-4 border-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className={`p-4 rounded-lg ${getPriorityColor(announcement.priority)}`}>
            <div className="flex items-start gap-3">
              {getPriorityIcon(announcement.priority)}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{announcement.title}</h3>
                <p className="text-gray-700 mt-1">{announcement.message}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>By: {announcement.createdBy}</span>
                  <span>Date: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                  {announcement.expiresAt && (
                    <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
