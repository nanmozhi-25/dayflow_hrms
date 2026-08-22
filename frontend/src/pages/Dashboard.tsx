import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CalendarDays,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle,
  Briefcase,
  ClipboardCheck,
  RefreshCw,
  AlertTriangle
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

interface AttendanceLog {
  id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number | null;
  status: string;
  location: string;
}

export const Dashboard = () => {
  const { employee } = useAuth();
  
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.get('/attendance/me');
      setLogs(response.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to load dashboard logs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Determine current day punch state
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = logs.find(l => l.date === todayStr);
  const isCheckedIn = todayRecord && todayRecord.check_in !== null;
  const isCheckedOut = todayRecord && todayRecord.check_out !== null;

  const handlePunchToggle = async () => {
    setActionLoading(true);
    setErrorMsg(null);
    try {
      if (!isCheckedIn) {
        // Clock In
        await api.post('/attendance/check-in?location=Office');
      } else {
        // Clock Out
        await api.post('/attendance/check-out');
      }
      await fetchLogs();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Punch action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Convert chart logs to map hours for plotting (last 5 entries)
  const chartData = logs.slice(0, 5).reverse().map(l => ({
    day: new Date(l.date).toLocaleDateString(undefined, { weekday: 'short' }),
    Hours: l.working_hours || 0
  }));

  // Calculations
  const presentDays = logs.filter(l => l.status === 'Present' || l.status === 'Late').length;
  const totalDays = logs.length;
  const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '100';

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Safe compensation string
  const compValue = employee?.net_salary !== undefined && employee?.net_salary !== null
    ? employee.net_salary.toLocaleString(undefined, { minimumFractionDigits: 2 })
    : '0.00';

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
            Hello, {employee?.first_name || 'Team'} {employee?.last_name || 'Member'}!
          </h2>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            Welcome to your team portal. You are scheduled for work today at {employee?.department || 'Operations'}.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* EMPLOYEE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="premium-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Daily Attendance</p>
              <h3 className={`text-base font-bold mt-1 ${isCheckedIn && !isCheckedOut ? 'text-teal-600' : 'text-slate-500'}`}>
                {isCheckedOut ? 'Checked Out Today' : isCheckedIn ? `Active: ${formatTime(todayRecord?.check_in || '')}` : 'Checked Out'}
              </h3>
            </div>
            <div className={`p-2.5 rounded-xl ${isCheckedIn && !isCheckedOut ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
              <Clock className="h-5.5 w-5.5" />
            </div>
          </div>
          <button
            onClick={handlePunchToggle}
            disabled={actionLoading || isCheckedOut}
            className={`w-full py-2 text-[11px] font-bold rounded-lg shadow-xs hover:shadow-md cursor-pointer transition-colors text-white flex items-center justify-center gap-1.5 ${
              isCheckedOut ? 'bg-slate-100 text-slate-400 shadow-none cursor-default' :
              isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-500'
            }`}
          >
            {actionLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            <span>{isCheckedOut ? 'Completed Daily Shift' : isCheckedIn ? 'Clock Out Now' : 'Clock In Now'}</span>
          </button>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{attendanceRate}%</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarDays className="h-5.5 w-5.5" />
            </div>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold block mt-4">{logs.length} logged working days</span>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Salary Contract</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">${compValue}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-5.5 w-5.5" />
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-4">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Monthly net compensation</span>
          </span>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Department Details</p>
              <h3 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[140px]">{employee?.department || 'Unassigned'}</h3>
            </div>
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
              <Briefcase className="h-5.5 w-5.5" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-4 truncate">{employee?.designation || 'Staff'}</span>
        </div>
      </div>

      {/* GRAPH & DETAILED PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Work Logs Chart */}
        <div className="lg:col-span-2 premium-card p-5 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Weekly Work Logs</h3>
              <p className="text-[10px] text-slate-400">Calculated productive hours per workday (Recent 5 shifts)</p>
            </div>
            <button
              onClick={fetchLogs}
              className="p-1 text-slate-400 hover:text-slate-955 hover:bg-slate-100 rounded cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 min-h-[220px]">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-[10px]">
                No check-in logs recorded to graph yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
            )}
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
              <p className="text-xs font-bold text-slate-955">Overtime hours aligned</p>
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="h-6 w-6 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            No punch logs logged yet.
          </div>
        ) : (
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
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="py-3.5 px-2 font-semibold text-slate-955">{formatDate(log.date)}</td>
                    <td className="py-3.5 px-2">{formatTime(log.check_in)}</td>
                    <td className="py-3.5 px-2">{formatTime(log.check_out)}</td>
                    <td className="py-3.5 px-2 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{log.location}</span>
                    </td>
                    <td className="py-3.5 px-2">{log.working_hours ? `${log.working_hours} hours` : '--'}</td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider text-[9px] ${
                        log.status === 'Present' ? 'bg-teal-50 text-teal-700 border-teal-200/50' :
                        log.status === 'Half-day' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/50' :
                        log.status === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
                        'bg-red-50 text-red-700 border-red-200/50'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
