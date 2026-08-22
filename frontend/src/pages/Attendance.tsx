import { useState } from 'react';
import { Clock, ClipboardCheck } from 'lucide-react';

export const Attendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [logs, setLogs] = useState([
    { date: '2026-08-21', in: '09:00 AM', out: '05:30 PM', status: 'Present', location: 'Office', duration: '8.5h' },
    { date: '2026-08-20', in: '08:54 AM', out: '05:15 PM', status: 'Present', location: 'Office', duration: '8.3h' },
    { date: '2026-08-19', in: '09:05 AM', out: '05:00 PM', status: 'Present', location: 'Remote', duration: '8.0h' },
    { date: '2026-08-18', in: '09:12 AM', out: '06:00 PM', status: 'Late Check-in', location: 'Office', duration: '8.8h' },
  ]);

  const handleToggleCheck = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      const todayDate = new Date().toISOString().split('T')[0];
      const todayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // prepend new log
      setLogs([{ date: todayDate, in: todayTime, out: '--', status: 'Present', location: 'Office', duration: '--' }, ...logs]);
    } else {
      setIsCheckedIn(false);
      const updated = [...logs];
      const todayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      updated[0].out = todayTime;
      updated[0].duration = '8.0h';
      setLogs(updated);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Punch Card */}
        <div className="premium-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              <span>Attendance Punch</span>
            </h3>
            <p className="text-xs text-slate-500">Record your workspace check-in and check-out logs.</p>
          </div>

          <div className="py-6 text-center space-y-2">
            <p className="text-3xl font-extrabold text-slate-900">
              {isCheckedIn ? '09:15 AM' : '--:--'}
            </p>
            <p className="text-xs text-slate-400 font-medium">Recorded Check-in Time</p>
          </div>

          <button
            onClick={handleToggleCheck}
            className={`w-full py-3 text-xs font-bold rounded-lg text-white shadow-xs hover:shadow-md cursor-pointer transition-colors ${
              isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-500'
            }`}
          >
            {isCheckedIn ? 'Punch Out' : 'Punch In'}
          </button>
        </div>

        {/* Stats */}
        <div className="premium-card p-6 md:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">August Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-2xl font-black text-teal-600">92%</span>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Attendance Rate</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-2xl font-black text-amber-600">1</span>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Late Check-ins</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-2xl font-black text-indigo-600">32h</span>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Total Hours Worked</p>
            </div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="premium-card p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-teal-600" />
          <span>Attendance Log History</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Check In</th>
                <th className="py-3 px-2">Check Out</th>
                <th className="py-3 px-2">Location</th>
                <th className="py-3 px-2">Duration</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="py-3.5 px-2 font-semibold text-slate-900">{log.date}</td>
                  <td className="py-3.5 px-2">{log.in}</td>
                  <td className="py-3.5 px-2">{log.out}</td>
                  <td className="py-3.5 px-2">{log.location}</td>
                  <td className="py-3.5 px-2">{log.duration}</td>
                  <td className="py-3.5 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      log.status === 'Present'
                        ? 'bg-teal-50 text-teal-700 border-teal-200/50'
                        : 'bg-amber-50 text-amber-700 border-amber-200/50'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
