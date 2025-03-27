import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState, LoginData, RegisterData } from '../types/auth';
import { login, register } from '../services/authService';
import { clearStorage, getToken, getUser, saveToken, saveUser } from '../utils/localStorage';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: getUser(),
    token: getToken(),
    isAuthenticated: !!getToken(),
    isLoading: false,
    error: null,
  });

  // Redirect to login on authentication failure
  const handleAuthFailure = (errorMessage?: string) => {
    clearStorage();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: errorMessage || 'Session expired. Please login again.',
    });
    navigate('/login');
  };

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
          handleAuthFailure();
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
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
        handleAuthFailure(error.response?.data?.message);
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error.response?.data?.message || 'Failed to login. Please try again.',
        }));
      }
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
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
        handleAuthFailure(error.response?.data?.message);
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error.response?.data?.message || 'Failed to register. Please try again.',
        }));
      }
    }
  };

  // Logout handler
  const handleLogout = () => {
    handleAuthFailure('Logged out successfully');
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