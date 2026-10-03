from database import SessionLocal, engine, Base
import models
from datetime import datetime, date
import random

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(models.Department).count() > 0:
            print("Database already contains records. Skipping initial seeding.")
            return

        print("Seeding PostgreSQL database with college placement ecosystem...")

        # 1. Departments
        departments = [
            models.Department(name="Computer Applications", code="BCA"),
            models.Department(name="Business Administration", code="BBA"),
            models.Department(name="Commerce", code="BCOM"),
            models.Department(name="Science", code="BSC"),
            models.Department(name="Hotel Management", code="BHM"),
        ]
        db.add_all(departments)
        db.commit()

        # 2. Courses
        courses = [
            models.Course(name="BCA", code="BCA-01", stream="Computer Applications", department_id=departments[0].id),
            models.Course(name="BBA", code="BBA-01", stream="Management", department_id=departments[1].id),
            models.Course(name="B.Com", code="BCOM-01", stream="Commerce", department_id=departments[2].id),
            models.Course(name="B.Sc Computer Science", code="BSC-01", stream="Computer Science", department_id=departments[3].id),
            models.Course(name="BBA Hotel Management", code="BHM-01", stream="Hospitality", department_id=departments[4].id),
        ]
        db.add_all(courses)
        db.commit()

        # 3. Companies & Drives
        company_data = [
            ("Google", "Technology & Cloud", "https://google.com", "Mountain View, CA", "Super Dream (> 12 LPA)", 18.0, 32.0, 24.0, 8.5, "Associate Cloud Engineer"),
            ("Microsoft", "Enterprise Software", "https://microsoft.com", "Redmond, WA", "Super Dream (> 12 LPA)", 16.0, 28.0, 21.5, 8.0, "Software Development Engineer"),
            ("Amazon", "E-Commerce & AWS", "https://amazon.com", "Seattle, WA", "Super Dream (> 12 LPA)", 14.0, 24.0, 18.0, 7.5, "Cloud Support Associate"),
            ("Deloitte", "Consulting & Audit", "https://deloitte.com", "London / India", "Dream (7 - 12 LPA)", 7.5, 11.5, 9.0, 7.0, "Analyst - Technology Consulting"),
            ("Goldman Sachs", "Investment Banking", "https://goldmansachs.com", "New York, NY", "Super Dream (> 12 LPA)", 15.0, 25.0, 20.0, 8.2, "Operations & Tech Analyst"),
            ("Tata Consultancy Services (TCS)", "IT Services & Consulting", "https://tcs.com", "Mumbai, India", "Core (4 - 7 LPA)", 4.0, 7.5, 5.5, 6.0, "TCS Digital / Prime Developer"),
            ("Infosys", "IT Services & Next-Gen Digital", "https://infosys.com", "Bangalore, India", "Core (4 - 7 LPA)", 4.0, 8.0, 6.0, 6.0, "Specialist Programmer"),
            ("Wipro", "Technology Services & Consulting", "https://wipro.com", "Bangalore, India", "Core (4 - 7 LPA)", 3.8, 6.5, 5.0, 6.0, "Project Engineer"),
            ("HDFC Bank", "Banking & Financial Services", "https://hdfcbank.com", "Mumbai, India", "Dream (7 - 12 LPA)", 6.5, 9.5, 8.0, 6.5, "Management Trainee"),
            ("Marriott International", "Luxury Hospitality", "https://marriott.com", "Bethesda, MD", "Core (4 - 7 LPA)", 4.5, 7.0, 5.5, 6.0, "Hotel Operations Trainee"),
        ]

        created_companies = []
        for name, ind, web, loc, tier, min_p, max_p, avg_p, cgpa_cut, role in company_data:
            comp = models.Company(
                name=name,
                industry=ind,
                website=web,
                location=loc,
                tier=tier,
                min_package=min_p,
                max_package=max_p,
                avg_package=avg_p,
                min_cgpa=cgpa_cut,
                total_interested_count=random.randint(40, 85),
                total_hired_count=random.randint(5, 20)
            )
            db.add(comp)
            created_companies.append((comp, role, avg_p))
        db.commit()

        # 4. Placement Drives for each company
        created_drives = []
        for comp, role, avg_p in created_companies:
            drive = models.PlacementDrive(
                company_id=comp.id,
                title=f"{comp.name} On-Campus Recruitment Drive 2026",
                job_role=role,
                package_lpa=avg_p,
                min_cgpa=comp.min_cgpa,
                drive_date=date(2026, 3, random.randint(10, 28)),
                current_round="Aptitude Test",
                status="Ongoing",
                vacancies=random.randint(10, 30)
            )
            db.add(drive)
            created_drives.append(drive)
        db.commit()

        # 5. Students (generate 50 students across departments and sections)
        first_names = ["Aarav", "Diya", "Rohan", "Ananya", "Vikram", "Sneha", "Karan", "Pooja", "Arjun", "Meera", "Siddharth", "Ishita", "Aditya", "Rhea", "Nikhil", "Tanvi"]
        last_names = ["Sharma", "Patel", "Verma", "Iyer", "Reddy", "Nair", "Gupta", "Kulkarni", "Deshmukh", "Chopra", "Menon", "Joshi"]

        created_students = []
        for i in range(1, 51):
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            name = f"{fn} {ln}"
            dept = random.choice(departments)
            sec = random.choice(["A", "B", "C"])
            reg = f"22BCA{str(i).zfill(3)}" if dept.code == "BCA" else f"22{dept.code}{str(i).zfill(3)}"
            cgpa = round(random.uniform(6.5, 9.8), 2)
            
            student = models.Student(
                register_number=reg,
                name=name,
                email=f"{fn.lower()}.{ln.lower()}{i}@college.edu",
                mobile_number=f"+91 98{random.randint(10000000, 99999999)}",
                gender="Male" if i % 2 == 0 else "Female",
                department_id=dept.id,
                course_id=courses[0].id if dept.code == "BCA" else courses[1].id,
                section=sec,
                academic_year="2025-26",
                batch="2022-2026",
                semester=6,
                cgpa=cgpa,
                percentage=round(cgpa * 9.5, 1),
                backlogs=0 if cgpa > 7.0 else random.randint(0, 1),
                skills="Python, React, SQL, Problem Solving",
                placement_status="PLACED" if i <= 15 else ("SHORTLISTED" if i <= 30 else "NOT_PLACED")
            )
            db.add(student)
            created_students.append(student)
        db.commit()

        # 6. Candidate Pipeline Roster entries
        stages = [
            ("Assigned", "Processing", "Pending"),
            ("Aptitude Test", "Passed Round", "Pending"),
            ("Technical Interview", "Processing", "Pending"),
            ("HR Round", "Passed Round", "Pending"),
            ("Selected", "Completed", "Issued"),
            ("Offer Letter Request", "Completed", "Issued"),
            ("Joined Company Request", "Completed", "Joined"),
        ]

        for drive in created_drives:
            # Assign 8-12 students to each drive
            assigned_subset = random.sample(created_students, random.randint(8, 12))
            for st in assigned_subset:
                stage_choice = random.choice(stages)
                pipeline_entry = models.CandidatePipeline(
                    drive_id=drive.id,
                    student_id=st.id,
                    company_id=drive.company_id,
                    current_stage=stage_choice[0],
                    stage_status=stage_choice[1],
                    offered_package_lpa=drive.package_lpa,
                    offer_letter_status=stage_choice[2],
                    pipeline_activity_log=[
                        {"date": "2026-03-01 10:00", "stage": "Assigned", "status": "Processing", "note": "Assigned to drive by Admin"},
                        {"date": "2026-03-05 14:30", "stage": stage_choice[0], "status": stage_choice[1], "note": f"Evaluated for {stage_choice[0]}"}
                    ],
                    notes="Verified candidate profile"
                )
                db.add(pipeline_entry)
        db.commit()

        print("Successfully seeded PostgreSQL database with 5 departments, 10 companies, drives, and student pipeline records!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
