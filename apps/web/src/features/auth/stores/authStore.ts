import { create } from 'zustand';
import { User, UserRole, Department } from '../../../shared/types/global.types';
import { supabase } from '../../../shared/utils/supabase';
import { PREDEFINED_USERS } from '../../../shared/constants/credentials';

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateCurrentUser: (partial: Partial<User>) => void;
  checkTokenValidity: () => boolean;
}

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const AUTH_STORAGE_KEY = 'spvm3_auth_session';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  tokenExpiresAt: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Check Supabase session first
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session && session.user) {
        const expiresAt = (session.expires_at || 0) * 1000 || (Date.now() + TOKEN_EXPIRY_MS);
        
        // Fetch real profile from Supabase profiles table
        let userRole: UserRole = (session.user.app_metadata?.role as UserRole) || 'student';
        let userDept: Department | undefined = session.user.app_metadata?.department as Department;
        let userName: string = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            userRole = profile.role || userRole;
            userDept = profile.department || userDept;
            userName = profile.name || userName;
          }
        } catch (_) {
          // Fallback to app_metadata if profiles table query fails
        }

        const userObj: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: userName,
          role: userRole,
          department: userDept,
          avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
          permissions: userRole === 'developer' || userRole === 'principal' || userRole === 'admin' ? ['*'] : [],
        };

        set({
          user: userObj,
          token: session.access_token,
          tokenExpiresAt: expiresAt,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        return;
      }

      // Check stored local session if Supabase auth didn't return session
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.tokenExpiresAt && Date.now() < parsed.tokenExpiresAt && parsed.user) {
            set({
              user: parsed.user,
              token: parsed.token,
              tokenExpiresAt: parsed.tokenExpiresAt,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
            return;
          }
        } catch (_) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      // If no valid session exists, enforce logged-out state
      set({
        user: null,
        token: null,
        tokenExpiresAt: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    } catch (err) {
      set({
        user: null,
        token: null,
        tokenExpiresAt: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  login: async (rawEmail: string, rawPassword: string) => {
    try {
      const email = (rawEmail || '').trim().toLowerCase();
      const password = (rawPassword || '').trim();

      if (!email || !password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Attempt Supabase Auth login if URL is configured
      try {
        const envUrl = import.meta.env.VITE_SUPABASE_URL || 'placeholder';
        const isPlaceholder = envUrl.includes('placeholder');
        
        if (!isPlaceholder) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });

          if (!error && data?.session && data?.user) {
          const expiresAt = (data.session.expires_at || 0) * 1000 || (Date.now() + TOKEN_EXPIRY_MS);
          const userRole: UserRole = (data.user.app_metadata?.role as UserRole) || 'student';
          const userDept: Department | undefined = data.user.app_metadata?.department as Department;
          
          const userObj: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            role: userRole,
            department: userDept,
            avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
            permissions: userRole === 'developer' || userRole === 'principal' || userRole === 'admin' ? ['*'] : [],
          };

          const sessionPayload = {
            user: userObj,
            token: data.session.access_token,
            tokenExpiresAt: expiresAt,
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionPayload));

          set({
            user: userObj,
            token: data.session.access_token,
            tokenExpiresAt: expiresAt,
            isAuthenticated: true,
          });

          return { success: true };
        }
        }
      } catch (_) {
        // Fallthrough to verified predefined user authentication if Supabase endpoint is unconfigured
      }

      // Fallback check against PREDEFINED_USERS with exact email & password match
      const found = PREDEFINED_USERS.find(
        (u) => u.email.toLowerCase() === email && u.password === password
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

      const token = `auth_token_${found.id}_${Date.now()}`;
      const sessionPayload = {
        user: userObj,
        token,
        tokenExpiresAt: expiresAt,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionPayload));

      set({
        user: userObj,
        token,
        tokenExpiresAt: expiresAt,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred during login. Please try again.' };
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}

    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('placement_pro_auth');
    sessionStorage.clear();

    set({
      user: null,
      token: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
    });
  },

  updateCurrentUser: (partial: Partial<User>) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...partial };
      set({ user: updated });
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...parsed, user: updated }));
        } catch (_) {}
      }
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
}));
