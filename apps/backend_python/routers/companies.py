from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from database import get_db
import models
import schemas
from datetime import datetime

router = APIRouter(prefix="/api/companies", tags=["Companies & Drives"])

@router.get("/", response_model=List[Dict[str, Any]])
def get_companies(
    tier: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Company).filter(models.Company.is_deleted == False)
    if tier and tier != "All Tiers":
        query = query.filter(models.Company.tier.ilike(f"%{tier}%"))
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Company.name.ilike(s)) |
            (models.Company.industry.ilike(s)) |
            (models.Company.required_skills.ilike(s))
        )
    
    companies = query.all()
    results = []
    for c in companies:
        results.append({
            "id": c.id,
            "name": c.name,
            "industry": c.industry,
            "website": c.website,
            "location": c.location,
            "description": c.description,
            "logo_url": c.logo_url,
            "tier": c.tier,
            "package_range": {
                "min": float(c.min_package) if c.min_package else 4.0,
                "max": float(c.max_package) if c.max_package else 8.0
            },
            "avg_package": float(c.avg_package) if c.avg_package else 6.0,
            "min_cgpa": float(c.min_cgpa) if c.min_cgpa else 6.5,
            "allowed_backlogs": c.allowed_backlogs,
            "eligible_departments": c.eligible_departments.split(", ") if c.eligible_departments else [],
            "required_skills": c.required_skills.split(", ") if c.required_skills else [],
            "total_interested_count": c.total_interested_count,
            "total_hired_count": c.total_hired_count,
            "created_at": c.created_at
        })
    return results

@router.get("/{company_id}")
def get_company_details(company_id: int, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(
        models.Company.id == company_id,
        models.Company.is_deleted == False
    ).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Fetch active drive for this company
    active_drive = db.query(models.PlacementDrive).filter(
        models.PlacementDrive.company_id == company_id,
        models.PlacementDrive.is_deleted == False
    ).order_by(models.PlacementDrive.id.desc()).first()

    # Calculate live pipeline counts
    counts = {
        "interested": company.total_interested_count,
        "assigned": 0,
        "aptitude": 0,
        "technical": 0,
        "hr": 0,
        "selected": 0,
        "rejected": 0,
        "offer_letter_given": 0,
        "joined": 0
    }

    if active_drive:
        candidates = db.query(models.CandidatePipeline).filter(
            models.CandidatePipeline.drive_id == active_drive.id
        ).all()
        counts["assigned"] = len(candidates)
        for cand in candidates:
            stage = cand.current_stage
            if stage == "Aptitude Test":
                counts["aptitude"] += 1
            elif stage == "Technical Interview":
                counts["technical"] += 1
            elif stage == "HR Round":
                counts["hr"] += 1
            elif stage in ["Selected", "IR"]:
                counts["selected"] += 1
            elif stage == "Rejected" or cand.stage_status == "Failed or Rejected":
                counts["rejected"] += 1
            elif stage == "Offer Letter Request" or cand.offer_letter_status in ["Issued", "Accepted"]:
                counts["offer_letter_given"] += 1
            elif stage == "Joined Company Request" or cand.offer_letter_status == "Joined":
                counts["joined"] += 1

    return {
        "company": {
            "id": company.id,
            "name": company.name,
            "industry": company.industry,
            "logo_url": company.logo_url,
            "tier": company.tier,
            "avg_package": float(company.avg_package) if company.avg_package else 6.0,
            "package_range": {
                "min": float(company.min_package) if company.min_package else 4.0,
                "max": float(company.max_package) if company.max_package else 8.0
            },
            "min_cgpa": float(company.min_cgpa) if company.min_cgpa else 6.5,
            "allowed_backlogs": company.allowed_backlogs,
            "description": company.description
        },
        "active_drive": {
            "id": active_drive.id if active_drive else None,
            "title": active_drive.title if active_drive else "On-Campus Recruitment Drive",
            "job_role": active_drive.job_role if active_drive else "Software Engineer",
            "package_lpa": float(active_drive.package_lpa) if active_drive and active_drive.package_lpa else float(company.avg_package or 6.5),
            "status": active_drive.status if active_drive else "Ongoing",
            "current_round": active_drive.current_round if active_drive else "Aptitude Test",
            "drive_date": active_drive.drive_date if active_drive else datetime.utcnow().date()
        },
        "stage_metrics": counts
    }

@router.post("/")
def create_company(company_in: schemas.CompanyCreate, db: Session = Depends(get_db)):
    company = models.Company(**company_in.dict())
    db.add(company)
    db.commit()
    db.refresh(company)

    # Automatically create default placement drive for company
    drive = models.PlacementDrive(
        company_id=company.id,
        title=f"{company.name} On-Campus Recruitment Drive",
        job_role="Associate Software Engineer",
        package_lpa=company.avg_package or 6.5,
        drive_date=datetime.utcnow().date(),
        current_round="Aptitude Test",
        status="Ongoing"
    )
    db.add(drive)
    db.commit()
    return company

@router.delete("/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company.is_deleted = True
    company.deleted_at = datetime.utcnow()

    recycle_item = models.RecycleBin(
        entity_type="COMPANY",
        entity_id=company.id,
        entity_name=company.name,
        payload={
            "id": company.id,
            "name": company.name,
            "industry": company.industry,
            "tier": company.tier,
            "avg_package": float(company.avg_package) if company.avg_package else None
        }
    )
    db.add(recycle_item)
    db.commit()
    return {"message": "Company moved to recycle bin successfully"}
