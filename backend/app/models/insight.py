from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from backend.app.db.base_class import Base

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(1000), nullable=False)
    category = Column(String(50), nullable=False)  # Attendance, Retention, Cost, Performance
    severity = Column(String(50), default="info", nullable=False)  # info, warning, critical
    created_at = Column(DateTime(timezone=True), server_default=func.now())
