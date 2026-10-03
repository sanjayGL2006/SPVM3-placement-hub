import { Response } from 'express';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';
import { ApplicationRecord } from '../types';

export class ApplicationController {
  public static async getAll(req: AuthRequest, res: Response) {
    const driveId = req.query.driveId ? Number(req.query.driveId) : undefined;
    const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
    const status = req.query.status as string | undefined;

    let items = [...mockDb.applications];

    // If logged in as student, restrict to own applications
    if (req.user && req.user.role === 'STUDENT') {
      const student = mockDb.students.find((s) => s.email?.toLowerCase() === req.user?.email.toLowerCase());
      if (student) {
        items = items.filter((a) => a.studentId === student.id);
      }
    } else if (studentId) {
      items = items.filter((a) => a.studentId === studentId);
    }

    if (driveId) {
      items = items.filter((a) => a.driveId === driveId);
    }

    if (status && status !== 'all') {
      items = items.filter((a) => a.status === status);
    }

    return res.status(200).json({
      success: true,
      data: items,
      meta: {
        total: items.length,
      },
    });
  }

  public static async apply(req: AuthRequest, res: Response) {
    const { driveId, resumeUrl, notes } = req.body;
    let targetStudentId = req.body.studentId;

    if (req.user && req.user.role === 'STUDENT') {
      const currentStudent = mockDb.students.find(
        (s) => s.email?.toLowerCase() === req.user?.email.toLowerCase()
      );
      if (!currentStudent) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found for this user account',
        });
      }
      targetStudentId = currentStudent.id;
    }

    if (!targetStudentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId is required',
      });
    }

    const drive = mockDb.drives.find((d) => d.id === driveId && !d.isDeleted);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found',
      });
    }

    const student = mockDb.students.find((s) => s.id === targetStudentId && !s.isDeleted);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check existing application
    const existing = mockDb.applications.find(
      (a) => a.driveId === driveId && a.studentId === targetStudentId
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this placement drive',
      });
    }

    // Eligibility check
    const minCgpa = drive.minCgpa || 0;
    if (student.cgpa && student.cgpa < minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Eligibility failed: Minimum CGPA required is ${minCgpa}. Your CGPA is ${student.cgpa}.`,
      });
    }

    if (student.backlogs > drive.allowedBacklogs) {
      return res.status(400).json({
        success: false,
        message: `Eligibility failed: Maximum allowed backlogs is ${drive.allowedBacklogs}. You have ${student.backlogs}.`,
      });
    }

    const newApplication: ApplicationRecord = {
      id: mockDb.applications.length > 0 ? Math.max(...mockDb.applications.map((a) => a.id)) + 1 : 1,
      driveId: drive.id,
      driveTitle: drive.title,
      companyName: drive.companyName,
      studentId: student.id,
      studentName: student.name,
      registerNumber: student.registerNumber,
      departmentName: student.departmentName,
      resumeUrl: resumeUrl || student.resumeUrl,
      status: 'applied',
      interviewRound: 1,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.applications.unshift(newApplication);
    drive.applicantCount = (drive.applicantCount || 0) + 1;

    mockDb.logAudit('APPLICATION_SUBMIT', 'Application', String(newApplication.id), newApplication, req.user);

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: newApplication,
    });
  }

  public static async updateStatus(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const { status, interviewRound, notes } = req.body;

    const appIndex = mockDb.applications.findIndex((a) => a.id === id);
    if (appIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const app = mockDb.applications[appIndex]!;
    app.status = status;
    if (interviewRound !== undefined) app.interviewRound = interviewRound;
    if (notes !== undefined) app.notes = notes;
    app.updatedAt = new Date().toISOString();

    // If selected or offered, update student's global placement status
    if (status === 'selected' || status === 'offered') {
      const student = mockDb.students.find((s) => s.id === app.studentId);
      if (student) {
        student.placementStatus = 'selected';
        student.companyName = app.companyName;
        const drive = mockDb.drives.find((d) => d.id === app.driveId);
        if (drive && drive.packageAmount) {
          student.packageAmount = drive.packageAmount;
        }
      }
    }

    mockDb.logAudit('APPLICATION_STATUS_UPDATE', 'Application', String(id), { status, interviewRound }, req.user);

    return res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: app,
    });
  }
}
