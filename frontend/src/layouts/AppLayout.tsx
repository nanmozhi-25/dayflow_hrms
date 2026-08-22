import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  User,
  CalendarCheck,
  CalendarRange,
  CircleDollarSign,
  BrainCircuit,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MessageSquare
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  adminOnly?: boolean;
}

export const AppLayout: React.FC = () => {
  const { user, employee, logout, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users, adminOnly: true },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Attendance Mgmt', path: '/admin/attendance', icon: CalendarCheck, adminOnly: true },
    { name: 'Leave & Time-Off', path: '/leave', icon: CalendarRange },
    { name: 'Leave Approvals', path: '/admin/leaves', icon: CalendarRange, adminOnly: true },
    { name: 'Payroll', path: '/payroll', icon: CircleDollarSign },
    { name: 'Payroll Mgmt', path: '/admin/payroll', icon: CircleDollarSign, adminOnly: true },
    { name: 'AI Insights', path: '/insights', icon: BrainCircuit },
    { name: 'HR Analytics', path: '/admin/analytics', icon: BarChart3, adminOnly: true },
    { name: 'AI HR Assistant', path: '/admin/ai-assistant', icon: MessageSquare, adminOnly: true },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleToggle = () => {
    const nextRole = user?.role === 'admin' ? 'employee' : 'admin';
    login(nextRole);
  };

  // Filter items based on user role
  const visibleItems = sidebarItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* MOBILE SIDEBAR MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-xs">
          <div className="relative flex flex-col w-72 max-w-xs bg-slate-900 text-white animate-fade-in-left">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white focus:outline-hidden"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-teal-500 text-slate-900 font-extrabold text-xl tracking-tight">DF</div>
              <div>
                <span className="font-extrabold text-lg tracking-wider block text-teal-400">DAYFLOW</span>
                <span className="text-[10px] text-slate-400 block font-medium -mt-1">Perfectly Aligned</span>
              </div>
            </div>
            {/* Mobile Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {visibleItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            {/* Mobile Footer */}
            <div className="p-4 border-t border-slate-800 space-y-2">
              {/* Role Toggle */}
              <button
                onClick={handleRoleToggle}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white"
              >
                <span>Role: <strong className="text-teal-400 uppercase">{user?.role}</strong></span>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20">Swap</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div
        className={`hidden md:flex flex-col bg-slate-900 text-white transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } flex-shrink-0 border-r border-slate-800 relative`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-16 bg-teal-600 text-white rounded-full p-1 border-2 border-slate-900 shadow-md hover:bg-teal-500 focus:outline-hidden z-20"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Sidebar Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-800/80 overflow-hidden">
          <div className="p-2 rounded-lg bg-teal-500 text-slate-950 font-extrabold text-xl tracking-tight flex-shrink-0">
            DF
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in">
              <span className="font-extrabold text-lg tracking-wider block text-teal-400 leading-none">DAYFLOW</span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest mt-1 block">HRMS</span>
            </div>
          )}
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {visibleItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-950 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-md border border-slate-800">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {!sidebarCollapsed && (
            <>
              {/* Role Toggle Badge */}
              <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Active Role</span>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded border border-teal-500/20 font-bold uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleRoleToggle}
                  className="w-full text-center text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white py-1 rounded transition-colors"
                >
                  Switch View
                </button>
              </div>
              {/* Profile Card */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400">
                  {employee?.first_name[0]}{employee?.last_name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate leading-none mb-0.5">
                    {employee?.first_name} {employee?.last_name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{employee?.designation}</p>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors ${
              sidebarCollapsed ? 'px-1' : ''
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 -ml-1 text-slate-500 hover:text-slate-900 focus:outline-hidden md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {sidebarItems.find(item => item.path === location.pathname)?.name || 'Dayflow Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick role-switch badge on navbar */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
              <span className="text-xs text-slate-500 font-medium">Viewing as:</span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                user?.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50' : 'bg-teal-50 text-teal-700 border border-teal-200/50'
              }`}>
                {user?.role}
              </span>
              <button
                onClick={handleRoleToggle}
                className="text-[10px] text-teal-600 hover:text-teal-700 font-bold ml-1.5 underline cursor-pointer"
              >
                Change Role
              </button>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 relative transition-colors cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-950">Recent Notifications</span>
                    <button className="text-[10px] text-teal-600 font-bold hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <p className="text-xs font-semibold text-slate-900">Leave Request Approved</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Your casual leave request for next Friday was approved by Sarah Jenkins.</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">1 hour ago</span>
                    </div>
                    <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <p className="text-xs font-semibold text-slate-900">August Payslip Released</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Your monthly salary statement has been compiled and is ready to view.</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">Yesterday</span>
                    </div>
                  </div>
                  <div className="px-4 pt-2 text-center">
                    <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs font-semibold text-teal-600 hover:underline">
                      See all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Indicator */}
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                {employee?.first_name[0]}{employee?.last_name[0]}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
                {employee?.first_name} {employee?.last_name}
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
