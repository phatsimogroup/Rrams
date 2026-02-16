import { create } from 'zustand';
import { User, Road, Condition, Traffic, Announcement } from '@/types';

interface AppState {
  user: User | null;
  roads: Road[];
  conditions: Condition[];
  traffic: Traffic[];
  announcements: Announcement[];
  setUser: (user: User | null) => void;
  setRoads: (roads: Road[]) => void;
  setConditions: (conditions: Condition[]) => void;
  setTraffic: (traffic: Traffic[]) => void;
  setAnnouncements: (announcements: Announcement[]) => void;
  addRoad: (road: Road) => void;
  addCondition: (condition: Condition) => void;
  addTraffic: (traffic: Traffic) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  roads: [],
  conditions: [],
  traffic: [],
  announcements: [],
  setUser: (user) => set({ user }),
  setRoads: (roads) => set({ roads }),
  setConditions: (conditions) => set({ conditions }),
  setTraffic: (traffic) => set({ traffic }),
  setAnnouncements: (announcements) => set({ announcements }),
  addRoad: (road) => set((state) => ({ roads: [...state.roads, road] })),
  addCondition: (condition) => set((state) => ({ conditions: [...state.conditions, condition] })),
  addTraffic: (traffic) => set((state) => ({ traffic: [...state.traffic, traffic] })),
}));
