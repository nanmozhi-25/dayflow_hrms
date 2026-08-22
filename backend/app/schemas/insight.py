from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AIInsightBase(BaseModel):
    title: str
    description: str
    category: str  # Attendance, Retention, Cost, Performance
    severity: str = "info"  # info, warning, critical

class AIInsightCreate(AIInsightBase):
    pass

class AIInsightOut(AIInsightBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
