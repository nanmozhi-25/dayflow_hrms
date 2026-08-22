from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.models.employee import Employee
from backend.app.schemas.user import UserOut, UserRegister, Token, UserBase
from backend.app.core.security import get_password_hash, verify_password, create_access_token
from backend.app.api.deps import get_current_active_user

router = APIRouter()

class LoginPayload(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(data: UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new employee account. Inserts records into both
    users and employees tables inside a single atomic database transaction.
    """
    # 1. Check duplicate user email
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # 2. Check duplicate employee ID
    existing_emp = db.query(Employee).filter(Employee.employee_id == data.employee_id).first()
    if existing_emp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An employee profile with this Employee ID already exists."
        )

    try:
        # Create user account
        hashed_password = get_password_hash(data.password)
        db_user = User(
            email=data.email,
            password_hash=hashed_password,
            role=data.role,
            is_active=True
        )
        db.add(db_user)
        db.flush()  # Retrieve db_user.id for linking

        # Create employee profile
        db_employee = Employee(
            user_id=db_user.id,
            employee_id=data.employee_id,
            first_name=data.first_name,
            last_name=data.last_name,
            department=data.department,
            designation=data.designation,
            phone=data.phone,
            join_date=data.join_date,
            status="active"
        )
        db.add(db_employee)
        db.commit()
        db.refresh(db_user)
        return db_user

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user account: {str(e)}"
        )

@router.post("/login", response_model=Token)
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    """
    Authenticates a user via email and password, returning an access token.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account has been deactivated."
        )

    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_active_user)):
    """
    Returns the authenticated user details and profile.
    """
    return current_user
