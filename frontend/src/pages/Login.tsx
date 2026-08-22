import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { Compass, Sparkles, Building2 } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login as employee by default for normal form submit
    login('employee');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* LEFT PANEL: HERO & BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 premium-gradient relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 bg-teal-400 text-slate-950 rounded-lg flex items-center justify-center font-extrabold text-2xl tracking-tighter shadow-md">
            DF
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-teal-400">DAYFLOW</h1>
            <p className="text-[10px] text-slate-300 font-semibold tracking-wider -mt-1 uppercase">HR Management</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="my-auto space-y-8 relative z-10 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Every workday, <br />
            <span className="text-teal-400">perfectly aligned.</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Align your team's scheduling, attendance, leave approvals, payroll statements, and AI-driven workplace analytics under a single, unified HR experience.
          </p>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <Compass className="h-5 w-5 text-teal-400" />
              <div>
                <p className="text-xs font-bold">Attendance Flow</p>
                <p className="text-[10px] text-slate-400">Realtime check-in logs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <div>
                <p className="text-xs font-bold">Smart Insights</p>
                <p className="text-[10px] text-slate-400">AI-powered optimization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 relative z-10 flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span>Dayflow SaaS © 2026. All rights reserved.</span>
        </div>
      </div>

      {/* RIGHT PANEL: LOGIN CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-center space-y-2">
            {/* Logo for mobile */}
            <div className="flex lg:hidden justify-center items-center gap-2.5 mb-6">
              <div className="h-9 w-9 bg-teal-500 text-slate-950 rounded-lg flex items-center justify-center font-extrabold text-xl">
                DF
              </div>
              <span className="font-extrabold text-xl tracking-wider text-slate-900">DAYFLOW</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-xs text-slate-500">Sign in to your workplace account dashboard</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 block">Password</label>
                <a href="#forgot" className="text-xs text-teal-600 font-bold hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 border-slate-300 rounded-md focus:ring-teal-500"
              />
              <label htmlFor="remember_me" className="ml-2 text-xs text-slate-600 font-medium">
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs hover:shadow-md cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* DEMO ACCOUNTS ACCORDION */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <p className="text-xs font-bold text-slate-500 text-center uppercase tracking-wider">Demo / Sandbox Roles</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col items-center justify-center p-3 border border-indigo-100 hover:border-indigo-300 bg-indigo-50/30 rounded-xl transition-all hover:bg-indigo-50/60 text-left group cursor-pointer"
              >
                <span className="text-xs font-bold text-indigo-950">HR Admin</span>
                <span className="text-[9px] text-slate-500 mt-0.5">Manager view</span>
              </button>

              <button
                onClick={() => handleDemoLogin('employee')}
                className="flex flex-col items-center justify-center p-3 border border-teal-100 hover:border-teal-300 bg-teal-50/30 rounded-xl transition-all hover:bg-teal-50/60 text-left group cursor-pointer"
              >
                <span className="text-xs font-bold text-teal-950">Employee</span>
                <span className="text-[9px] text-slate-500 mt-0.5">Standard workspace</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center italic">
              *Choose a demo role above to test the layouts and modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
