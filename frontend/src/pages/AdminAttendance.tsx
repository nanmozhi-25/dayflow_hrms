
export const AdminAttendance = () => {
  const records = [
    { name: 'Sarah Jenkins', time: '08:45 AM', status: 'Present', location: 'Office' },
    { name: 'Alex Rivera', time: '09:02 AM', status: 'Late Check-in', location: 'Remote' },
    { name: 'Daniel Carter', time: '08:58 AM', status: 'Present', location: 'Office' },
    { name: 'Emily Watson', time: '09:12 AM', status: 'Late Check-in', location: 'Office' },
    { name: 'Robert Vance', time: '--', status: 'Absent', location: '--' },
  ];

  return (
    <div className="premium-card p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Attendance Management</h3>
          <p className="text-xs text-slate-400">Review today's company logins, clock times, and locations</p>
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex-1 max-w-xs relative">
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-3 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-2">Employee</th>
              <th className="py-2.5 px-2">Clock In Time</th>
              <th className="py-2.5 px-2">Location</th>
              <th className="py-2.5 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {records.map((rec, index) => (
              <tr key={index}>
                <td className="py-3.5 px-2 font-semibold text-slate-950">{rec.name}</td>
                <td className="py-3.5 px-2">{rec.time}</td>
                <td className="py-3.5 px-2">{rec.location}</td>
                <td className="py-3.5 px-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                    rec.status === 'Present' ? 'bg-teal-50 text-teal-700 border-teal-200/50' :
                    rec.status === 'Absent' ? 'bg-red-50 text-red-700 border-red-200/50' :
                    'bg-amber-50 text-amber-700 border-amber-200/50'
                  }`}>
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
