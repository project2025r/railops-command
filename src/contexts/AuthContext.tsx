import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { authService } from '@/services/api';
import type { UserInfo } from '@/types/api.types';

export type UserRole = 'Super Admin' | 'Admin' | 'Division User';

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  division: string;
  is_admin: boolean;
  is_super_admin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    division?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map API user info to our AuthUser shape. */
function mapUserInfo(info: UserInfo): AuthUser {
  let role: UserRole = 'Division User';
  if (info.is_super_admin) {
    role = 'Super Admin';
  } else if (info.is_admin) {
    role = 'Admin';
  }

  return {
    id: info.id,
    username: info.username,
    role,
    division: info.division ?? '',
    is_admin: info.is_admin,
    is_super_admin: info.is_super_admin,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Restore cached user from localStorage for instant render
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // ── Session restore: verify with backend on mount ──────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const info = await authService.getCurrentUser();
        if (!cancelled) {
          const authUser = mapUserInfo(info);
          setUser(authUser);
          localStorage.setItem('auth_user', JSON.stringify(authUser));
        }
      } catch {
        // Session expired or invalid — clear local state
        if (!cancelled) {
          setUser(null);
          localStorage.removeItem('auth_user');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    verifySession();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (
      username: string,
      password: string,
      division?: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await authService.login({
          username,
          password,
          division: division || undefined,
        });

        // Fetch full user info after successful login
        const info = await authService.getCurrentUser();
        const authUser = mapUserInfo(info);
        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));

        return { success: true };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Login failed';
        return { success: false, error: message };
      }
    },
    [],
  );

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if endpoint fails, clear local state
    }
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
