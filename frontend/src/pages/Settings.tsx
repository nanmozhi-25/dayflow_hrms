import { Bell, Shield } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="premium-card p-6 space-y-6 font-sans">
      <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">User & Portal Settings</h3>

      <div className="space-y-6 text-xs max-w-xl">
        {/* Notification Settings */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-700 flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-teal-600" />
            <span>Notification Preferences</span>
          </h4>
          <div className="space-y-2 pl-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span>Email notifications for leave request approvals</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span>System dashboard indicators for monthly payslips</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span>Receive weekly AI performance recommendation summaries</span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-700 flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-teal-600" />
            <span>Security Configuration</span>
          </h4>
          <div className="space-y-3 pl-6">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full max-w-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full max-w-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
            </div>
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer">
              Update Security Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
