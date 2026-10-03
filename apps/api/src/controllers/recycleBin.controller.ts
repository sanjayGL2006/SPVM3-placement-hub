import { Response } from 'express';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';

export class RecycleBinController {
  public static async getAll(req: AuthRequest, res: Response) {
    return res.status(200).json({
      success: true,
      data: mockDb.recycleBin,
      meta: {
        total: mockDb.recycleBin.length,
      },
    });
  }

  public static async restore(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.recycleBin.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in recycle bin',
      });
    }

    const item = mockDb.recycleBin.splice(index, 1)[0]!;

    if (item.entityType === 'STUDENT') {
      const student = mockDb.students.find((s) => s.id === item.entityId);
      if (student) student.isDeleted = false;
    } else if (item.entityType === 'COMPANY') {
      const company = mockDb.companies.find((c) => c.id === item.entityId);
      if (company) company.isDeleted = false;
    } else if (item.entityType === 'DRIVE') {
      const drive = mockDb.drives.find((d) => d.id === item.entityId);
      if (drive) drive.isDeleted = false;
    }

    mockDb.logAudit('RECYCLE_BIN_RESTORE', item.entityType, String(item.entityId), item, req.user);

    return res.status(200).json({
      success: true,
      message: `Restored ${item.entityName} successfully.`,
      data: item,
    });
  }

  public static async hardReset(req: AuthRequest, res: Response) {
    const { confirmation } = req.body;

    if (confirmation !== 'HARD_RESET_CONFIRM') {
      return res.status(400).json({
        success: false,
        message: 'Invalid confirmation string. Expected "HARD_RESET_CONFIRM".',
      });
    }

    const deletedCount = mockDb.recycleBin.length;
    mockDb.recycleBin = [];

    // Permanently remove soft-deleted records from lists
    mockDb.students = mockDb.students.filter((s) => !s.isDeleted);
    mockDb.companies = mockDb.companies.filter((c) => !c.isDeleted);
    mockDb.drives = mockDb.drives.filter((d) => !d.isDeleted);

    mockDb.logAudit('RECYCLE_BIN_HARD_RESET', 'RecycleBin', undefined, { purgedCount: deletedCount }, req.user);

    return res.status(200).json({
      success: true,
      message: `Permanently purged ${deletedCount} records from Recycle Bin.`,
    });
  }
}
