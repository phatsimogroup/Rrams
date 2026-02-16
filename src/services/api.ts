import axios from 'axios';
import { User, Road, Condition, Traffic, Announcement, ReportFilter } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (username: string, password: string) => api.post<{ token: string; user: User }>('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
};

export const roadService = {
  getAll: () => api.get<Road[]>('/roads'),
  getById: (id: string) => api.get<Road>(`/roads/${id}`),
  create: (data: Omit<Road, 'id'>) => api.post<Road>('/roads', data),
  update: (id: string, data: Partial<Road>) => api.put<Road>(`/roads/${id}`, data),
  delete: (id: string) => api.delete(`/roads/${id}`),
  importGIS: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/roads/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const conditionService = {
  getAll: () => api.get<Condition[]>('/conditions'),
  getByRoad: (roadId: string) => api.get<Condition[]>(`/conditions/road/${roadId}`),
  create: (data: Omit<Condition, 'id'>) => api.post<Condition>('/conditions', data),
  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post<{ url: string }>('/conditions/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const trafficService = {
  getAll: () => api.get<Traffic[]>('/traffic'),
  create: (data: Omit<Traffic, 'id'>) => api.post<Traffic>('/traffic', data),
};

export const reportService = {
  generate: (filter: ReportFilter) => api.post('/reports/generate', filter, { responseType: 'blob' }),
};

export const userService = {
  getAll: () => api.get<User[]>('/users'),
  create: (data: Omit<User, 'id' | 'createdAt'>) => api.post<User>('/users', data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
};

export const announcementService = {
  getAll: () => api.get<Announcement[]>('/announcements'),
  create: (data: Omit<Announcement, 'id' | 'createdAt'>) => api.post<Announcement>('/announcements', data),
};
