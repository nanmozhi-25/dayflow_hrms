from pydantic import BaseModel, ConfigDict
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    is_read: bool = False
    type: str = "info"  # info, warning, success, leave, payroll

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationOut(NotificationBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
