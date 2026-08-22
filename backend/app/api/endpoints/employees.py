from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.models.employee import Employee
from backend.app.api.deps import get_current_active_user, RoleChecker
from backend.app.schemas.employee import (
    EmployeeOut, 
    EmployeeProfileUpdate, 
    EmployeeAdminUpdate
)

router = APIRouter()

@router.get("/profile", response_model=EmployeeOut)
def get_my_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieves the logged-in employee's profile.
    """
    if not current_user.employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found for this user."
        )
    return current_user.employee

@router.put("/profile", response_model=EmployeeOut)
def update_my_profile(
    payload: EmployeeProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Enables employees to update their own address, phone, and profile picture.
    """
    employee = current_user.employee
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found for this user."
        )

    # Apply updates
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(employee, field, value)

    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

@router.get("/list", response_model=List[EmployeeOut])
def list_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """
    HR/Admin only: Retrieves a list of all employees in the organization.
    """
    return db.query(Employee).all()

@router.get("/{id}", response_model=EmployeeOut)
def get_employee_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieves a specific employee profile. Only accessible by admins OR the employee themselves.
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found."
        )

    # Authorization boundary
    if current_user.role != "admin" and employee.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this employee profile."
        )

    return employee

@router.put("/{id}", response_model=EmployeeOut)
def update_employee_by_admin(
    id: int,
    payload: EmployeeAdminUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """
    HR/Admin only: Modifies any aspect of an employee profile, including salary structures.
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found."
        )

    update_data = payload.model_dump(exclude_unset=True)
    
    # Calculate net salary if any salary components are edited
    basic_salary = update_data.get("basic_salary", employee.basic_salary)
    allowances = update_data.get("allowances", employee.allowances)
    deductions = update_data.get("deductions", employee.deductions)
    
    if "basic_salary" in update_data or "allowances" in update_data or "deductions" in update_data:
        update_data["net_salary"] = basic_salary + allowances - deductions

    for field, value in update_data.items():
        setattr(employee, field, value)

    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee
