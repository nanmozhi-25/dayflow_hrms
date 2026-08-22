import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Clock,
  MapPin,
  CalendarCheck,
  TrendingUp,
  Award,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Edit2,
  CalendarDays,
  X
} from 'lucide-react';

interface AttendanceLog {
  id: number;
  employee_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number | null;
  status: string;
  location: string;
  employee?: {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    department: string;
    designation: string;
  };
}

export const Attendance = () => {
  const { user, employee } = useAuth();
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'my' | 'admin'>('my');
  const isAdmin = user?.role === 'admin';

  // State for user logs
  const [myLogs, setMyLogs] = useState<AttendanceLog[]>([]);
  const [isMyLoading, setIsMyLoading] = useState(true);
  const [myError, setMyError] = useState<string | null>(null);

  // State for check-in action
  const [checkInLocation, setCheckInLocation] = useState<'Office' | 'Remote'>('Office');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // State for admin logs
  const [adminLogs, setAdminLogs] = useState<AttendanceLog[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  
  // Admin filters
  const [filterDate, setFilterDate] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [allEmployees, setAllEmployees] = useState<any[]>([]);

  // Correction Modal
  const [correctingLog, setCorrectingLog] = useState<AttendanceLog | null>(null);
  const [correctCheckIn, setCorrectCheckIn] = useState('');
  const [correctCheckOut, setCorrectCheckOut] = useState('');
  const [correctStatus, setCorrectStatus] = useState('Present');
  const [correctLocation, setCorrectLocation] = useState('Office');
  const [correctWorkingHours, setCorrectWorkingHours] = useState('');
  const [correctionSubmitting, setCorrectionSubmitting] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  // Fetch my logs
  const fetchMyLogs = useCallback(async () => {
    setIsMyLoading(true);
    setMyError(null);
    try {
      const response = await api.get('/attendance/me');
      setMyLogs(response.data);
    } catch (err: any) {
      setMyError(err.response?.data?.detail || 'Failed to load attendance logs.');
    } finally {
      setIsMyLoading(false);
    }
  }, []);

  // Fetch admin logs
  const fetchAdminLogs = useCallback(async () => {
    if (!isAdmin) return;
    setIsAdminLoading(true);
    setAdminError(null);
    try {
      const params: any = {};
      if (filterDate) params.date = filterDate;
      if (filterEmployeeId) params.employee_id = filterEmployeeId;
      if (filterDept) params.department = filterDept;

      const response = await api.get('/attendance/admin', { params });
      setAdminLogs(response.data);
    } catch (err: any) {
      setAdminError(err.response?.data?.detail || 'Failed to load organization attendance logs.');
    } finally {
      setIsAdminLoading(false);
    }
  }, [isAdmin, filterDate, filterEmployeeId, filterDept]);

  // Fetch list of employees for filters
  const fetchEmployeesList = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const response = await api.get('/employees/list');
      setAllEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employee list', err);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchMyLogs();
    if (isAdmin) {
      fetchAdminLogs();
      fetchEmployeesList();
    }
  }, [fetchMyLogs, fetchAdminLogs, fetchEmployeesList, isAdmin]);

  // Determine check-in status for today
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayRecord = myLogs.find(l => l.date === todayDateStr);

  const isCheckedIn = todayRecord && todayRecord.check_in !== null;
  const isCheckedOut = todayRecord && todayRecord.check_out !== null;

  // Clock Actions
  const handleCheckIn = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post(`/attendance/check-in?location=${checkInLocation}`);
      await fetchMyLogs();
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Check-in failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post('/attendance/check-out');
      await fetchMyLogs();
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Check-out failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Correction Submit
  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctingLog) return;
    
    setCorrectionSubmitting(true);
    setCorrectionError(null);

    try {
      const payload: any = {
        status: correctStatus,
        location: correctLocation
      };

      if (correctCheckIn) {
        // Convert to ISO string
        payload.check_in = new Date(correctCheckIn).toISOString();
      } else {
        payload.check_in = null;
      }

      if (correctCheckOut) {
        payload.check_out = new Date(correctCheckOut).toISOString();
      } else {
        payload.check_out = null;
      }

      if (correctWorkingHours) {
        payload.working_hours = parseFloat(correctWorkingHours);
      }

      await api.put(`/attendance/${correctingLog.id}`, payload);
      await fetchAdminLogs();
      setCorrectingLog(null);
    } catch (err: any) {
      setCorrectionError(err.response?.data?.detail || 'Failed to submit attendance correction.');
    } finally {
      setCorrectionSubmitting(false);
    }
  };

  // Helper date conversions
  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // KPI Calculations (based on last 30 days)
  const totalDays = myLogs.length;
  const presentDays = myLogs.filter(l => l.status === 'Present' || l.status === 'Late').length;
  const halfDays = myLogs.filter(l => l.status === 'Half-day').length;
  const attendanceRate = totalDays > 0 ? (((presentDays + halfDays * 0.5) / totalDays) * 100).toFixed(1) : '0';
  const totalHours = myLogs.reduce((sum, log) => sum + (log.working_hours || 0), 0).toFixed(1);

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Attendance Center</h2>
          <p className="text-xs text-slate-400">Manage logs, checks, corrections, and weekly alignments</p>
        </div>

        {/* Tab switchers if admin */}
        {isAdmin && (
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/50 font-bold self-start">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeTab === 'my' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              My Attendance
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeTab === 'admin' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Team Logs (Admin)
            </button>
          </div>
        )}
      </div>

      {activeTab === 'my' ? (
        <>
          {/* TWO-COLUMN GRID: CLOCK ACTIONS & KPI SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Clock action card */}
            <div className="premium-card p-5 space-y-4">
              <h3 className="text-slate-950 font-bold border-b border-slate-100 pb-2.5 flex items-center gap-2 text-sm">
                <Clock className="h-4.5 w-4.5 text-teal-600" />
                <span>Clock Punch Action</span>
              </h3>

              {actionError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckInLocation('Office')}
                    className={`flex-1 py-2 text-center border rounded-lg font-semibold cursor-pointer transition-colors ${
                      checkInLocation === 'Office' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Office
                  </button>
                  <button
                    onClick={() => setCheckInLocation('Remote')}
                    className={`flex-1 py-2 text-center border rounded-lg font-semibold cursor-pointer transition-colors ${
                      checkInLocation === 'Remote' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Remote
                  </button>
                </div>

                {!isCheckedIn ? (
                  <button
                    onClick={handleCheckIn}
                    disabled={actionLoading}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl font-bold shadow-xs hover:shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {actionLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                    <span>Check In ({checkInLocation})</span>
                  </button>
                ) : !isCheckedOut ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-lg space-y-1">
                      <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-wider block">Checked In</span>
                      <span className="text-xs font-bold text-slate-900 block">Today at {formatTime(todayRecord?.check_in || '')} ({todayRecord?.location})</span>
                    </div>
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl font-bold shadow-xs hover:shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      {actionLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                      <span>Check Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-100 border border-slate-200/50 p-4 rounded-xl text-center space-y-1">
                      <CheckCircle className="h-6 w-6 text-teal-600 mx-auto" />
                      <span className="font-extrabold text-slate-900 block text-xs mt-1">Completed Shift Today</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        In: {formatTime(todayRecord?.check_in || '')} | Out: {formatTime(todayRecord?.check_out || '')} ({todayRecord?.working_hours} hours)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance metrics */}
            <div className="lg:col-span-2 premium-card p-5 space-y-4 flex flex-col justify-between">
              <h3 className="text-slate-950 font-bold border-b border-slate-100 pb-2.5 flex items-center gap-2 text-sm">
                <TrendingUp className="h-4.5 w-4.5 text-teal-600" />
                <span>Attendance Statistics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-slate-200/60 p-4 rounded-xl space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Attendance Rate</span>
                    <CalendarCheck className="h-4.5 w-4.5 text-teal-600" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mt-2">{attendanceRate}%</h4>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-1">Present / active logs</span>
                </div>

                <div className="border border-slate-200/60 p-4 rounded-xl space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Hours Clocked</span>
                    <Clock className="h-4.5 w-4.5 text-indigo-600" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mt-2">{totalHours} hrs</h4>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-1">Total productive time</span>
                </div>

                <div className="border border-slate-200/60 p-4 rounded-xl space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Shift Status</span>
                    <Award className="h-4.5 w-4.5 text-emerald-600" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mt-2">{presentDays} / {totalDays}</h4>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-1">Completed presentations</span>
                </div>
              </div>
            </div>

          </div>

          {/* HISTORICAL TIMESHEET TABLE */}
          <div className="premium-card p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
              <h3 className="text-slate-950 font-bold flex items-center gap-2 text-sm">
                <CalendarDays className="h-4.5 w-4.5 text-teal-600" />
                <span>My Attendance History</span>
              </h3>
              <button
                onClick={fetchMyLogs}
                className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {isMyLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="h-8 w-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
              </div>
            ) : myLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p className="font-semibold">No attendance logs found.</p>
                <p className="text-[10px] mt-0.5">Punch check-in above to create your first timesheet entry.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Check In</th>
                      <th className="py-2.5 px-3">Check Out</th>
                      <th className="py-2.5 px-3">Hours Worked</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                    {myLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-3 px-3 text-slate-950 font-bold">{formatDate(log.date)}</td>
                        <td className="py-3 px-3">{log.location}</td>
                        <td className="py-3 px-3">{formatTime(log.check_in)}</td>
                        <td className="py-3 px-3">{formatTime(log.check_out)}</td>
                        <td className="py-3 px-3">
                          {log.working_hours ? `${log.working_hours} hours` : '--'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                            log.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
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
        </>
      ) : (
        <>
          {/* ADMIN MANAGEMENT VIEW */}
          {isAdmin && (
            <div className="space-y-6">
              
              {/* Filter block */}
              <div className="premium-card p-5 space-y-4">
                <h3 className="text-slate-950 font-bold flex items-center gap-1.5">
                  <Filter className="h-4.5 w-4.5 text-teal-600" />
                  <span>Filter Team Logs</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-600">Select Date</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-600">Select Employee</label>
                    <select
                      value={filterEmployeeId}
                      onChange={(e) => setFilterEmployeeId(e.target.value)}
                      className="px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                    >
                      <option value="">All Employees</option>
                      {allEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-600">Department</label>
                    <select
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                    >
                      <option value="">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="HR/Ops">HR/Ops</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setFilterDate('');
                      setFilterDept('');
                      setFilterEmployeeId('');
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={fetchAdminLogs}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs hover:shadow-md cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Organization Logs Table */}
              <div className="premium-card p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
                  <h3 className="text-slate-950 font-bold flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4.5 w-4.5 text-teal-600" />
                    <span>Organization Logs</span>
                  </h3>
                  <button
                    onClick={fetchAdminLogs}
                    className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                {isAdminLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="h-8 w-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
                  </div>
                ) : adminLogs.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="font-semibold">No organizational logs matching filters found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Employee</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Location</th>
                          <th className="py-2.5 px-3">Check In</th>
                          <th className="py-2.5 px-3">Check Out</th>
                          <th className="py-2.5 px-3">Hours</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                        {adminLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="py-3 px-3">
                              <div className="space-y-0.5">
                                <span className="text-slate-950 font-bold block">{log.employee?.first_name} {log.employee?.last_name}</span>
                                <span className="text-[10px] text-slate-400 block font-semibold">{log.employee?.employee_id} &bull; {log.employee?.department}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">{formatDate(log.date)}</td>
                            <td className="py-3 px-3">{log.location}</td>
                            <td className="py-3 px-3">{formatTime(log.check_in)}</td>
                            <td className="py-3 px-3">{formatTime(log.check_out)}</td>
                            <td className="py-3 px-3">
                              {log.working_hours ? `${log.working_hours} hrs` : '--'}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                                log.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                                log.status === 'Half-day' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/50' :
                                log.status === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
                                'bg-red-50 text-red-700 border-red-200/50'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setCorrectingLog(log);
                                  setCorrectCheckIn(log.check_in ? new Date(log.check_in).toISOString().slice(0, 16) : '');
                                  setCorrectCheckOut(log.check_out ? new Date(log.check_out).toISOString().slice(0, 16) : '');
                                  setCorrectStatus(log.status);
                                  setCorrectLocation(log.location);
                                  setCorrectWorkingHours(log.working_hours ? log.working_hours.toString() : '');
                                  setCorrectionError(null);
                                }}
                                className="p-1 rounded text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer inline-flex items-center gap-1 font-bold"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Correct</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* CORRECTION MODAL */}
      {correctingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-950 text-sm">Correct Attendance Entry</h3>
                <p className="text-[10px] text-slate-400">Modify logs for {correctingLog.employee?.first_name} {correctingLog.employee?.last_name}</p>
              </div>
              <button
                onClick={() => setCorrectingLog(null)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleCorrectionSubmit} className="p-6 space-y-4">
              
              {correctionError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{correctionError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Check In Time</label>
                  <input
                    type="datetime-local"
                    value={correctCheckIn}
                    onChange={(e) => setCorrectCheckIn(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Check Out Time</label>
                  <input
                    type="datetime-local"
                    value={correctCheckOut}
                    onChange={(e) => setCorrectCheckOut(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={correctStatus}
                    onChange={(e) => setCorrectStatus(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half-day">Half-day</option>
                    <option value="Leave">Leave</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Location</label>
                  <select
                    value={correctLocation}
                    onChange={(e) => setCorrectLocation(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                  >
                    <option value="Office">Office</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Working Hours (Manual Override - Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Leave empty for auto-calculation"
                  value={correctWorkingHours}
                  onChange={(e) => setCorrectWorkingHours(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCorrectingLog(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={correctionSubmitting}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs hover:shadow-md cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {correctionSubmitting ? 'Saving Correction...' : 'Save Correction'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
