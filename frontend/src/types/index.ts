export type UserRole = 'admin' | 'employee';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Employee {
  id: number;
  user_id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  department: string;
  designation: string;
  phone?: string;
  join_date: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at?: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  location: 'Office' | 'Remote';
  created_at: string;
  updated_at?: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by_id?: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
}

export interface Payroll {
  id: number;
  employee_id: number;
  month: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'Draft' | 'Paid' | 'Processing' | 'Failed';
  paid_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  type: 'info' | 'warning' | 'success' | 'leave' | 'payroll';
  created_at: string;
}

export interface AIInsight {
  id: number;
  title: string;
  description: string;
  category: 'Attendance' | 'Retention' | 'Cost' | 'Performance';
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
}
