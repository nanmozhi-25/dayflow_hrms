from pydantic import BaseModel, ConfigDict
from typing import Optional
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

class EmployeeCreate(EmployeeBase):
    user_id: int

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    phone: Optional[str] = None
    join_date: Optional[date] = None
    status: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
