from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class EmployeeBrief(BaseModel):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    department: str
    designation: str

    model_config = ConfigDict(from_attributes=True)

class AttendanceBase(BaseModel):
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    working_hours: Optional[float] = None
    status: str = "Present"
    location: str = "Office"

class AttendanceCreate(AttendanceBase):
    employee_id: int

class AttendanceOut(AttendanceBase):
    id: int
    employee_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    employee: Optional[EmployeeBrief] = None

    model_config = ConfigDict(from_attributes=True)

class AttendanceCorrection(BaseModel):
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: Optional[str] = None
    location: Optional[str] = None
    working_hours: Optional[float] = None
