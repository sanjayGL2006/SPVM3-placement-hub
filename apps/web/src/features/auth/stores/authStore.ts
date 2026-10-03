import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../../shared/types/global.types';
import { PREDEFINED_USERS } from '../../../shared/constants/credentials';

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  demoLogin: (userRoleOrEmail: string) => boolean;
  logout: () => void;
  updateCurrentUser: (partial: Partial<User>) => void;
  checkTokenValidity: () => boolean;
}

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiresAt: null,
      isAuthenticated: false,

      login: (rawEmail: string, rawPassword: string) => {
        try {
          const email = (rawEmail || '').trim().toLowerCase();
          const password = (rawPassword || '').trim();

          if (!email || !password) {
            return { success: false, error: 'Invalid email or password' };
          }

          const found = PREDEFINED_USERS.find(
            u => u.email.toLowerCase() === email && u.password === password
          );

          if (!found) {
            return { success: false, error: 'Invalid email or password' };
          }

          const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
          const userObj: User = {
            id: found.id,
            email: found.email,
            name: found.name,
            role: found.role,
            department: found.department,
            course: found.course,
            section: found.section,
            academicYear: found.academicYear,
            avatar: found.avatar,
            permissions: found.permissions,
          };

          set({
            user: userObj,
            token: `jwt_token_${found.id}_${Date.now()}`,
            tokenExpiresAt: expiresAt,
            isAuthenticated: true,
          });

          return { success: true };
        } catch (err) {
          return { success: false, error: 'An unexpected error occurred during login. Please try again.' };
        }
      },

      demoLogin: (userRoleOrEmail: string) => {
        const found = PREDEFINED_USERS.find(
          u => u.role === userRoleOrEmail || u.email.toLowerCase() === userRoleOrEmail.toLowerCase() || u.id === userRoleOrEmail
        );

        if (found) {
          const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
          const userObj: User = {
            id: found.id,
            email: found.email,
            name: found.name,
            role: found.role,
            department: found.department,
            course: found.course,
            section: found.section,
            academicYear: found.academicYear,
            avatar: found.avatar,
            permissions: found.permissions,
          };

          set({
            user: userObj,
            token: `jwt_token_${found.id}_${Date.now()}`,
            tokenExpiresAt: expiresAt,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          tokenExpiresAt: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('placement_pro_auth');
      },

      updateCurrentUser: (partial: Partial<User>) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...partial } });
        }
      },

      checkTokenValidity: () => {
        const { tokenExpiresAt, isAuthenticated } = get();
        if (!isAuthenticated) return false;
        if (tokenExpiresAt && Date.now() > tokenExpiresAt) {
          get().logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: 'placement_pro_auth',
    }
  )
);

