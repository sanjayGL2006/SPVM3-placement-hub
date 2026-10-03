import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { mockDb } from '../mock/mockStore';

export class ReportController {
  public static async exportStudentsCsv(req: Request, res: Response) {
    const students = mockDb.students.filter((s) => !s.isDeleted);

    const rows = students.map((s) => ({
      'Register Number': s.registerNumber,
      Name: s.name,
      Email: s.email || '',
      Phone: s.mobileNumber || '',
      Department: s.departmentName || '',
      Section: s.section || '',
      Batch: s.batch || '',
      CGPA: s.cgpa || '',
      Backlogs: s.backlogs,
      Skills: s.skills.join(', '),
      Status: s.placementStatus,
      Company: s.companyName || '',
      'Package (LPA)': s.packageAmount || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=placement_students_export.csv');
    return res.status(200).send(csv);
  }

  public static async exportStudentsExcel(req: Request, res: Response) {
    const students = mockDb.students.filter((s) => !s.isDeleted);

    const rows = students.map((s) => ({
      'Register Number': s.registerNumber,
      Name: s.name,
      Email: s.email || '',
      Phone: s.mobileNumber || '',
      Department: s.departmentName || '',
      Section: s.section || '',
      Batch: s.batch || '',
      CGPA: s.cgpa || '',
      Backlogs: s.backlogs,
      Skills: s.skills.join(', '),
      Status: s.placementStatus,
      Company: s.companyName || '',
      'Package (LPA)': s.packageAmount || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=placement_students_export.xlsx');
    return res.status(200).send(buffer);
  }

  public static async exportCompaniesExcel(req: Request, res: Response) {
    const companies = mockDb.companies.filter((c) => !c.isDeleted);

    const rows = companies.map((c) => ({
      'Company Name': c.name,
      Industry: c.industry || '',
      Location: c.location || '',
      'Job Role': c.jobRole,
      'Package (LPA)': c.packageAmount || '',
      'Eligible Depts': c.eligibleDepartments.join(', '),
      'Min CGPA': c.minCgpa,
      Tier: c.tier,
      'Hiring Count': c.hiringCount,
      'HR Contact': `${c.hrName || ''} (${c.hrEmail || ''})`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruiters');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=placement_recruiters_export.xlsx');
    return res.status(200).send(buffer);
  }
}
