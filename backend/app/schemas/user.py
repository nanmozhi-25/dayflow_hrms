from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import date, datetime
from backend.app.schemas.employee import EmployeeOut

class UserBase(BaseModel):
    email: EmailStr
    role: str = "employee"
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserRegister(UserBase):
    password: str
    employee_id: str
    first_name: str
    last_name: str
    department: str
    designation: str
    phone: Optional[str] = None
    join_date: date

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Optional nested profile details in response
    employee: Optional[EmployeeOut] = None

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None
