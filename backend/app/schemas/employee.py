from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import date, datetime

class EmployeeBase(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    department: str
    designation: str
    phone: Optional[str] = None
    join_date: date
    status: str = "active"
    
    # New Profile Details
    address: Optional[str] = None
    profile_picture: Optional[str] = None
    reporting_manager: Optional[str] = None
    basic_salary: float = 0.0
    allowances: float = 0.0
    deductions: float = 0.0
    net_salary: float = 0.0
    documents: Optional[Dict[str, Any]] = None

class EmployeeCreate(EmployeeBase):
    user_id: int

# Allowed self-update schema for standard Employees
class EmployeeProfileUpdate(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None
    profile_picture: Optional[str] = None

# Full update schema for HR Administrators
class EmployeeAdminUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    phone: Optional[str] = None
    join_date: Optional[date] = None
    status: Optional[str] = None
    address: Optional[str] = None
    profile_picture: Optional[str] = None
    reporting_manager: Optional[str] = None
    basic_salary: Optional[float] = None
    allowances: Optional[float] = None
    deductions: Optional[float] = None
    documents: Optional[Dict[str, Any]] = None

class EmployeeOut(EmployeeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
