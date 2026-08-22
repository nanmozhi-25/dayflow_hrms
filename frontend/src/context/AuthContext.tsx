import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Employee } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load the current user session using the stored JWT token
  const loadCurrentUser = async () => {
    const token = localStorage.getItem('dayflow_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await api.get('/auth/me');
      const userData: User = response.data;
      setUser(userData);
      if (userData.employee) {
        setEmployee(userData.employee);
      }
      localStorage.setItem('dayflow_role', userData.role);
    } catch (err: any) {
      console.error('Failed to load user session:', err);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();

    // Listen to token expiration events from api interceptor
    const handleAuthExpired = () => {
      handleLogout();
    };
    window.addEventListener('dayflow_auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('dayflow_auth_expired', handleAuthExpired);
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('dayflow_token', access_token);
      localStorage.setItem('dayflow_role', userData.role);
      
      setUser(userData);
      if (userData.employee) {
        setEmployee(userData.employee);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Authentication failed. Please verify credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const handleSignup = async (payload: any) => {
    setError(null);
    try {
      await api.post('/auth/signup', payload);
      // Auto login after successful signup
      await handleLogin(payload.email, payload.password);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Sign up failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmployee(null);
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_role');
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        isAuthenticated: !!user,
        isLoading,
        error,
        reloadUser: loadCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
