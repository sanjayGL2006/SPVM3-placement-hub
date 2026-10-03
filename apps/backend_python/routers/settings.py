from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from database import get_db
import models
from datetime import datetime

router = APIRouter(prefix="/api/settings", tags=["System Settings & Recycle Bin"])

@router.post("/reset-students")
def reset_student_data_only(db: Session = Depends(get_db)):
    students = db.query(models.Student).filter(models.Student.is_deleted == False).all()
    
    # Backup all students to recycle bin before soft-reset
    timestamp = datetime.utcnow()
    for s in students:
        s.is_deleted = True
        s.deleted_at = timestamp
        recycle_item = models.RecycleBin(
            entity_type="STUDENT",
            entity_id=s.id,
            entity_name=f"{s.name} ({s.register_number})",
            payload={
                "id": s.id,
                "name": s.name,
                "register_number": s.register_number,
                "email": s.email,
                "department_id": s.department_id,
                "section": s.section
            }
        )
        db.add(recycle_item)

    db.commit()
    return {
        "message": f"Successfully wiped {len(students)} student records. Backups saved in Recycle Bin.",
        "wiped_count": len(students)
    }

@router.post("/reset-companies")
def reset_company_data_only(db: Session = Depends(get_db)):
    companies = db.query(models.Company).filter(models.Company.is_deleted == False).all()
    
    timestamp = datetime.utcnow()
    for c in companies:
        c.is_deleted = True
        c.deleted_at = timestamp
        recycle_item = models.RecycleBin(
            entity_type="COMPANY",
            entity_id=c.id,
            entity_name=c.name,
            payload={
                "id": c.id,
                "name": c.name,
                "industry": c.industry,
                "tier": c.tier,
                "avg_package": float(c.avg_package) if c.avg_package else None
            }
        )
        db.add(recycle_item)

    db.commit()
    return {
        "message": f"Successfully wiped {len(companies)} company partner records. Backups saved in Recycle Bin.",
        "wiped_count": len(companies)
    }

@router.post("/reset-all")
def delete_all_data(db: Session = Depends(get_db)):
    reset_student_data_only(db)
    reset_company_data_only(db)
    return {"message": "All database entities wiped and backed up into Recycle Bin for recovery."}

@router.get("/recycle-bin", response_model=List[Dict[str, Any]])
def get_recycle_bin_items(db: Session = Depends(get_db)):
    items = db.query(models.RecycleBin).order_by(models.RecycleBin.id.desc()).all()
    return [
        {
            "id": i.id,
            "entity_type": i.entity_type,
            "entity_id": i.entity_id,
            "entity_name": i.entity_name,
            "deleted_by": i.deleted_by,
            "deleted_at": i.deleted_at,
            "payload": i.payload
        }
        for i in items
    ]

@router.post("/recycle-bin/restore/{item_id}")
def restore_from_recycle_bin(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.RecycleBin).filter(models.RecycleBin.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Recycle bin item not found")

    if item.entity_type == "STUDENT":
        student = db.query(models.Student).filter(models.Student.id == item.entity_id).first()
        if student:
            student.is_deleted = False
            student.deleted_at = None
    elif item.entity_type == "COMPANY":
        company = db.query(models.Company).filter(models.Company.id == item.entity_id).first()
        if company:
            company.is_deleted = False
            company.deleted_at = None

    db.delete(item)
    db.commit()
    return {"message": f"Restored {item.entity_name} back to active directory successfully"}

@router.delete("/recycle-bin/empty")
def empty_recycle_bin(db: Session = Depends(get_db)):
    db.query(models.RecycleBin).delete()
    db.commit()
    return {"message": "Recycle Bin permanently purged"}
