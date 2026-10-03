from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Date,
    Numeric,
    Text,
    ForeignKey,
    JSON,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    PRINCIPAL = "PRINCIPAL"
    HOD = "HOD"
    PLACEMENT_COORDINATOR = "PLACEMENT_COORDINATOR"
    FACULTY = "FACULTY"
    STUDENT = "STUDENT"
    COMPANY_HR = "COMPANY_HR"

class PlacementStatus(str, enum.Enum):
    NOT_PLACED = "NOT_PLACED"
    APPLIED = "APPLIED"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW = "INTERVIEW"
    OFFERED = "OFFERED"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    JOINED = "JOINED"

class DriveStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    UPCOMING = "UPCOMING"
    REGISTRATION_OPEN = "REGISTRATION_OPEN"
    REGISTRATION_CLOSED = "REGISTRATION_CLOSED"
    ASSESSMENT = "ASSESSMENT"
    INTERVIEW = "INTERVIEW"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class PipelineStage(str, enum.Enum):
    INTERESTED = "Interested"
    ASSIGNED = "Assigned"
    APTITUDE_TEST = "Aptitude Test"
    TECHNICAL_INTERVIEW = "Technical Interview"
    GROUP_DISCUSSION = "Group Discussion"
    HR_ROUND = "HR Round"
    SELECTED = "Selected"
    IR = "IR"
    OFFER_LETTER_REQUEST = "Offer Letter Request"
    JOINED_COMPANY_REQUEST = "Joined Company Request"
    REJECTED = "Rejected"

class PipelineStatus(str, enum.Enum):
    PASSED_ROUND = "Passed Round"
    PENDING_REVIEW = "Pending Review"
    PROCESSING = "Processing"
    FAILED_OR_REJECTED = "Failed or Rejected"
    COMPLETED = "Completed"

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    code = Column(String(50), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    courses = relationship("Course", back_populates="department", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="department")
    users = relationship("User", back_populates="department")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50))
    stream = Column(String(100))
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"))

    department = relationship("Department", back_populates="courses")
    students = relationship("Student", back_populates="course")
    users = relationship("User", back_populates="course")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="FACULTY")
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    department = relationship("Department", back_populates="users")
    course = relationship("Course", back_populates="users")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    register_number = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    mobile_number = Column(String(50), nullable=True)
    gender = Column(String(20), default="Male")
    date_of_birth = Column(Date, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    section = Column(String(10), default="A")
    academic_year = Column(String(50), default="2025-26")
    batch = Column(String(50), default="2022-2026")
    semester = Column(Integer, default=6)
    cgpa = Column(Numeric(4, 2), default=7.50)
    percentage = Column(Numeric(5, 2), default=75.00)
    backlogs = Column(Integer, default=0)
    skills = Column(Text, default="JavaScript, Python, React, SQL")
    certifications = Column(Text, default="AWS Cloud Practitioner")
    projects = Column(Text, default="Placement Management Portal")
    resume_url = Column(String(500), nullable=True)
    profile_photo_url = Column(String(500), nullable=True)
    placement_status = Column(String(50), default="NOT_PLACED")
    eligible_status = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False, index=True)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    department = relationship("Department", back_populates="students")
    course = relationship("Course", back_populates="students")
    pipeline_entries = relationship("CandidatePipeline", back_populates="student", cascade="all, delete-orphan")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    industry = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)
    location = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    tier = Column(String(50), default="Core")
    min_package = Column(Numeric(12, 2), default=4.00)
    max_package = Column(Numeric(12, 2), default=8.00)
    avg_package = Column(Numeric(12, 2), default=6.00)
    min_cgpa = Column(Numeric(4, 2), default=6.50)
    allowed_backlogs = Column(Integer, default=0)
    eligible_departments = Column(Text, default="Computer Applications, Science, Commerce")
    required_skills = Column(Text, default="Core Java, Python, Web Development, DSA")
    total_interested_count = Column(Integer, default=45)
    total_hired_count = Column(Integer, default=12)
    is_deleted = Column(Boolean, default=False, index=True)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    drives = relationship("PlacementDrive", back_populates="company", cascade="all, delete-orphan")
    pipeline_entries = relationship("CandidatePipeline", back_populates="company", cascade="all, delete-orphan")

class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    job_role = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=True)
    location = Column(String(255), default="Campus / Virtual")
    package_lpa = Column(Numeric(12, 2), default=7.50)
    min_cgpa = Column(Numeric(4, 2), default=6.50)
    allowed_backlogs = Column(Integer, default=0)
    eligible_departments = Column(Text, default="All Departments")
    required_skills = Column(Text, default="Full Stack, Problem Solving")
    drive_date = Column(Date, default=datetime.utcnow)
    current_round = Column(String(100), default="Aptitude Test")
    status = Column(String(50), default="Ongoing")
    vacancies = Column(Integer, default=15)
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", back_populates="drives")
    candidates = relationship("CandidatePipeline", back_populates="drive", cascade="all, delete-orphan")

class CandidatePipeline(Base):
    __tablename__ = "candidate_pipeline"

    id = Column(Integer, primary_key=True, index=True)
    drive_id = Column(Integer, ForeignKey("placement_drives.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    current_stage = Column(String(100), default="Assigned", index=True)
    stage_status = Column(String(100), default="Processing")
    offered_package_lpa = Column(Numeric(12, 2), nullable=True)
    offer_letter_status = Column(String(50), default="Pending") # Pending, Issued, Accepted, Rejected
    offer_letter_url = Column(String(500), nullable=True)
    joining_date = Column(Date, nullable=True)
    pipeline_activity_log = Column(JSON, default=list) # [{'date': '...', 'stage': '...', 'status': '...', 'note': '...'}]
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    drive = relationship("PlacementDrive", back_populates="candidates")
    student = relationship("Student", back_populates="pipeline_entries")
    company = relationship("Company", back_populates="pipeline_entries")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    entity = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RecycleBin(Base):
    __tablename__ = "recycle_bin"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(100), nullable=False, index=True) # STUDENT, COMPANY, DRIVE
    entity_id = Column(Integer, nullable=False)
    entity_name = Column(String(255), nullable=False)
    payload = Column(JSON, nullable=False)
    deleted_by = Column(String(255), default="System Administrator")
    deleted_at = Column(DateTime, default=datetime.utcnow)
