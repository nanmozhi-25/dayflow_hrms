import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  UserCheck,
  DollarSign,
  FileText,
  Edit3,
  X,
  CheckCircle,
  FileDown,
  Lock,
  UploadCloud
} from 'lucide-react';

export const Profile = () => {
  const { user, employee, reloadUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for self-edit
  const [phone, setPhone] = useState(employee?.phone || '');
  const [address, setAddress] = useState(employee?.address || '');
  const [profilePicture, setProfilePicture] = useState(employee?.profile_picture || '');

  // Form states for Admin-only edit (if active user is Admin)
  const [adminFirstName, setAdminFirstName] = useState(employee?.first_name || '');
  const [adminLastName, setAdminLastName] = useState(employee?.last_name || '');
  const [adminDept, setAdminDept] = useState(employee?.department || '');
  const [adminDesig, setAdminDesig] = useState(employee?.designation || '');
  const [adminStatus, setAdminStatus] = useState(employee?.status || 'active');
  const [adminManager, setAdminManager] = useState(employee?.reporting_manager || '');
  const [adminBasicSalary, setAdminBasicSalary] = useState(employee?.basic_salary || 0);
  const [adminAllowances, setAdminAllowances] = useState(employee?.allowances || 0);
  const [adminDeductions, setAdminDeductions] = useState(employee?.deductions || 0);

  const isAdmin = user?.role === 'admin';

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMsg(null);

    try {
      if (isAdmin) {
        // Admin full update path
        const payload = {
          first_name: adminFirstName,
          last_name: adminLastName,
          department: adminDept,
          designation: adminDesig,
          status: adminStatus,
          reporting_manager: adminManager,
          basic_salary: Number(adminBasicSalary),
          allowances: Number(adminAllowances),
          deductions: Number(adminDeductions),
          phone,
          address,
          profile_picture: profilePicture
        };
        await api.put(`/employees/${employee?.id}`, payload);
      } else {
        // Standard Employee personal update path
        const payload = { phone, address, profile_picture: profilePicture };
        await api.put('/employees/profile', payload);
      }

      await reloadUser();
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        setIsEditOpen(false);
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to update profile. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockDocuments = employee?.documents || {
    "Resume": { filename: "resume_curriculum_vitae.pdf", size: "1.2 MB", status: "Verified" },
    "National ID": { filename: "passport_national_identity.pdf", size: "850 KB", status: "Verified" },
    "Offer Contract": { filename: "signed_employment_contract.pdf", size: "2.4 MB", status: "Signed" }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* Profile Header Block */}
      <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-slate-900 border-2 border-teal-500/20 text-white flex items-center justify-center relative overflow-hidden font-black text-3xl">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span>{employee?.first_name[0]}{employee?.last_name[0]}</span>
            )}
          </div>
          
          <div className="text-center md:text-left space-y-1.5">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-950">{employee?.first_name} {employee?.last_name}</h2>
              <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
                {employee?.employee_id}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">{employee?.designation} &bull; {employee?.department}</p>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
              employee?.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-red-50 text-red-700 border-red-200/50'
            }`}>
              <UserCheck className="h-3 w-3" />
              <span>{employee?.status}</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            // Re-populate states on click
            setPhone(employee?.phone || '');
            setAddress(employee?.address || '');
            setProfilePicture(employee?.profile_picture || '');
            if (isAdmin) {
              setAdminFirstName(employee?.first_name || '');
              setAdminLastName(employee?.last_name || '');
              setAdminDept(employee?.department || '');
              setAdminDesig(employee?.designation || '');
              setAdminStatus(employee?.status || 'active');
              setAdminManager(employee?.reporting_manager || '');
              setAdminBasicSalary(employee?.basic_salary || 0);
              setAdminAllowances(employee?.allowances || 0);
              setAdminDeductions(employee?.deductions || 0);
            }
            setIsEditOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs hover:shadow-md cursor-pointer transition-colors"
        >
          <Edit3 className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* THREE-COLUMN STATS / DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal Details */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="text-slate-950 font-bold border-b border-slate-100 pb-2.5 flex items-center gap-2 text-sm">
            <UserIcon className="h-4.5 w-4.5 text-teal-600" />
            <span>Personal Information</span>
          </h3>

          <div className="space-y-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Email Address</span>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{user?.email}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Phone Number</span>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{employee?.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Residential Address</span>
              <div className="flex items-start gap-2 text-slate-900 font-bold leading-normal">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{employee?.address || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="text-slate-950 font-bold border-b border-slate-100 pb-2.5 flex items-center gap-2 text-sm">
            <Briefcase className="h-4.5 w-4.5 text-teal-600" />
            <span>Employment Contract</span>
          </h3>

          <div className="space-y-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Department</span>
              <span className="text-slate-900 font-bold block">{employee?.department}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Designation / Role</span>
              <span className="text-slate-900 font-bold block">{employee?.designation}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Joining Date</span>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{employee?.join_date ? new Date(employee.join_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Reporting Manager</span>
              <span className="text-slate-900 font-bold block">{employee?.reporting_manager || 'None (Direct Report)'}</span>
            </div>
          </div>
        </div>

        {/* Salary structure summary */}
        <div className="premium-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-slate-950 font-bold border-b border-slate-100 pb-2.5 flex items-center gap-2 text-sm">
              <DollarSign className="h-4.5 w-4.5 text-teal-600" />
              <span>Salary Structure Summary</span>
            </h3>

            <div className="space-y-2 mt-3.5">
              <div className="flex justify-between items-center text-slate-600 font-semibold">
                <span>Basic Contract Salary</span>
                <span className="font-bold text-slate-950">${employee?.basic_salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-semibold">
                <span>Allowances</span>
                <span className="font-bold text-teal-600">+ ${employee?.allowances.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-semibold">
                <span>Deductions</span>
                <span className="font-bold text-red-500">- ${employee?.deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200/50 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Estimated Net Salary</span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                ${employee?.net_salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h4>
            </div>
            <span className="text-[10px] text-teal-700 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded font-bold uppercase">
              Monthly
            </span>
          </div>
        </div>
      </div>

      {/* LOWER ROW: DOCUMENTS MANAGEMENT */}
      <div className="premium-card p-6 space-y-4">
        <h3 className="text-slate-950 font-bold border-b border-slate-100 pb-2.5 flex items-center gap-2 text-sm">
          <FileText className="h-4.5 w-4.5 text-teal-600" />
          <span>Professional Verification Documents</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(mockDocuments).map(([docName, docInfo]: [string, any]) => (
            <div key={docName} className="border border-slate-200/70 p-4 rounded-xl hover:border-slate-300 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-950 block text-xs">{docName}</span>
                  <span className="text-[10px] text-slate-400 block">{docInfo.filename} &bull; {docInfo.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-teal-50 text-teal-700 border border-teal-200/50 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <CheckCircle className="h-3 w-3" />
                  <span>{docInfo.status}</span>
                </span>
                <button className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">
                  <FileDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT PROFILE DRAWER/MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white shadow-2xl flex flex-col justify-between animate-fade-in-right overflow-y-auto">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Update Employee Profile</h3>
                <p className="text-[10px] text-slate-400">Modify authorized employee context credentials</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="flex-1 p-6 space-y-5">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold flex items-center gap-2">
                  <X className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Standard Employee Editable Fields */}
              <div className="space-y-4">
                <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2.5 py-0.5 rounded border border-slate-200 uppercase tracking-wider block w-fit">
                  Personal Details (Self-Editable)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700">Profile Picture URL</label>
                    <input
                      type="text"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Residential Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, Suite 400..."
                    rows={2}
                    className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold leading-normal resize-none"
                  />
                </div>
              </div>

              {/* Admin-Only Editable Fields */}
              {isAdmin ? (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <span className="text-[9px] bg-teal-50 text-teal-700 font-extrabold px-2.5 py-0.5 rounded border border-teal-200/50 uppercase tracking-wider block w-fit">
                    Admin Authorization Actions (HR ONLY)
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700">First Name</label>
                      <input
                        type="text"
                        value={adminFirstName}
                        onChange={(e) => setAdminFirstName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700">Last Name</label>
                      <input
                        type="text"
                        value={adminLastName}
                        onChange={(e) => setAdminLastName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700">Department</label>
                      <input
                        type="text"
                        value={adminDept}
                        onChange={(e) => setAdminDept(e.target.value)}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700">Designation</label>
                      <input
                        type="text"
                        value={adminDesig}
                        onChange={(e) => setAdminDesig(e.target.value)}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700">Reporting Manager</label>
                      <input
                        type="text"
                        value={adminManager}
                        onChange={(e) => setAdminManager(e.target.value)}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700">Employment Status</label>
                      <select
                        value={adminStatus}
                        onChange={(e) => setAdminStatus(e.target.value)}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="terminated">Terminated</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700 text-[10px]">Basic Salary</label>
                      <input
                        type="number"
                        value={adminBasicSalary}
                        onChange={(e) => setAdminBasicSalary(Number(e.target.value))}
                        className="px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                        min="0"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700 text-[10px]">Allowances</label>
                      <input
                        type="number"
                        value={adminAllowances}
                        onChange={(e) => setAdminAllowances(Number(e.target.value))}
                        className="px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                        min="0"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-700 text-[10px]">Deductions</label>
                      <input
                        type="number"
                        value={adminDeductions}
                        onChange={(e) => setAdminDeductions(Number(e.target.value))}
                        className="px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-teal-500 font-bold"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-start gap-2.5 text-slate-400">
                  <Lock className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Salary, Department, Designation, and Employment Contract columns are locked and require Admin authorization credentials to modify.</span>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs hover:shadow-md cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Updates'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
