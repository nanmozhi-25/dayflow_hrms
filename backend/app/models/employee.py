from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.app.db.base_class import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    employee_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. "EMP001"
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False) # e.g. "Engineering", "HR", "Sales"
    designation = Column(String(100), nullable=False) # e.g. "Software Engineer", "HR Manager"
    phone = Column(String(20), nullable=True)
    join_date = Column(Date, nullable=False)
    status = Column(String(50), default="active", nullable=False) # active, inactive, terminated
    address = Column(String(500), nullable=True)
    profile_picture = Column(String(500), nullable=True)
    reporting_manager = Column(String(100), nullable=True)
    basic_salary = Column(Float, default=0.0, nullable=False)
    allowances = Column(Float, default=0.0, nullable=False)
    deductions = Column(Float, default=0.0, nullable=False)
    net_salary = Column(Float, default=0.0, nullable=False)
    documents = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="employee")
    attendances = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    leave_requests = relationship("LeaveRequest", back_populates="employee", cascade="all, delete-orphan")
    payrolls = relationship("Payroll", back_populates="employee", cascade="all, delete-orphan")
