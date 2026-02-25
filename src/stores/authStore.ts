import { create } from 'zustand';
import type { DeviceUser } from '../types';
import { mockDeviceUser, mockApproverUser } from '../data/mock';

interface AuthState {
  user: DeviceUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (username, password) => {
    if (username.trim() === 'PA01' && password.trim() === '1234') {
      set({ user: mockDeviceUser });
      return true;
    }
    if (username.trim() === 'AP01' && password.trim() === '1234') {
      set({ user: mockApproverUser });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
}));
