-- =====================================================================
-- SPVM3 Placement Pro — Supabase PostgreSQL Schema & RLS Policies Migration
-- =====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'developer', 'principal', 'admin', 'hod', 'coordinator', 'faculty', 'student'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pipeline_stage_type AS ENUM (
        'Applied', 'Aptitude Test', 'Technical Interview', 'HR Fit', 'Offer Letter Issued', 'Offer Accepted', 'Rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role user_role_type NOT NULL DEFAULT 'student',
    department VARCHAR(100),
    course VARCHAR(100),
    section VARCHAR(10),
    academic_year VARCHAR(50) DEFAULT '2025-26',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    register_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    mobile_number VARCHAR(50),
    gender VARCHAR(20),
    date_of_birth DATE,
    department VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    section VARCHAR(10) DEFAULT 'A',
    academic_year VARCHAR(50) DEFAULT '2025-26',
    batch VARCHAR(50) DEFAULT '2022-2026',
    semester INTEGER DEFAULT 6,
    cgpa NUMERIC(4, 2) DEFAULT 0.00,
    percentage NUMERIC(5, 2) DEFAULT 0.00,
    backlogs INTEGER DEFAULT 0,
    skills TEXT[],
    certifications JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    placement_status VARCHAR(50) DEFAULT 'NOT_PLACED',
    eligible_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    industry VARCHAR(255),
    website VARCHAR(500),
    location VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    tier VARCHAR(50) DEFAULT 'Core',
    min_package NUMERIC(12, 2) DEFAULT 0.00,
    max_package NUMERIC(12, 2) DEFAULT 0.00,
    avg_package NUMERIC(12, 2) DEFAULT 0.00,
    min_cgpa NUMERIC(4, 2) DEFAULT 6.00,
    allowed_backlogs INTEGER DEFAULT 0,
    eligible_departments TEXT[],
    required_skills TEXT[],
    total_interested_count INTEGER DEFAULT 0,
    total_hired_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PLACEMENT DRIVES TABLE
CREATE TABLE IF NOT EXISTS public.placement_drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    job_description TEXT,
    campus_visit_date DATE NOT NULL,
    campus_visit_time TIME WITHOUT TIME ZONE DEFAULT '09:00:00',
    venue VARCHAR(255) DEFAULT 'Main Campus Auditorium',
    package_lpa NUMERIC(12, 2) DEFAULT 0.00,
    min_cgpa NUMERIC(4, 2) DEFAULT 6.00,
    allowed_backlogs INTEGER DEFAULT 0,
    eligible_departments TEXT[],
    required_skills TEXT[],
    current_round VARCHAR(100) DEFAULT 'Aptitude Test',
    status VARCHAR(50) DEFAULT 'Upcoming',
    vacancies INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DRIVE APPLICATIONS TABLE (Per-student pipeline stage)
CREATE TABLE IF NOT EXISTS public.drive_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id UUID NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    current_stage pipeline_stage_type DEFAULT 'Applied',
    stage_status VARCHAR(50) DEFAULT 'Processing',
    offered_package_lpa NUMERIC(12, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_drive_student UNIQUE (drive_id, student_id)
);

-- 7. STAGE HISTORY AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.drive_applications(id) ON DELETE CASCADE,
    drive_id UUID NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    previous_stage pipeline_stage_type,
    new_stage pipeline_stage_type NOT NULL,
    changed_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changed_by_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    parsed_skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. RESUME ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.resume_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    skills_found TEXT[],
    missing_skills TEXT[],
    section_feedback JSONB DEFAULT '{}'::jsonb,
    suggestions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    drive_id UUID NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    offered_package_lpa NUMERIC(12, 2) NOT NULL,
    offer_letter_status VARCHAR(50) DEFAULT 'Issued', -- 'Issued', 'Accepted', 'Declined'
    offer_letter_url VARCHAR(500),
    joining_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    report_type VARCHAR(100) NOT NULL,
    report_data JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_students_dept ON public.students(department);
CREATE INDEX IF NOT EXISTS idx_students_reg ON public.students(register_number);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_drives_company ON public.placement_drives(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_drive ON public.drive_applications(drive_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.drive_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_stage ON public.drive_applications(current_stage);
CREATE INDEX IF NOT EXISTS idx_stage_history_app ON public.stage_history(application_id);
CREATE INDEX IF NOT EXISTS idx_resumes_student ON public.resumes(student_id);
CREATE INDEX IF NOT EXISTS idx_analyses_student ON public.resume_analyses(student_id);

-- 13. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 14. HELPER FUNCTION TO GET LOGGED IN USER ROLE & DEPARTMENT
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role_type AS $$
DECLARE
    u_role user_role_type;
BEGIN
    SELECT role INTO u_role FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(u_role, 'student'::user_role_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_user_department()
RETURNS VARCHAR AS $$
DECLARE
    u_dept VARCHAR;
BEGIN
    SELECT department INTO u_dept FROM public.profiles WHERE id = auth.uid();
    RETURN u_dept;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. RLS POLICIES

-- PROFILES POLICIES
CREATE POLICY "Profiles view policy" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator', 'faculty') AND department = public.get_current_user_department())
    );

CREATE POLICY "Profiles management policy" ON public.profiles
    FOR ALL USING (
        auth.uid() = id OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin')
    );

-- STUDENTS POLICIES
CREATE POLICY "Students view policy" ON public.students
    FOR SELECT USING (
        user_id = auth.uid() OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator', 'faculty') AND department = public.get_current_user_department())
    );

CREATE POLICY "Students manage policy" ON public.students
    FOR ALL USING (
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator') AND department = public.get_current_user_department())
    );

-- COMPANIES & DRIVES POLICIES
CREATE POLICY "Companies view policy" ON public.companies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Companies manage policy" ON public.companies
    FOR ALL USING (
        public.get_current_user_role() IN ('developer', 'principal', 'admin', 'coordinator')
    );

CREATE POLICY "Drives view policy" ON public.placement_drives
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Drives manage policy" ON public.placement_drives
    FOR ALL USING (
        public.get_current_user_role() IN ('developer', 'principal', 'admin', 'coordinator', 'hod')
    );

-- DRIVE APPLICATIONS POLICIES (STUDENT PIPELINE)
CREATE POLICY "Applications view policy" ON public.drive_applications
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator', 'faculty') AND 
         student_id IN (SELECT id FROM public.students WHERE department = public.get_current_user_department()))
    );

CREATE POLICY "Applications insert policy" ON public.drive_applications
    FOR INSERT WITH CHECK (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin', 'hod', 'coordinator')
    );

CREATE POLICY "Applications update policy" ON public.drive_applications
    FOR UPDATE USING (
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator') AND 
         student_id IN (SELECT id FROM public.students WHERE department = public.get_current_user_department()))
    );

-- STAGE HISTORY POLICIES
CREATE POLICY "Stage history view policy" ON public.stage_history
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator', 'faculty') AND 
         student_id IN (SELECT id FROM public.students WHERE department = public.get_current_user_department()))
    );

CREATE POLICY "Stage history insert policy" ON public.stage_history
    FOR INSERT WITH CHECK (
        public.get_current_user_role() IN ('developer', 'principal', 'admin', 'hod', 'coordinator')
    );

-- RESUMES & ANALYSES POLICIES
CREATE POLICY "Resumes view policy" ON public.resumes
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator', 'faculty') AND 
         student_id IN (SELECT id FROM public.students WHERE department = public.get_current_user_department()))
    );

CREATE POLICY "Resumes manage policy" ON public.resumes
    FOR ALL USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin')
    );

CREATE POLICY "Resume analyses view policy" ON public.resume_analyses
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator', 'faculty') AND 
         student_id IN (SELECT id FROM public.students WHERE department = public.get_current_user_department()))
    );

-- REPORTS POLICIES
CREATE POLICY "Reports view policy" ON public.reports
    FOR SELECT USING (
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator', 'faculty') AND department = public.get_current_user_department())
    );

CREATE POLICY "Reports manage policy" ON public.reports
    FOR ALL USING (
        public.get_current_user_role() IN ('developer', 'principal', 'admin') OR
        (public.get_current_user_role() IN ('hod', 'coordinator') AND department = public.get_current_user_department())
    );
