from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = "placement-pro-secret-key-2026"
ALGORITHM = "HS256"

@router.post("/login", response_model=schemas.TokenResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    # Check demo users or user in database
    if not user:
        # Provide predefined login for demo convenience if database is not seeded yet
        if "principal" in request.email:
            role = "principal"
            name = "Dr. S. K. Narayanan (Principal)"
        elif "hod" in request.email:
            role = "hod"
            name = "Prof. R. Venkatesh (HOD BCA)"
        elif "coord" in request.email:
            role = "coordinator"
            name = "Dr. Ananya Sharma (Coordinator)"
        elif "student" in request.email:
            role = "student"
            name = "Aarav Sharma (BCA Student)"
        else:
            role = "faculty"
            name = "Staff Member"
            
        token_data = {"sub": request.email, "role": role, "exp": datetime.utcnow() + timedelta(days=7)}
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {"email": request.email, "name": name, "role": role}
        }
        
    token_data = {"sub": user.email, "role": user.role, "id": user.id, "exp": datetime.utcnow() + timedelta(days=7)}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role}
    }
