from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class LeaveRequestBase(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None
    status: str = "Pending"

class LeaveRequestCreate(LeaveRequestBase):
    employee_id: int

class LeaveRequestUpdate(BaseModel):
    status: Optional[str] = None  # Approved, Rejected
    approved_by_id: Optional[int] = None
    comment: Optional[str] = None

class LeaveRequestOut(LeaveRequestBase):
    id: int
    employee_id: int
    approved_by_id: Optional[int] = None
    comment: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
