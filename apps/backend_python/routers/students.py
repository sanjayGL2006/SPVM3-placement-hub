from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
from datetime import datetime

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.get("/", response_model=List[schemas.StudentResponse])
def get_students(
    department_id: Optional[int] = None,
    section: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 250,
    db: Session = Depends(get_db)
):
    query = db.query(models.Student).filter(models.Student.is_deleted == False)
    if department_id:
        query = query.filter(models.Student.department_id == department_id)
    if section and section != "All":
        query = query.filter(models.Student.section == section)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Student.name.ilike(s)) |
            (models.Student.register_number.ilike(s)) |
            (models.Student.skills.ilike(s))
        )
    return query.offset(skip).limit(limit).all()

@router.get("/{student_id}", response_model=schemas.StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(
        models.Student.id == student_id,
        models.Student.is_deleted == False
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/", response_model=schemas.StudentResponse)
def create_student(student_in: schemas.StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Student).filter(
        models.Student.register_number == student_in.register_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student with register number already exists")
    
    student = models.Student(**student_in.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.put("/{student_id}", response_model=schemas.StudentResponse)
def update_student(student_id: int, student_in: schemas.StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(
        models.Student.id == student_id,
        models.Student.is_deleted == False
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    for field, val in student_in.dict(exclude_unset=True).items():
        setattr(student, field, val)
    
    student.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Soft delete and move to recycle bin
    student.is_deleted = True
    student.deleted_at = datetime.utcnow()
    
    recycle_item = models.RecycleBin(
        entity_type="STUDENT",
        entity_id=student.id,
        entity_name=f"{student.name} ({student.register_number})",
        payload={
            "id": student.id,
            "name": student.name,
            "register_number": student.register_number,
            "email": student.email,
            "cgpa": float(student.cgpa) if student.cgpa else None,
            "department_id": student.department_id,
            "section": student.section
        }
    )
    db.add(recycle_item)
    db.commit()
    return {"message": "Student moved to recycle bin successfully"}
