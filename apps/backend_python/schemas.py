from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any, Dict
from datetime import date, datetime
from decimal import Decimal

# --- AUTH SCHEMAS ---
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# --- STUDENT SCHEMAS ---
class StudentBase(BaseModel):
    register_number: str
    name: str
    email: Optional[str] = None
    mobile_number: Optional[str] = None
    gender: Optional[str] = "Male"
    department_id: Optional[int] = None
    course_id: Optional[int] = None
    section: Optional[str] = "A"
    academic_year: Optional[str] = "2025-26"
    batch: Optional[str] = "2022-2026"
    semester: Optional[int] = 6
    cgpa: Optional[float] = 7.50
    percentage: Optional[float] = 75.00
    backlogs: Optional[int] = 0
    skills: Optional[str] = "JavaScript, React, SQL"
    placement_status: Optional[str] = "NOT_PLACED"

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    mobile_number: Optional[str] = None
    department_id: Optional[int] = None
    course_id: Optional[int] = None
    section: Optional[str] = None
    cgpa: Optional[float] = None
    backlogs: Optional[int] = None
    skills: Optional[str] = None
    placement_status: Optional[str] = None

class StudentResponse(StudentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- COMPANY SCHEMAS ---
class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    tier: Optional[str] = "Core"
    min_package: Optional[float] = 4.00
    max_package: Optional[float] = 8.00
    avg_package: Optional[float] = 6.00
    min_cgpa: Optional[float] = 6.50
    allowed_backlogs: Optional[int] = 0
    eligible_departments: Optional[str] = "Computer Applications, Science"
    required_skills: Optional[str] = "Java, Python, Web Dev"
    total_interested_count: Optional[int] = 50
    total_hired_count: Optional[int] = 10

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    tier: Optional[str] = None
    min_package: Optional[float] = None
    max_package: Optional[float] = None
    avg_package: Optional[float] = None
    min_cgpa: Optional[float] = None
    allowed_backlogs: Optional[int] = None
    eligible_departments: Optional[str] = None
    required_skills: Optional[str] = None
    total_interested_count: Optional[int] = None
    total_hired_count: Optional[int] = None

class CompanyResponse(CompanyBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- DRIVE SCHEMAS ---
class PlacementDriveCreate(BaseModel):
    company_id: int
    title: str
    job_role: str
    job_description: Optional[str] = None
    location: Optional[str] = "Campus Auditorium"
    package_lpa: Optional[float] = 6.50
    min_cgpa: Optional[float] = 6.00
    allowed_backlogs: Optional[int] = 0
    eligible_departments: Optional[str] = "All Departments"
    drive_date: date
    vacancies: Optional[int] = 10

class PlacementDriveResponse(BaseModel):
    id: int
    company_id: int
    title: str
    job_role: str
    package_lpa: Optional[float] = None
    drive_date: date
    current_round: str
    status: str
    vacancies: int

    class Config:
        from_attributes = True

# --- PIPELINE / ROSTER SCHEMAS ---
class AssignCandidatesRequest(BaseModel):
    drive_id: int
    student_ids: List[int]
    initial_stage: Optional[str] = "Assigned"

class UpdateCandidateStageRequest(BaseModel):
    candidate_id: int
    stage: str # Aptitude Test, Technical Interview, Group Discussion, HR Round, Selected, IR, Offer Letter Request, Joined Company Request
    status: str # Passed Round, Pending Review, Processing, Failed or Rejected, Completed
    offered_package_lpa: Optional[float] = None
    offer_letter_status: Optional[str] = None # Pending, Issued, Accepted, Rejected
    note: Optional[str] = None

class CandidateRosterItemResponse(BaseModel):
    id: int
    student_id: int
    register_number: str
    candidate_name: str
    email: str
    department: str
    section: str
    package_lpa: Optional[float] = None
    hiring_stage: str
    drive_status: str
    offer_letter_status: str
    activity_log: List[Dict[str, Any]]

# --- REPORT SCHEMAS ---
class ReportFilterParams(BaseModel):
    academic_year: Optional[str] = "2025-26"
    department: Optional[str] = "All"
    format: Optional[str] = "pdf" # txt, excel, pdf

# --- RECYCLE BIN & SETTINGS ---
class RecycleBinItem(BaseModel):
    id: int
    entity_type: str
    entity_id: int
    entity_name: str
    deleted_by: str
    deleted_at: datetime
    payload: Dict[str, Any]

    class Config:
        from_attributes = True
