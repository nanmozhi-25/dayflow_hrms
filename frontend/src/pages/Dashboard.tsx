import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDays,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle,
  Briefcase,
  ClipboardCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const employeeHoursData = [
  { day: 'Mon', Hours: 8.2 },
  { day: 'Tue', Hours: 8.5 },
  { day: 'Wed', Hours: 9.0 },
  { day: 'Thu', Hours: 8.0 },
  { day: 'Fri', Hours: 7.8 },
];

export const Dashboard = () => {
  const { employee } = useAuth();
  
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

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* Welcome Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xs border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Employee Portal</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {employee?.first_name} {employee?.last_name}!
          </h2>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            Welcome to your team portal. You are scheduled for work today at {employee?.department}.
          </p>
        </div>
      </div>

      {/* EMPLOYEE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="premium-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Daily Attendance</p>
              <h3 className={`text-base font-bold mt-1 ${isCheckedIn ? 'text-teal-600' : 'text-slate-500'}`}>
                {isCheckedIn ? `Checked In: ${checkInTime}` : 'Checked Out'}
              </h3>
            </div>
            <div className={`p-2.5 rounded-xl ${isCheckedIn ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
              <Clock className="h-5.5 w-5.5" />
            </div>
          </div>
          <button
            onClick={handleCheckInToggle}
            className={`w-full py-2 text-[11px] font-bold rounded-lg shadow-xs hover:shadow-md cursor-pointer transition-colors text-white ${
              isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-500'
            }`}
          >
            {isCheckedIn ? 'Check Out' : 'Check In Now'}
          </button>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Leave Balance</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">18 Days</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarDays className="h-5.5 w-5.5" />
            </div>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold block mt-4">3 applied this year</span>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">August Compensation</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">$6,200</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-5.5 w-5.5" />
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-4">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Paid on Aug 21, 2026</span>
          </span>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Department Details</p>
              <h3 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[140px]">{employee?.department}</h3>
            </div>
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
              <Briefcase className="h-5.5 w-5.5" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-4 truncate">{employee?.designation}</span>
        </div>
      </div>

      {/* GRAPH & DETAILED PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Work Logs Chart */}
        <div className="lg:col-span-2 premium-card p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Weekly Work Logs</h3>
            <p className="text-[10px] text-slate-400">Calculated productive hours per workday</p>
          </div>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={employeeHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Hours" stroke="#0f766e" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI INSIGHTS CARD */}
        <div className="premium-card p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">AI Workday Insight</h3>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Autogenerated observations from employee work habits and scheduling alignments.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5 mt-2">
              <span className="text-[9px] bg-teal-500/10 text-teal-700 px-2 py-0.5 rounded border border-teal-500/20 font-bold uppercase tracking-wider">
                Work Pattern
              </span>
              <p className="text-xs font-bold text-slate-950">Overtime hours aligned</p>
              <p className="text-[10px] text-slate-500 leading-normal">
                Your check-in log shows highly stable hour distributions this week. Maintaining this rate supports peak performance.
              </p>
            </div>
          </div>

          <button className="w-full text-center text-[10px] font-bold text-teal-600 hover:text-teal-700 pt-2 border-t border-slate-100 hover:underline cursor-pointer">
            Explore All Insights
          </button>
        </div>
      </div>

      {/* Personal Timesheet Table */}
      <div className="premium-card p-5">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-teal-600" />
          <span>Personal Timesheet Log</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Check In</th>
                <th className="py-2 px-2">Check Out</th>
                <th className="py-2 px-2">Location</th>
                <th className="py-2 px-2">Total Hours</th>
                <th className="py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
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
        </div>
      </div>
    </div>
  );
};
