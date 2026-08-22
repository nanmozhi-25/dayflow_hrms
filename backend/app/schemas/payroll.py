from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class PayrollBase(BaseModel):
    month: str  # Format: YYYY-MM
    basic_salary: float
    allowances: float = 0.0
    deductions: float = 0.0
    net_salary: float
    status: str = "Draft"
    paid_date: Optional[date] = None

class PayrollCreate(PayrollBase):
    employee_id: int

class PayrollUpdate(BaseModel):
    basic_salary: Optional[float] = None
    allowances: Optional[float] = None
    deductions: Optional[float] = None
    net_salary: Optional[float] = None
    status: Optional[str] = None
    paid_date: Optional[date] = None

class PayrollOut(PayrollBase):
    id: int
    employee_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
