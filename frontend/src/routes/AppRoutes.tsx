import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
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

// Loading spinner screen for restoring sessions
const FullPageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3 text-slate-500 font-sans">
      <div className="h-10 w-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
      <p className="text-xs font-semibold uppercase tracking-wider animate-pulse">Synchronizing Session...</p>
    </div>
  </div>
);

// Protected Wrapper for checking authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoading />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Role Access Control Guard
const RoleGuard: React.FC<{ children: React.ReactNode; roles: string[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(user.role)) {
    // If unauthorized, redirect to their proper dashboard landing page
    return user.role === 'admin' 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <Routes>
      {/* Public Landing / Login Page */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            user?.role === 'admin' 
              ? <Navigate to="/admin/dashboard" replace /> 
              : <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        } 
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Employee Only Routes */}
        <Route
          path="dashboard"
          element={
            <RoleGuard roles={['employee']}>
              <Dashboard />
            </RoleGuard>
          }
        />
        <Route
          path="profile"
          element={
            <RoleGuard roles={['employee', 'admin']}>
              <Profile />
            </RoleGuard>
          }
        />
        <Route
          path="attendance"
          element={
            <RoleGuard roles={['employee']}>
              <Attendance />
            </RoleGuard>
          }
        />
        <Route
          path="leave"
          element={
            <RoleGuard roles={['employee']}>
              <Leave />
            </RoleGuard>
          }
        />
        <Route
          path="payroll"
          element={
            <RoleGuard roles={['employee']}>
              <Payroll />
            </RoleGuard>
          }
        />
        <Route
          path="insights"
          element={
            <RoleGuard roles={['employee']}>
              <Insights />
            </RoleGuard>
          }
        />
        <Route
          path="notifications"
          element={
            <RoleGuard roles={['employee', 'admin']}>
              <Notifications />
            </RoleGuard>
          }
        />
        <Route
          path="settings"
          element={
            <RoleGuard roles={['employee', 'admin']}>
              <Settings />
            </RoleGuard>
          }
        />

        {/* Admin/HR Only Routes */}
        <Route
          path="admin/dashboard"
          element={
            <RoleGuard roles={['admin']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="admin/employees"
          element={
            <RoleGuard roles={['admin']}>
              <Employees />
            </RoleGuard>
          }
        />
        <Route
          path="admin/attendance"
          element={
            <RoleGuard roles={['admin']}>
              <AdminAttendance />
            </RoleGuard>
          }
        />
        <Route
          path="admin/leaves"
          element={
            <RoleGuard roles={['admin']}>
              <AdminLeaves />
            </RoleGuard>
          }
        />
        <Route
          path="admin/payroll"
          element={
            <RoleGuard roles={['admin']}>
              <AdminPayroll />
            </RoleGuard>
          }
        />
        <Route
          path="admin/analytics"
          element={
            <RoleGuard roles={['admin']}>
              <AdminAnalytics />
            </RoleGuard>
          }
        />
        <Route
          path="admin/ai-assistant"
          element={
            <RoleGuard roles={['admin']}>
              <AIAssistant />
            </RoleGuard>
          }
        />
      </Route>

      {/* Redirect all unmatched paths to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
