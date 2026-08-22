import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Building, MapPin, Calendar, Award } from 'lucide-react';

export const Profile = () => {
  const { employee, user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-4xl shadow-md border-4 border-slate-100">
          {employee?.first_name[0]}{employee?.last_name[0]}
        </div>
        <div className="text-center md:text-left space-y-1">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900">{employee?.first_name} {employee?.last_name}</h2>
            <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/50 text-[10px] font-bold uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">{employee?.designation} • {employee?.department}</p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
            <MapPin className="h-4.5 w-4.5" />
            <span>HQ Office, New York</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="premium-card p-6 space-y-4 lg:col-span-2">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-teal-600" />
            <span>Personal Details & Contact</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Employee ID</span>
              <p className="font-bold text-slate-900 text-sm">{employee?.employee_id}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Status</span>
              <p className="font-bold text-emerald-600 text-sm uppercase tracking-wide">{employee?.status}</p>
            </div>
            <div className="space-y-1 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Mail className="h-4 w-4" /></div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Email Address</span>
                <p className="font-semibold text-slate-900">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-1 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Phone className="h-4 w-4" /></div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Phone Number</span>
                <p className="font-semibold text-slate-900">{employee?.phone || 'Not Provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workplace Info */}
        <div className="premium-card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building className="h-5 w-5 text-teal-600" />
            <span>Job Information</span>
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <span className="text-slate-400 font-medium block">Join Date</span>
                <p className="font-bold text-slate-900">{employee?.join_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-slate-400" />
              <div>
                <span className="text-slate-400 font-medium block">Manager</span>
                <p className="font-bold text-slate-900">Sarah Jenkins (HR Director)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
