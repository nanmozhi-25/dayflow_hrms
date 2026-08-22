import { UserPlus, Search, Edit2, Trash2 } from 'lucide-react';

export const Employees = () => {
  const employees = [
    { name: 'Sarah Jenkins', id: 'ADM001', dept: 'People Operations', role: 'HR Director', email: 'sarah.j@dayflow.com', status: 'active' },
    { name: 'Alex Rivera', id: 'EMP042', dept: 'Product Engineering', role: 'Senior Frontend Dev', email: 'alex.r@dayflow.com', status: 'active' },
    { name: 'Daniel Carter', id: 'EMP043', dept: 'Product Engineering', role: 'DevOps Engineer', email: 'daniel.c@dayflow.com', status: 'active' },
    { name: 'Emily Watson', id: 'EMP044', dept: 'Sales', role: 'Account Manager', email: 'emily.w@dayflow.com', status: 'active' },
    { name: 'Robert Vance', id: 'EMP045', dept: 'Finance', role: 'Senior Accountant', email: 'robert.v@dayflow.com', status: 'inactive' },
  ];

  return (
    <div className="premium-card p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Employee Directory</h3>
          <p className="text-xs text-slate-400">Manage company profiles, user accounts, and statuses</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-colors">
          <UserPlus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID or department..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-2">Employee Name</th>
              <th className="py-2.5 px-2">ID</th>
              <th className="py-2.5 px-2">Department</th>
              <th className="py-2.5 px-2">Role</th>
              <th className="py-2.5 px-2">Email</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {employees.map((emp, index) => (
              <tr key={index}>
                <td className="py-3.5 px-2 font-semibold text-slate-950">{emp.name}</td>
                <td className="py-3.5 px-2">{emp.id}</td>
                <td className="py-3.5 px-2">{emp.dept}</td>
                <td className="py-3.5 px-2">{emp.role}</td>
                <td className="py-3.5 px-2">{emp.email}</td>
                <td className="py-3.5 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                    emp.status === 'active'
                      ? 'bg-teal-50 text-teal-700 border-teal-200/50'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-right space-x-3">
                  <button className="text-slate-400 hover:text-teal-600 cursor-pointer inline-block"><Edit2 className="h-4 w-4" /></button>
                  <button className="text-slate-400 hover:text-red-500 cursor-pointer inline-block"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
