import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  Clock,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// Mock charts data
const adminAttendanceData = [
  { name: 'Engineering', Present: 54, Late: 3, Absent: 1 },
  { name: 'Product', Present: 18, Late: 1, Absent: 0 },
  { name: 'Sales', Present: 32, Late: 4, Absent: 2 },
  { name: 'HR/Ops', Present: 12, Late: 0, Absent: 1 },
  { name: 'Finance', Present: 8, Late: 1, Absent: 0 },
];

const employeeHoursData = [
  { day: 'Mon', Hours: 8.2 },
  { day: 'Tue', Hours: 8.5 },
  { day: 'Wed', Hours: 9.0 },
  { day: 'Thu', Hours: 8.0 },
  { day: 'Fri', Hours: 7.8 },
];

export const Dashboard: React.FC = () => {
  const { user, employee } = useAuth();
  
  // Interactive check-in simulator state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckInToggle = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Welcome Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xs border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Workspace Dashboard</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {employee?.first_name} {employee?.last_name}!
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isAdmin 
              ? 'Your HR operations are running smoothly. Today you have 8 pending leave requests and 2 new automated workplace insights.'
              : `Welcome to your team portal. You are scheduled for work today at ${employee?.department}.`}
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      {isAdmin ? (
        // ADMIN STATS GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">142</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-teal-600">
              <TrendingUp className="h-4 w-4" />
              <span>+4 hired this month</span>
            </div>
          </div>

          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today Attendance</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">94.2%</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CalendarCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-slate-500">
              <span>124 present</span>
              <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
              <span>4 late</span>
            </div>
          </div>

          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Leaves</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">8</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <CalendarDays className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-amber-600">
              <span>3 urgent requests</span>
            </div>
          </div>

          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Payroll</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">$78.2k</h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-slate-500">
              <span>Pay Date: Aug 28, 2026</span>
            </div>
          </div>
        </div>
      ) : (
        // EMPLOYEE STATS GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="premium-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Attendance</p>
                <h3 className={`text-xl font-bold mt-1 ${isCheckedIn ? 'text-teal-600' : 'text-slate-500'}`}>
                  {isCheckedIn ? `Checked In: ${checkInTime}` : 'Checked Out'}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${isCheckedIn ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <button
              onClick={handleCheckInToggle}
              className={`w-full py-2 text-xs font-semibold rounded-lg shadow-xs hover:shadow-md cursor-pointer transition-colors ${
                isCheckedIn ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              {isCheckedIn ? 'Check Out' : 'Check In Now'}
            </button>
          </div>

          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Balance</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">18 Days</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <CalendarDays className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-indigo-600">
              <span>3 applied this year</span>
            </div>
          </div>

          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">August Compensation</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">$6,200</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-600">
              <CheckCircle className="h-4 w-4" />
              <span>Paid on Aug 21, 2026</span>
            </div>
          </div>

          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department Details</p>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{employee?.department}</h3>
              </div>
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-slate-500">
              <span>{employee?.designation}</span>
            </div>
          </div>
        </div>
      )}

      {/* GRAPH & DETAILED PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Analytics Chart */}
        <div className="lg:col-span-2 premium-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isAdmin ? 'Attendance Breakdown' : 'Weekly Work Logs'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAdmin ? 'Realtime presentation rates across company departments' : 'Calculated productive hours per workday'}
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-[280px]">
            {isAdmin ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={adminAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Present" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={employeeHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Hours" stroke="#0f766e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* SIDE BAR CARD: AI INSIGHTS / REALTIME STATUS */}
        <div className="premium-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold text-base text-slate-900">AI Workplace Insights</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Autogenerated observations from employee work habits, scheduling alignments, and timesheet records.
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[10px] bg-teal-500/10 text-teal-700 px-2 py-0.5 rounded-sm border border-teal-500/20 font-bold uppercase tracking-wider">
                  Attendance Flow
                </span>
                <p className="text-xs font-bold text-slate-950">Overtime hours aligned</p>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Engineering department hours are 12% above average. Ensure balance in resource distribution.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-sm border border-amber-500/20 font-bold uppercase tracking-wider">
                  Leave Balance
                </span>
                <p className="text-xs font-bold text-slate-950">Approvals overload risk</p>
                <p className="text-[11px] text-slate-500 leading-normal">
                  6 employees have leave requests scheduled for the first week of September.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full text-center text-xs font-semibold text-teal-600 hover:text-teal-700 pt-2 border-t border-slate-100 hover:underline cursor-pointer">
            Explore All Insights
          </button>
        </div>
      </div>

      {/* TABLE / WORKFLOW LISTS */}
      <div className="premium-card p-6">
        <h3 className="font-bold text-base text-slate-900 mb-4">
          {isAdmin ? 'Recent Leave Applications' : 'Personal Timesheet Log'}
        </h3>
        <div className="overflow-x-auto">
          {isAdmin ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-2">Employee</th>
                  <th className="py-3 px-2">Leave Type</th>
                  <th className="py-3 px-2">Duration</th>
                  <th className="py-3 px-2">Reason</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                <tr>
                  <td className="py-3.5 px-2 font-semibold text-slate-950">Daniel Carter</td>
                  <td className="py-3.5 px-2">Medical Leave</td>
                  <td className="py-3.5 px-2">Aug 24 - Aug 26 (3 Days)</td>
                  <td className="py-3.5 px-2 truncate max-w-xs">Dental extraction scheduled</td>
                  <td className="py-3.5 px-2">
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200/50 font-bold uppercase tracking-wider text-[9px]">
                      Pending
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right space-x-2">
                    <button className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer">Approve</button>
                    <button className="text-red-500 hover:text-red-600 font-bold hover:underline cursor-pointer">Reject</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-semibold text-slate-950">Emily Watson</td>
                  <td className="py-3.5 px-2">Casual Leave</td>
                  <td className="py-3.5 px-2">Sep 01 - Sep 03 (3 Days)</td>
                  <td className="py-3.5 px-2 truncate max-w-xs">Family event travel</td>
                  <td className="py-3.5 px-2">
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200/50 font-bold uppercase tracking-wider text-[9px]">
                      Pending
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right space-x-2">
                    <button className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer">Approve</button>
                    <button className="text-red-500 hover:text-red-600 font-bold hover:underline cursor-pointer">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Check In</th>
                  <th className="py-3 px-2">Check Out</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Total Hours</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                <tr>
                  <td className="py-3.5 px-2 font-semibold text-slate-950">Aug 21, 2026</td>
                  <td className="py-3.5 px-2">08:58 AM</td>
                  <td className="py-3.5 px-2">05:04 PM</td>
                  <td className="py-3.5 px-2 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>Office</span>
                  </td>
                  <td className="py-3.5 px-2">8.1 Hours</td>
                  <td className="py-3.5 px-2">
                    <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200/50 font-bold uppercase tracking-wider text-[9px]">
                      Present
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-semibold text-slate-950">Aug 20, 2026</td>
                  <td className="py-3.5 px-2">09:02 AM</td>
                  <td className="py-3.5 px-2">05:30 PM</td>
                  <td className="py-3.5 px-2 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>Remote</span>
                  </td>
                  <td className="py-3.5 px-2">8.5 Hours</td>
                  <td className="py-3.5 px-2">
                    <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200/50 font-bold uppercase tracking-wider text-[9px]">
                      Present
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
