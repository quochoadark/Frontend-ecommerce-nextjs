"use client";

import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { login as loginService, logout as logoutService } from "@/services/auth.service";
import { getProfile } from "@/services/user.service";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
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

// Real API calls are now used; mock data removed.

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      // Fetch user profile using the token
      (async () => {
        try {
          const profile = await getProfile();
          const user: User = {
            id: String(profile.id),
            name: profile.fullName,
            email: profile.email,
            role: profile.role as User['role'],
          };
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } catch (e) {
          // If fetching profile fails, clear token
          Cookies.remove('access_token');
        }
      })();
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });
    try {
      const authResp = await loginService({ email, password });
      // Store access token in cookie
      Cookies.set('access_token', authResp.accessToken, { sameSite: 'lax', path: '/' });
      // Build User object from response
      const user: User = {
        id: String(authResp.userId),
        name: authResp.fullName,
        email: authResp.email,
        role: authResp.role as User['role'],
      };
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại.";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    Cookies.remove('access_token');
    logoutService();
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
