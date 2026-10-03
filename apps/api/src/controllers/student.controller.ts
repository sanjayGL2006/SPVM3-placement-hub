import { Response } from 'express';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';
import { StudentRecord } from '../types';

export class StudentController {
  public static async getAll(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const search = ((req.query.search as string) || '').toLowerCase().trim();
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
    const status = req.query.status as string | undefined;
    const minCgpa = req.query.minCgpa ? parseFloat(req.query.minCgpa as string) : undefined;
    const batch = req.query.batch as string | undefined;

    let items = mockDb.students.filter((s) => !s.isDeleted);

    // RBAC: If HOD or Coordinator, restrict to assigned department unless Principal
    if (req.user && req.user.role === 'HOD' && req.user.departmentId) {
      items = items.filter((s) => s.departmentId === req.user?.departmentId);
    } else if (departmentId) {
      items = items.filter((s) => s.departmentId === departmentId);
    }

    if (search) {
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.registerNumber.toLowerCase().includes(search) ||
          (s.email && s.email.toLowerCase().includes(search)) ||
          s.skills.some((sk) => sk.toLowerCase().includes(search))
      );
    }

    if (status && status !== 'all') {
      items = items.filter((s) => s.placementStatus === status);
    }

    if (minCgpa !== undefined && !isNaN(minCgpa)) {
      items = items.filter((s) => (s.cgpa || 0) >= minCgpa);
    }

    if (batch) {
      items = items.filter((s) => s.batch === batch);
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      success: true,
      data: paginatedItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  public static async getById(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const student = mockDb.students.find((s) => s.id === id && !s.isDeleted);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  }

  public static async create(req: AuthRequest, res: Response) {
    const data = req.body;

    const existing = mockDb.students.find(
      (s) => s.registerNumber.toLowerCase() === data.registerNumber.toLowerCase() && !s.isDeleted
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Student with Register Number ${data.registerNumber} already exists.`,
      });
    }

    const dept = mockDb.departments.find((d) => d.id === data.departmentId);

    const newStudent: StudentRecord = {
      id: mockDb.students.length > 0 ? Math.max(...mockDb.students.map((s) => s.id)) + 1 : 1,
      registerNumber: data.registerNumber,
      name: data.name,
      email: data.email,
      mobileNumber: data.mobileNumber,
      gender: data.gender,
      departmentId: data.departmentId,
      departmentName: dept?.name,
      courseId: data.courseId,
      courseName: dept?.name,
      section: data.section || 'A',
      academicYear: data.academicYear || '2025-2026',
      batch: data.batch || '2023-2026',
      semester: data.semester || 6,
      cgpa: data.cgpa,
      percentage: data.percentage || (data.cgpa ? parseFloat((data.cgpa * 9.5).toFixed(1)) : undefined),
      backlogs: data.backlogs || 0,
      skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',').map((s: string) => s.trim()) : []),
      placementStatus: data.placementStatus || 'not_placed',
      eligibleStatus: (data.backlogs || 0) === 0 && (!data.cgpa || data.cgpa >= 6.0),
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.students.unshift(newStudent);
    mockDb.logAudit('STUDENT_CREATE', 'Student', String(newStudent.id), newStudent, req.user);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: newStudent,
    });
  }

  public static async update(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.students.findIndex((s) => s.id === id && !s.isDeleted);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const current = mockDb.students[index]!;
    const data = req.body;

    const updated: StudentRecord = {
      ...current,
      ...data,
      skills: Array.isArray(data.skills)
        ? data.skills
        : typeof data.skills === 'string'
        ? data.skills.split(',').map((s: string) => s.trim())
        : current.skills,
      updatedAt: new Date().toISOString(),
    };

    mockDb.students[index] = updated;
    mockDb.logAudit('STUDENT_UPDATE', 'Student', String(id), { old: current, new: updated }, req.user);

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updated,
    });
  }

  public static async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.students.findIndex((s) => s.id === id && !s.isDeleted);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const student = mockDb.students[index]!;
    student.isDeleted = true;

    // Add to Recycle Bin
    mockDb.recycleBin.unshift({
      id: mockDb.recycleBin.length + 1,
      entityType: 'STUDENT',
      entityId: student.id,
      entityName: `${student.name} (${student.registerNumber})`,
      payload: student,
      deletedBy: req.user?.email || 'admin',
      deletedAt: new Date().toISOString(),
    });

    mockDb.logAudit('STUDENT_SOFT_DELETE', 'Student', String(id), student, req.user);

    return res.status(200).json({
      success: true,
      message: 'Student moved to recycle bin successfully',
    });
  }

  public static async bulkCreate(req: AuthRequest, res: Response) {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No student records provided',
      });
    }

    let inserted = 0;
    for (const item of students) {
      const existing = mockDb.students.find(
        (s) => s.registerNumber.toLowerCase() === item.registerNumber?.toLowerCase() && !s.isDeleted
      );
      if (!existing && item.registerNumber && item.name) {
        const dept = mockDb.departments.find((d) => d.id === item.departmentId || d.name === item.departmentName);
        mockDb.students.unshift({
          id: mockDb.students.length + 1,
          registerNumber: item.registerNumber,
          name: item.name,
          email: item.email,
          mobileNumber: item.mobileNumber,
          gender: item.gender || 'Male',
          departmentId: dept ? dept.id : 1,
          departmentName: dept ? dept.name : 'Computer Applications (BCA)',
          section: item.section || 'A',
          academicYear: item.academicYear || '2025-2026',
          batch: item.batch || '2023-2026',
          semester: item.semester || 6,
          cgpa: item.cgpa || 7.5,
          percentage: item.percentage || 71.2,
          backlogs: item.backlogs || 0,
          skills: Array.isArray(item.skills) ? item.skills : (item.skills ? item.skills.split(',') : []),
          placementStatus: item.placementStatus || 'not_placed',
          eligibleStatus: (item.backlogs || 0) === 0,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        inserted++;
      }
    }

    mockDb.logAudit('STUDENT_BULK_IMPORT', 'Student', undefined, { count: inserted }, req.user);

    return res.status(200).json({
      success: true,
      message: `Successfully imported ${inserted} student records.`,
      data: { count: inserted },
    });
  }
}
