import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode, AuditLog } from '../../../shared/types/global.types';
import { MOCK_AUDIT_LOGS } from '../../../shared/utils/mockData';

interface SettingsState {
  theme: ThemeMode;
  accentColor: string;
  emailNotifications: boolean;
  driveAlerts: boolean;
  interviewReminders: boolean;
  aiInsightsAlerts: boolean;
  twoFactorEnabled: boolean;
  auditLogs: AuditLog[];

  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  toggleSetting: (key: 'emailNotifications' | 'driveAlerts' | 'interviewReminders' | 'aiInsightsAlerts' | 'twoFactorEnabled') => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      accentColor: '#6366F1',
      emailNotifications: true,
      driveAlerts: true,
      interviewReminders: true,
      aiInsightsAlerts: true,
      twoFactorEnabled: false,
      auditLogs: MOCK_AUDIT_LOGS,

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // system
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (isDark) root.classList.add('dark');
          else root.classList.remove('dark');
        }
      },

      setAccentColor: (accentColor) => set({ accentColor }),

      toggleSetting: (key) => set((state) => ({ [key]: !state[key] })),

      addAuditLog: (logData) => {
        const id = `LOG-${Date.now()}`;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const newLog: AuditLog = { ...logData, id, timestamp };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
      },

      clearAuditLogs: () => set({ auditLogs: [] }),
    }),
    {
      name: 'placement_pro_settings',
    }
  )
);
