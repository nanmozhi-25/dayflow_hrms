import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Employees } from '../pages/Employees';
import { Profile } from '../pages/Profile';
import { Attendance } from '../pages/Attendance';
import { AdminAttendance } from '../pages/AdminAttendance';
import { Leave } from '../pages/Leave';
import { AdminLeaves } from '../pages/AdminLeaves';
import { Payroll } from '../pages/Payroll';
import { AdminPayroll } from '../pages/AdminPayroll';
import { Insights } from '../pages/Insights';
import { AdminAnalytics } from '../pages/AdminAnalytics';
import { AIAssistant } from '../pages/AIAssistant';
import { Notifications } from '../pages/Notifications';
import { Settings } from '../pages/Settings';

// Helper component to redirect if not logged in
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing / Login */}
      <Route path="/" element={<Login />} />

      {/* Portal Layout Wrapper */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Profile and Personal Pages */}
        <Route path="profile" element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="insights" element={<Insights />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />

        {/* Admin / HR Console Pages */}
        <Route path="admin/employees" element={<Employees />} />
        <Route path="admin/attendance" element={<AdminAttendance />} />
        <Route path="admin/leaves" element={<AdminLeaves />} />
        <Route path="admin/payroll" element={<AdminPayroll />} />
        <Route path="admin/analytics" element={<AdminAnalytics />} />
        <Route path="admin/ai-assistant" element={<AIAssistant />} />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
