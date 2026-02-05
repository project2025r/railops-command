import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "Super Admin" | "Admin" | "Division User";

export interface AuthUser {
  username: string;
  role: UserRole;
  division: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, division?: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials database
const MOCK_USERS: Record<string, { password: string; role: UserRole; division: string }> = {
  admin: {
    password: "admin",
    role: "Super Admin",
    division: "", // Super Admin has access to all divisions
  },
  Ajuser1: {
    password: "123",
    role: "Division User",
    division: "Ajmer",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Check for existing session in localStorage
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback((username: string, password: string, division?: string) => {
    const mockUser = MOCK_USERS[username];

    if (!mockUser) {
      return { success: false, error: "User not found" };
    }

    if (mockUser.password !== password) {
      return { success: false, error: "Invalid password" };
    }

    // For division users, verify division matches
    if (mockUser.role === "Division User" && division && division !== mockUser.division) {
      return { success: false, error: `User ${username} is not assigned to ${division} division` };
    }

    const authUser: AuthUser = {
      username,
      role: mockUser.role,
      division: mockUser.division || division || "",
    };

    setUser(authUser);
    localStorage.setItem("auth_user", JSON.stringify(authUser));
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
