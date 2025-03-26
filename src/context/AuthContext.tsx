import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, LoginData, RegisterData } from '../types/auth';
import { login, register } from '../services/authService';
import { clearStorage, getToken, getUser, saveToken, saveUser } from '../utils/localStorage';

// Default state
const defaultState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create context
const AuthContext = createContext<{
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

// Context provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    ...defaultState,
    token: getToken(),
    user: getUser(),
    isAuthenticated: !!getToken(),
  });

  // Check if user is authenticated on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken();
      
      if (token) {
        try {
          const userData = getUser();
          setAuthState({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          clearStorage();
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please login again.',
          });
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    verifyAuth();
  }, []);

  // Login handler
  const handleLogin = async (data: LoginData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await login(data);
      const { token, user } = response;
      
      saveToken(token);
      saveUser(user);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to login. Please try again.',
      }));
    }
  };

  // Register handler
  const handleRegister = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await register(data);
      const { token, user } = response;
      
      saveToken(token);
      saveUser(user);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to register. Please try again.',
      }));
    }
  };

  // Logout handler
  const handleLogout = () => {
    clearStorage();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  // Clear error
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);