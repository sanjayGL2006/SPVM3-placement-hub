-- =====================================================================
-- 🎓 Placement Pro — PostgreSQL Enterprise Database Schema
-- Multi-Tenant College Placement & Company Drive Management System
-- =====================================================================

-- 1. ENUM TYPES
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',
    'PRINCIPAL',
    'HOD',
    'PLACEMENT_COORDINATOR',
    'FACULTY',
    'STUDENT',
    'COMPANY_HR'
);

CREATE TYPE placement_status_enum AS ENUM (
    'NOT_PLACED',
    'APPLIED',
    'SHORTLISTED',
    'INTERVIEW',
    'OFFERED',
    'ACCEPTED',
    'DECLINED',
    'JOINED'
);

CREATE TYPE drive_status_enum AS ENUM (
    'DRAFT',
    'UPCOMING',
    'REGISTRATION_OPEN',
    'REGISTRATION_CLOSED',
    'ASSESSMENT',
    'INTERVIEW',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE pipeline_stage_enum AS ENUM (
    'INTERESTED',
    'ASSIGNED',
    'APTITUDE_TEST',
    'TECHNICAL_INTERVIEW',
    'GROUP_DISCUSSION',
    'HR_ROUND',
    'SELECTED',
    'IR',
    'OFFER_LETTER_REQUEST',
    'JOINED_COMPANY_REQUEST',
    'REJECTED'
);

CREATE TYPE pipeline_status_enum AS ENUM (
    'PASSED_ROUND',
    'PENDING_REVIEW',
    'PROCESSING',
    'FAILED_OR_REJECTED',
    'COMPLETED'
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    stream VARCHAR(100),
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. USERS TABLE (Authentication & RBAC)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'FACULTY',
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    register_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(50),
    gender VARCHAR(20),
    date_of_birth DATE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    section VARCHAR(10) DEFAULT 'A',
    academic_year VARCHAR(50) DEFAULT '2025-26',
    batch VARCHAR(50) DEFAULT '2022-2026',
    semester INTEGER DEFAULT 6,
    cgpa NUMERIC(4, 2) DEFAULT 0.00,
    percentage NUMERIC(5, 2) DEFAULT 0.00,
    backlogs INTEGER DEFAULT 0,
    skills TEXT, -- Comma-separated or JSON string
    certifications TEXT, -- JSON string
    projects TEXT, -- JSON string
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    placement_status placement_status_enum DEFAULT 'NOT_PLACED',
    eligible_status BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    website VARCHAR(500),
    location VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    tier VARCHAR(50) DEFAULT 'Core', -- Super Dream (>12 LPA), Dream (7-12 LPA), Core (4-7 LPA), Mass (<4 LPA)
    min_package NUMERIC(12, 2) DEFAULT 0.00,
    max_package NUMERIC(12, 2) DEFAULT 0.00,
    avg_package NUMERIC(12, 2) DEFAULT 0.00,
    min_cgpa NUMERIC(4, 2) DEFAULT 6.00,
    allowed_backlogs INTEGER DEFAULT 0,
    eligible_departments TEXT, -- Comma-separated
    required_skills TEXT,
    total_interested_count INTEGER DEFAULT 0,
    total_hired_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PLACEMENT DRIVES TABLE
CREATE TABLE IF NOT EXISTS placement_drives (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    job_description TEXT,
    location VARCHAR(255),
    package_lpa NUMERIC(12, 2) DEFAULT 0.00,
    min_cgpa NUMERIC(4, 2) DEFAULT 6.00,
    allowed_backlogs INTEGER DEFAULT 0,
    eligible_departments TEXT,
    required_skills TEXT,
    drive_date DATE NOT NULL,
    current_round VARCHAR(100) DEFAULT 'Online Coding Challenge',
    status drive_status_enum DEFAULT 'UPCOMING',
    vacancies INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CANDIDATE PIPELINE ROSTER & APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS candidate_pipeline (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    current_stage pipeline_stage_enum DEFAULT 'ASSIGNED',
    stage_status pipeline_status_enum DEFAULT 'PROCESSING',
    offered_package_lpa NUMERIC(12, 2),
    offer_letter_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Issued', 'Accepted', 'Rejected'
    offer_letter_url VARCHAR(500),
    joining_date DATE,
    pipeline_activity_log JSONB DEFAULT '[]'::jsonb, -- Historical array of stage transitions
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_drive_student UNIQUE (drive_id, student_id)
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. RECYCLE BIN / TRASH RECOVERY TABLE
CREATE TABLE IF NOT EXISTS recycle_bin (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL, -- 'STUDENT', 'COMPANY', 'DRIVE', 'PIPELINE'
    entity_id INTEGER NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL, -- Complete serialized snapshot for 1-click restore
    deleted_by VARCHAR(255) DEFAULT 'System Administrator',
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_students_reg ON students(register_number);
CREATE INDEX IF NOT EXISTS idx_students_dept_sec ON students(department_id, section);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(placement_status);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_tier ON companies(tier);
CREATE INDEX IF NOT EXISTS idx_drives_company ON placement_drives(company_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_drive ON candidate_pipeline(drive_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_student ON candidate_pipeline(student_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stage ON candidate_pipeline(current_stage);
CREATE INDEX IF NOT EXISTS idx_recycle_bin_type ON recycle_bin(entity_type);
