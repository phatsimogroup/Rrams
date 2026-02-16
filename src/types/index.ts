export type UserRole = 'admin' | 'engineer' | 'viewer' | 'analyst';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  active: boolean;
  createdAt: Date;
}

export interface Road {
  id: string;
  roadName: string;
  roadClass: 'primary' | 'secondary' | 'tertiary' | 'local';
  surfaceType: 'paved' | 'unpaved' | 'gravel';
  length: number;
  municipality: string;
  coordinates: [number, number][];
  conditionIndex?: number;
  lastInspection?: Date;
}

export interface Condition {
  id: string;
  roadId: string;
  inspectionDate: Date;
  surfaceDefects: {
    cracking: number;
    rutting: number;
    potholes: number;
  };
  structuralCondition: number;
  ridingQuality: number;
  overallIndex: number;
  photos: string[];
  gpsLocation: [number, number];
  engineerId: string;
  syncStatus: 'synced' | 'pending' | 'offline';
}

export interface Traffic {
  id: string;
  roadId: string;
  countDate: Date;
  vehicleTypes: {
    cars: number;
    trucks: number;
    buses: number;
    motorcycles: number;
  };
  totalVolume: number;
  peakHour: string;
  engineerId: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface DashboardMetrics {
  totalRoadLength: number;
  pavedPercentage: number;
  unpavedPercentage: number;
  averageConditionIndex: number;
  trafficVolumeTrend: Array<{ date: string; volume: number }>;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'roads' | 'conditions' | 'traffic' | 'municipalities';
  visible: boolean;
  data: any[];
}

export interface ReportFilter {
  municipality?: string;
  roadClass?: string;
  dateFrom?: Date;
  dateTo?: Date;
  format: 'pdf' | 'excel' | 'tmh18';
}
