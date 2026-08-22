import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, Building2, Eye, EyeOff, Bot, Lock, Mail, Info } from 'lucide-react';
import { z } from 'zod';

// Form validation schemas via Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['employee', 'admin']),
  employee_id: z.string().min(3, { message: 'Employee ID must be at least 3 characters.' }),
  first_name: z.string().min(1, { message: 'First name is required.' }),
  last_name: z.string().min(1, { message: 'Last name is required.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  designation: z.string().min(1, { message: 'Designation is required.' }),
  phone: z.string().optional(),
  join_date: z.string().min(1, { message: 'Join date is required.' }),
});

export const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Tabs: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up inputs
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'employee' | 'admin'>('employee');
  const [regEmpId, setRegEmpId] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regDept, setRegDept] = useState('Product Engineering');
  const [regDesig, setRegDesig] = useState('Software Engineer');
  const [regPhone, setRegPhone] = useState('');
  const [regJoinDate, setRegJoinDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setValidationErrors({});

    const parseResult = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!parseResult.success) {
      const errs: Record<string, string> = {};
      parseResult.error.issues.forEach((err: any) => {
        if (err.path[0]) errs[err.path[0].toString()] = err.message;
      });
      setValidationErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      const role = localStorage.getItem('dayflow_role');
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setValidationErrors({});

    const payload = {
      email: regEmail,
      password: regPassword,
      role: regRole,
      employee_id: regEmpId,
      first_name: regFirstName,
      last_name: regLastName,
      department: regDept,
      designation: regDesig,
      phone: regPhone || undefined,
      join_date: regJoinDate,
    };

    const parseResult = signupSchema.safeParse(payload);
    if (!parseResult.success) {
      const errs: Record<string, string> = {};
      parseResult.error.issues.forEach((err: any) => {
        if (err.path[0]) errs[err.path[0].toString()] = err.message;
      });
      setValidationErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      await signup(payload);
      navigate(regRole === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Check details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sandbox demo helpers that auto-signup and log in sandbox credentials
  const handleSandboxDemo = async (role: 'employee' | 'admin') => {
    setErrorMsg(null);
    setIsLoading(true);
    
    const email = role === 'admin' ? 'admin@dayflow.com' : 'employee@dayflow.com';
    const password = 'password123';

    try {
      // 1. Attempt login
      await login(email, password);
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      // 2. If user not found, signup automatically
      console.log('Sandbox account not found. Bootstrapping sandbox credentials...');
      try {
        const payload = role === 'admin' ? {
          email,
          password,
          role: 'admin',
          employee_id: 'ADM001',
          first_name: 'Sarah',
          last_name: 'Jenkins',
          department: 'People Operations',
          designation: 'HR Director',
          phone: '+1 (555) 019-2834',
          join_date: '2024-01-15'
        } : {
          email,
          password,
          role: 'employee',
          employee_id: 'EMP042',
          first_name: 'Alex',
          last_name: 'Rivera',
          department: 'Product Engineering',
          designation: 'Senior Frontend Developer',
          phone: '+1 (555) 014-9988',
          join_date: '2024-06-01'
        };
        await signup(payload);
        navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
      } catch (signupErr: any) {
        setErrorMsg('Failed to bootstrap sandbox account: ' + (signupErr.message || 'Unknown error.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* LEFT PANEL: HERO BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 premium-gradient relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        
        {/* Brand logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 bg-teal-400 text-slate-950 rounded-lg flex items-center justify-center font-extrabold text-2xl tracking-tighter shadow-md">
            DF
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-teal-400">DAYFLOW</h1>
            <p className="text-[10px] text-slate-300 font-semibold tracking-wider -mt-1 uppercase">HR Management</p>
          </div>
        </div>

        {/* Hero details */}
        <div className="my-auto space-y-8 relative z-10 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Every workday, <br />
            <span className="text-teal-400">perfectly aligned.</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Dayflow aligns your team's scheduling, attendance, leave approvals, payroll statements, and AI-driven workplace analytics under a single, unified HR experience.
          </p>

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

        <div className="text-xs text-slate-400 relative z-10 flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span>Dayflow SaaS © 2026. All rights reserved.</span>
        </div>
      </div>

      {/* RIGHT PANEL: FORMS CONSOLE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-slate-100/80">
          
          {/* Logo for mobile */}
          <div className="flex lg:hidden justify-center items-center gap-2.5 mb-4">
            <div className="h-9 w-9 bg-teal-500 text-slate-950 rounded-lg flex items-center justify-center font-extrabold text-xl">
              DF
            </div>
            <span className="font-extrabold text-xl tracking-wider text-slate-900">DAYFLOW</span>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-slate-100 text-xs">
            <button
              onClick={() => { setActiveTab('signin'); setErrorMsg(null); setValidationErrors({}); }}
              className={`flex-1 pb-3 font-bold border-b-2 text-center transition-colors cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-teal-600 text-teal-600 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(null); setValidationErrors({}); }}
              className={`flex-1 pb-3 font-bold border-b-2 text-center transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'border-teal-600 text-teal-600 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex gap-2 items-start font-medium">
              <Info className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs"
                  />
                </div>
                {validationErrors.email && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 block">Password</label>
                  <a href="#forgot" className="text-[10px] text-teal-600 font-bold hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : 'Sign In'}
              </button>
            </form>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">First Name</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={e => setRegFirstName(e.target.value)}
                    placeholder="Sarah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  {validationErrors.first_name && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.first_name}</p>}
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Last Name</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={e => setRegLastName(e.target.value)}
                    placeholder="Jenkins"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  {validationErrors.last_name && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.last_name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={regEmpId}
                    onChange={e => setRegEmpId(e.target.value)}
                    placeholder="EMP001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  {validationErrors.employee_id && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.employee_id}</p>}
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Role</label>
                  <select
                    value={regRole}
                    onChange={e => setRegRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin / HR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Department</label>
                  <select
                    value={regDept}
                    onChange={e => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option>Product Engineering</option>
                    <option>People Operations</option>
                    <option>Sales & Marketing</option>
                    <option>Finance</option>
                  </select>
                  {validationErrors.department && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.department}</p>}
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Designation</label>
                  <input
                    type="text"
                    required
                    value={regDesig}
                    onChange={e => setRegDesig(e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  {validationErrors.designation && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.designation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Phone Number</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Join Date</label>
                  <input
                    type="date"
                    required
                    value={regJoinDate}
                    onChange={e => setRegJoinDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  {validationErrors.join_date && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.join_date}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                {validationErrors.email && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                {validationErrors.password && <p className="text-[10px] text-red-500 font-semibold">{validationErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-500 transition-colors shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : 'Sign Up Account'}
              </button>
            </form>
          )}

          {/* SANDBOX / SIMULATION ROLES */}
          <div className="pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <Bot className="h-4.5 w-4.5 text-teal-600" />
              <span>Sandbox Demo Accounts</span>
            </div>
            <p className="text-[10px] text-slate-400 text-center -mt-1 leading-normal">
              Click below to auto-register and sign in with sandbox databases.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSandboxDemo('admin')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-3 border border-indigo-100 hover:border-indigo-300 bg-indigo-50/20 hover:bg-indigo-50/60 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="text-xs font-bold text-indigo-950">Demo HR Admin</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Manager view</span>
              </button>
              <button
                onClick={() => handleSandboxDemo('employee')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-3 border border-teal-100 hover:border-teal-300 bg-teal-50/20 hover:bg-teal-50/60 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="text-xs font-bold text-teal-950">Demo Employee</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Staff portal</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
