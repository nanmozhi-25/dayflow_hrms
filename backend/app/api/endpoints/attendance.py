from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime, timezone

from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.models.employee import Employee
from backend.app.models.attendance import Attendance
from backend.app.api.deps import get_current_active_user, RoleChecker
from backend.app.schemas.attendance import (
    AttendanceOut, 
    AttendanceCorrection
)

router = APIRouter()

@router.post("/check-in", response_model=AttendanceOut)
def check_in(
    location: str = Query("Office", description="Clock-in location (Office, Remote)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Clock-in today. Generates a new attendance entry. Prevents duplicates.
    """
    employee = current_user.employee
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have an associated employee profile."
        )

    now_utc = datetime.now(timezone.utc)
    today = now_utc.date()

    # Search for an existing record today
    attendance_record = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()

    if attendance_record:
        if attendance_record.check_in is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate check-in: You have already checked in today."
            )
        # Update check-in time and status
        attendance_record.check_in = now_utc
        attendance_record.location = location
        attendance_record.status = "Present"
    else:
        # Create a new record
        attendance_record = Attendance(
            employee_id=employee.id,
            date=today,
            check_in=now_utc,
            location=location,
            status="Present"
        )
        db.add(attendance_record)

    db.commit()
    db.refresh(attendance_record)
    return attendance_record

@router.post("/check-out", response_model=AttendanceOut)
def check_out(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Clock-out today. Calculates working hours. Prevents duplicate check-outs.
    """
    employee = current_user.employee
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have an associated employee profile."
        )

    now_utc = datetime.now(timezone.utc)
    today = now_utc.date()

    # Search for today's record
    attendance_record = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()

    if not attendance_record or attendance_record.check_in is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Checkout failed: No check-in record found for today."
        )

    if attendance_record.check_out is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate check-out: You have already checked out today."
        )

    # Calculate hours
    attendance_record.check_out = now_utc
    delta = now_utc - attendance_record.check_in
    working_hours = round(delta.total_seconds() / 3600.0, 2)
    attendance_record.working_hours = working_hours

    # Optionally flag half-days if hours fall below 4 hours
    if working_hours < 4.0:
        attendance_record.status = "Half-day"

    db.add(attendance_record)
    db.commit()
    db.refresh(attendance_record)
    return attendance_record

@router.get("/me", response_model=List[AttendanceOut])
def get_my_attendance(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieves the attendance history of the logged-in employee.
    """
    employee = current_user.employee
    if not employee:
        return []

    query = db.query(Attendance).filter(Attendance.employee_id == employee.id)
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)

    return query.order_by(Attendance.date.desc()).all()

@router.get("/admin", response_model=List[AttendanceOut])
def get_all_attendance(
    date_filter: Optional[date] = Query(None, alias="date"),
    employee_id: Optional[int] = Query(None),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """
    HR/Admin only: Retrieves and filters attendance records across all employees.
    """
    query = db.query(Attendance).join(Employee)

    if date_filter:
        query = query.filter(Attendance.date == date_filter)
    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    if department:
        query = query.filter(Employee.department == department)

    return query.order_by(Attendance.date.desc()).all()

@router.put("/{id}", response_model=AttendanceOut)
def correct_attendance_by_admin(
    id: int,
    payload: AttendanceCorrection,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """
    HR/Admin only: Manually updates or corrects an employee's attendance record.
    """
    record = db.query(Attendance).filter(Attendance.id == id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found."
        )

    update_data = payload.model_dump(exclude_unset=True)

    # Recalculate hours automatically if timestamps change and hours are not explicitly passed
    check_in_time = update_data.get("check_in", record.check_in)
    check_out_time = update_data.get("check_out", record.check_out)

    if ("check_in" in update_data or "check_out" in update_data) and "working_hours" not in update_data:
        if check_in_time and check_out_time:
            delta = check_out_time - check_in_time
            update_data["working_hours"] = round(delta.total_seconds() / 3600.0, 2)

    for field, value in update_data.items():
        setattr(record, field, value)

    db.add(record)
    db.commit()
    db.refresh(record)
    return record
