from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.app.db.base_class import Base

class Payroll(Base):
    __tablename__ = "payroll"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), index=True, nullable=False)
    month = Column(String(7), nullable=False)  # "YYYY-MM"
    basic_salary = Column(Float, nullable=False)
    allowances = Column(Float, default=0.0, nullable=False)
    deductions = Column(Float, default=0.0, nullable=False)
    net_salary = Column(Float, nullable=False)
    status = Column(String(50), default="Draft", nullable=False)  # Draft, Paid, Processing, Failed
    paid_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    employee = relationship("Employee", back_populates="payrolls")
