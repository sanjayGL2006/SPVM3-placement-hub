import { Response } from 'express';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';
import { PlacementDriveRecord } from '../types';

export class DriveController {
  public static async getAll(req: AuthRequest, res: Response) {
    const status = req.query.status as string | undefined;
    const search = ((req.query.search as string) || '').toLowerCase().trim();

    let items = mockDb.drives.filter((d) => !d.isDeleted);

    if (status && status !== 'all') {
      items = items.filter((d) => d.status === status);
    }

    if (search) {
      items = items.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          d.companyName.toLowerCase().includes(search) ||
          d.jobRole.toLowerCase().includes(search)
      );
    }

    return res.status(200).json({
      success: true,
      data: items,
      meta: {
        total: items.length,
      },
    });
  }

  public static async getById(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const drive = mockDb.drives.find((d) => d.id === id && !d.isDeleted);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found',
      });
    }

    const applications = mockDb.applications.filter((a) => a.driveId === id);

    return res.status(200).json({
      success: true,
      data: {
        ...drive,
        applications,
      },
    });
  }

  public static async create(req: AuthRequest, res: Response) {
    const data = req.body;
    const company = mockDb.companies.find((c) => c.id === data.companyId);

    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companyId: Company does not exist',
      });
    }

    const newDrive: PlacementDriveRecord = {
      id: mockDb.drives.length > 0 ? Math.max(...mockDb.drives.map((d) => d.id)) + 1 : 1,
      companyId: data.companyId,
      companyName: company.name,
      title: data.title,
      jobRole: data.jobRole,
      jobDescription: data.jobDescription,
      location: data.location || company.location,
      packageAmount: data.packageAmount || company.packageAmount,
      minCgpa: data.minCgpa !== undefined ? data.minCgpa : company.minCgpa,
      allowedBacklogs: data.allowedBacklogs !== undefined ? data.allowedBacklogs : company.allowedBacklogs,
      eligibleDepartments: data.eligibleDepartments || company.eligibleDepartments,
      requiredSkills: data.requiredSkills || company.requiredSkills,
      driveDate: data.driveDate,
      registrationDeadline: data.registrationDeadline,
      testDate: data.testDate,
      interviewDate: data.interviewDate,
      vacancies: data.vacancies || 0,
      selectionProcess: data.selectionProcess,
      status: data.status || 'upcoming',
      applicantCount: 0,
      selectedCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.drives.unshift(newDrive);

    // Auto-create calendar event for the drive
    mockDb.calendarEvents.push({
      id: mockDb.calendarEvents.length + 1,
      title: `${newDrive.companyName} - ${newDrive.title}`,
      description: newDrive.jobDescription,
      eventType: 'DRIVE',
      startDate: `${newDrive.driveDate}T09:00:00.000Z`,
      location: newDrive.location,
      driveId: newDrive.id,
      companyName: newDrive.companyName,
    });

    // Notify students
    mockDb.notifications.unshift({
      id: mockDb.notifications.length + 1,
      title: `🚀 New Drive: ${newDrive.companyName}`,
      message: `${newDrive.title} announced for ${newDrive.jobRole} (${newDrive.packageAmount ? newDrive.packageAmount + ' LPA' : 'Competitive'}). Check eligibility!`,
      type: 'drive',
      isRead: false,
      link: '/placements',
      createdAt: new Date().toISOString(),
    });

    mockDb.logAudit('DRIVE_CREATE', 'PlacementDrive', String(newDrive.id), newDrive, req.user);

    return res.status(201).json({
      success: true,
      message: 'Placement drive scheduled successfully',
      data: newDrive,
    });
  }

  public static async update(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.drives.findIndex((d) => d.id === id && !d.isDeleted);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found',
      });
    }

    const current = mockDb.drives[index]!;
    const data = req.body;

    const updated: PlacementDriveRecord = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockDb.drives[index] = updated;
    mockDb.logAudit('DRIVE_UPDATE', 'PlacementDrive', String(id), { old: current, new: updated }, req.user);

    return res.status(200).json({
      success: true,
      message: 'Placement drive updated successfully',
      data: updated,
    });
  }

  public static async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.drives.findIndex((d) => d.id === id && !d.isDeleted);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found',
      });
    }

    const drive = mockDb.drives[index]!;
    drive.isDeleted = true;

    mockDb.recycleBin.unshift({
      id: mockDb.recycleBin.length + 1,
      entityType: 'DRIVE',
      entityId: drive.id,
      entityName: `${drive.companyName} (${drive.title})`,
      payload: drive,
      deletedBy: req.user?.email || 'admin',
      deletedAt: new Date().toISOString(),
    });

    mockDb.logAudit('DRIVE_SOFT_DELETE', 'PlacementDrive', String(id), drive, req.user);

    return res.status(200).json({
      success: true,
      message: 'Placement drive moved to recycle bin',
    });
  }
}
