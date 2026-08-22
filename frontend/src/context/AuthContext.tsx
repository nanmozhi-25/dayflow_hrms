import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Employee, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockAdminUser: User = {
  id: 1,
  email: 'admin@dayflow.com',
  role: 'admin',
  is_active: true,
  created_at: new Date().toISOString()
};

const mockAdminEmployee: Employee = {
  id: 1,
  user_id: 1,
  employee_id: 'ADM001',
  first_name: 'Sarah',
  last_name: 'Jenkins',
  department: 'People Operations',
  designation: 'HR Director',
  phone: '+1 (555) 019-2834',
  join_date: '2024-01-15',
  status: 'active',
  created_at: new Date().toISOString()
};

const mockEmployeeUser: User = {
  id: 2,
  email: 'employee@dayflow.com',
  role: 'employee',
  is_active: true,
  created_at: new Date().toISOString()
};

const mockEmployeeProfile: Employee = {
  id: 2,
  user_id: 2,
  employee_id: 'EMP042',
  first_name: 'Alex',
  last_name: 'Rivera',
  department: 'Product Engineering',
  designation: 'Senior Frontend Developer',
  phone: '+1 (555) 014-9988',
  join_date: '2024-06-01',
  status: 'active',
  created_at: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);

  // Auto-restore login status if it exists in local storage
  useEffect(() => {
    const savedRole = localStorage.getItem('dayflow_role') as UserRole | null;
    if (savedRole) {
      handleLogin(savedRole);
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    if (role === 'admin') {
      setUser(mockAdminUser);
      setEmployee(mockAdminEmployee);
      localStorage.setItem('dayflow_role', 'admin');
    } else {
      setUser(mockEmployeeUser);
      setEmployee(mockEmployeeProfile);
      localStorage.setItem('dayflow_role', 'employee');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmployee(null);
    localStorage.removeItem('dayflow_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!user
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
