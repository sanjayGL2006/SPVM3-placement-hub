from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from database import get_db
import models
import schemas
from datetime import datetime

router = APIRouter(prefix="/api/pipeline", tags=["Candidate Pipeline & Roster"])

@router.get("/drive/{drive_id}", response_model=List[Dict[str, Any]])
def get_drive_candidate_roster(
    drive_id: int,
    stage: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.CandidatePipeline).join(
        models.Student, models.CandidatePipeline.student_id == models.Student.id
    ).filter(models.CandidatePipeline.drive_id == drive_id)

    if stage and stage != "All":
        query = query.filter(models.CandidatePipeline.current_stage == stage)

    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Student.name.ilike(s)) |
            (models.Student.register_number.ilike(s)) |
            (models.Student.email.ilike(s))
        )

    roster = query.all()
    results = []
    for item in roster:
        student = item.student
        dept_name = student.department.name if student.department else "Computer Applications"
        results.append({
            "id": item.id,
            "drive_id": item.drive_id,
            "student_id": student.id,
            "register_number": student.register_number,
            "candidate_name": student.name,
            "email": student.email or f"{student.register_number.lower()}@college.edu",
            "department": dept_name,
            "section": student.section or "A",
            "cgpa": float(student.cgpa) if student.cgpa else 7.5,
            "package_lpa": float(item.offered_package_lpa) if item.offered_package_lpa else (float(item.drive.package_lpa) if item.drive else 6.5),
            "hiring_stage": item.current_stage,
            "stage_status": item.stage_status,
            "drive_status": item.drive.status if item.drive else "Ongoing",
            "offer_letter_status": item.offer_letter_status,
            "pipeline_activity_log": item.pipeline_activity_log or [],
            "notes": item.notes or "Profile verified for recruitment round",
            "updated_at": item.updated_at
        })
    return results

@router.post("/assign")
def assign_candidates_to_drive(
    request: schemas.AssignCandidatesRequest,
    db: Session = Depends(get_db)
):
    drive = db.query(models.PlacementDrive).filter(models.PlacementDrive.id == request.drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Placement drive not found")

    assigned_count = 0
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    
    for student_id in request.student_ids:
        # Check if already assigned
        existing = db.query(models.CandidatePipeline).filter(
            models.CandidatePipeline.drive_id == request.drive_id,
            models.CandidatePipeline.student_id == student_id
        ).first()

        if not existing:
            new_entry = models.CandidatePipeline(
                drive_id=request.drive_id,
                student_id=student_id,
                company_id=drive.company_id,
                current_stage=request.initial_stage or "Assigned",
                stage_status="Processing",
                offered_package_lpa=drive.package_lpa,
                offer_letter_status="Pending",
                pipeline_activity_log=[
                    {
                        "date": timestamp,
                        "stage": request.initial_stage or "Assigned",
                        "status": "Processing",
                        "note": f"Candidate pushed into {drive.company.name if drive.company else 'Drive'} pipeline by Administrator."
                    }
                ]
            )
            db.add(new_entry)
            assigned_count += 1

    db.commit()
    return {
        "message": f"Successfully assigned {assigned_count} candidates to drive",
        "assigned_count": assigned_count
    }

@router.put("/update-stage")
def update_candidate_pipeline_stage(
    request: schemas.UpdateCandidateStageRequest,
    db: Session = Depends(get_db)
):
    candidate = db.query(models.CandidatePipeline).filter(
        models.CandidatePipeline.id == request.candidate_id
    ).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate record not found")

    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    
    # Update candidate fields
    candidate.current_stage = request.stage
    candidate.stage_status = request.status
    if request.offered_package_lpa is not None:
        candidate.offered_package_lpa = request.offered_package_lpa
    if request.offer_letter_status:
        candidate.offer_letter_status = request.offer_letter_status
    elif request.stage in ["Offer Letter Request", "Selected"]:
        candidate.offer_letter_status = "Issued"
    elif request.stage == "Joined Company Request":
        candidate.offer_letter_status = "Joined"
    elif request.stage == "Rejected" or request.status == "Failed or Rejected":
        candidate.offer_letter_status = "Rejected"

    # Append activity log
    log = list(candidate.pipeline_activity_log or [])
    log.append({
        "date": timestamp,
        "stage": request.stage,
        "status": request.status,
        "note": request.note or f"Stage updated to {request.stage} ({request.status})"
    })
    candidate.pipeline_activity_log = log
    candidate.updated_at = datetime.utcnow()

    # If student is selected or joined, update their main student placement status
    if request.stage in ["Selected", "Joined Company Request"] and request.status in ["Passed Round", "Completed"]:
        student = candidate.student
        if student:
            student.placement_status = "PLACED"

    db.commit()
    return {
        "message": "Candidate pipeline stage updated successfully",
        "candidate": {
            "id": candidate.id,
            "stage": candidate.current_stage,
            "status": candidate.stage_status,
            "offer_letter_status": candidate.offer_letter_status,
            "activity_log": candidate.pipeline_activity_log
        }
    }
