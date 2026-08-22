from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class AttendanceBase(BaseModel):
    date: date
    status: str = "Present"
    location: str = "Office"

class AttendanceCreate(AttendanceBase):
    employee_id: int
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None

class AttendanceUpdate(BaseModel):
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: Optional[str] = None
    location: Optional[str] = None

class AttendanceOut(AttendanceBase):
    id: int
    employee_id: int
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
