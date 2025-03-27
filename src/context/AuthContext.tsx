import { createContext } from 'react';
import { AuthState, LoginData, RegisterData } from '../types/auth';

// Default state
const defaultState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Context type definition
export const AuthContext = createContext<{
  authState: AuthState;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}>({
  authState: defaultState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});