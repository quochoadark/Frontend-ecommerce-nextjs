"use client";

import { createContext, useContext, useReducer, useCallback, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      return { ...initialState };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Mock API — replace with real API calls to your Spring Boot backend ───────

const MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@shop.com": {
    id: "u1",
    name: "Nguyễn Admin",
    email: "admin@shop.com",
    role: "admin",
    password: "admin123",
  },
  "manager@shop.com": {
    id: "u2",
    name: "Trần Manager",
    email: "manager@shop.com",
    role: "manager",
    password: "manager123",
  },
};

async function mockLoginApi(
  email: string,
  password: string
): Promise<User> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1000));

  const found = MOCK_USERS[email];
  if (!found || found.password !== password) {
    throw new Error("Email hoặc mật khẩu không đúng.");
  }

  const { password: _pwd, ...user } = found;
  void _pwd;
  return user;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        const user: User = JSON.parse(saved);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await mockLoginApi(email, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      localStorage.setItem("auth_user", JSON.stringify(user));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại.";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("auth_user");
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
