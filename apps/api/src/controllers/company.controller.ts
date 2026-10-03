import { Response } from 'express';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';
import { CompanyRecord } from '../types';

export class CompanyController {
  public static async getAll(req: AuthRequest, res: Response) {
    const search = ((req.query.search as string) || '').toLowerCase().trim();
    const tier = req.query.tier as string | undefined;
    const department = req.query.department as string | undefined;

    let items = mockDb.companies.filter((c) => !c.isDeleted);

    if (search) {
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.jobRole.toLowerCase().includes(search) ||
          (c.industry && c.industry.toLowerCase().includes(search)) ||
          (c.location && c.location.toLowerCase().includes(search))
      );
    }

    if (tier && tier !== 'all') {
      items = items.filter((c) => c.tier.toLowerCase() === tier.toLowerCase());
    }

    if (department && department !== 'all') {
      items = items.filter((c) =>
        c.eligibleDepartments.some((d) => d.toLowerCase() === department.toLowerCase())
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
    const company = mockDb.companies.find((c) => c.id === id && !c.isDeleted);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Include recent drives and placements for this company
    const drives = mockDb.drives.filter((d) => d.companyId === id && !d.isDeleted);
    const placedStudents = mockDb.students.filter(
      (s) => s.companyName === company.name && !s.isDeleted
    );

    return res.status(200).json({
      success: true,
      data: {
        ...company,
        drives,
        placedStudents,
      },
    });
  }

  public static async create(req: AuthRequest, res: Response) {
    const data = req.body;

    const newCompany: CompanyRecord = {
      id: mockDb.companies.length > 0 ? Math.max(...mockDb.companies.map((c) => c.id)) + 1 : 1,
      name: data.name,
      industry: data.industry,
      website: data.website,
      location: data.location,
      hrName: data.hrName,
      hrEmail: data.hrEmail,
      hrContactNumber: data.hrContactNumber,
      jobRole: data.jobRole,
      packageAmount: data.packageAmount,
      minPackage: data.minPackage,
      maxPackage: data.maxPackage,
      avgPackage: data.avgPackage || data.packageAmount,
      eligibleDepartments: Array.isArray(data.eligibleDepartments)
        ? data.eligibleDepartments
        : typeof data.eligibleDepartments === 'string'
        ? data.eligibleDepartments.split(',').map((d: string) => d.trim())
        : [],
      minCgpa: data.minCgpa || 6.0,
      allowedBacklogs: data.allowedBacklogs || 0,
      requiredSkills: Array.isArray(data.requiredSkills)
        ? data.requiredSkills
        : typeof data.requiredSkills === 'string'
        ? data.requiredSkills.split(',').map((s: string) => s.trim())
        : [],
      hiringCount: data.hiringCount || 0,
      tier: data.tier || 'Core',
      visitDate: data.visitDate,
      venue: data.venue,
      lastDate: data.lastDate,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.companies.unshift(newCompany);
    mockDb.logAudit('COMPANY_CREATE', 'Company', String(newCompany.id), newCompany, req.user);

    return res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      data: newCompany,
    });
  }

  public static async update(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.companies.findIndex((c) => c.id === id && !c.isDeleted);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const current = mockDb.companies[index]!;
    const data = req.body;

    const updated: CompanyRecord = {
      ...current,
      ...data,
      eligibleDepartments: Array.isArray(data.eligibleDepartments)
        ? data.eligibleDepartments
        : current.eligibleDepartments,
      requiredSkills: Array.isArray(data.requiredSkills)
        ? data.requiredSkills
        : current.requiredSkills,
      updatedAt: new Date().toISOString(),
    };

    mockDb.companies[index] = updated;
    mockDb.logAudit('COMPANY_UPDATE', 'Company', String(id), { old: current, new: updated }, req.user);

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      data: updated,
    });
  }

  public static async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.companies.findIndex((c) => c.id === id && !c.isDeleted);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const company = mockDb.companies[index]!;
    company.isDeleted = true;

    mockDb.recycleBin.unshift({
      id: mockDb.recycleBin.length + 1,
      entityType: 'COMPANY',
      entityId: company.id,
      entityName: company.name,
      payload: company,
      deletedBy: req.user?.email || 'admin',
      deletedAt: new Date().toISOString(),
    });

    mockDb.logAudit('COMPANY_SOFT_DELETE', 'Company', String(id), company, req.user);

    return res.status(200).json({
      success: true,
      message: 'Company moved to recycle bin successfully',
    });
  }
}
