import { Request, Response } from 'express';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';

export class DashboardController {
  public static async getStats(req: AuthRequest, res: Response) {
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;

    let students = mockDb.students.filter((s) => !s.isDeleted);
    if (departmentId) {
      students = students.filter((s) => s.departmentId === departmentId);
    } else if (req.user && req.user.role === 'HOD' && req.user.departmentId) {
      students = students.filter((s) => s.departmentId === req.user?.departmentId);
    }

    const totalStudents = students.length;
    const placedStudents = students.filter(
      (s) => s.placementStatus === 'selected' || s.placementStatus === 'offered' || s.placementStatus === 'joined' || s.placementStatus === 'accepted'
    ).length;
    const unplacedStudents = totalStudents - placedStudents;
    const placementRate = totalStudents > 0 ? parseFloat(((placedStudents / totalStudents) * 100).toFixed(1)) : 0;

    const companies = mockDb.companies.filter((c) => !c.isDeleted);
    const totalCompanies = companies.length;
    const activeDrives = mockDb.drives.filter((d) => !d.isDeleted && d.status !== 'completed' && d.status !== 'cancelled').length;

    const placedWithPkg = students.filter((s) => s.packageAmount && s.packageAmount > 0);
    const packages = placedWithPkg.map((s) => s.packageAmount as number);

    const highestPackage = packages.length > 0 ? Math.max(...packages) : 28.5;
    const lowestPackage = packages.length > 0 ? Math.min(...packages) : 3.8;
    const avgPackage = packages.length > 0
      ? parseFloat((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2))
      : 8.4;
    const totalCompensation = packages.length > 0
      ? parseFloat(packages.reduce((a, b) => a + b, 0).toFixed(2))
      : 0;

    // Department Breakdown
    const departmentBreakdown = mockDb.departments.map((dept) => {
      const deptStudents = mockDb.students.filter((s) => s.departmentId === dept.id && !s.isDeleted);
      const placed = deptStudents.filter(
        (s) => s.placementStatus === 'selected' || s.placementStatus === 'offered' || s.placementStatus === 'joined'
      ).length;
      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        total: deptStudents.length,
        placed,
        unplaced: deptStudents.length - placed,
        percentage: deptStudents.length > 0 ? parseFloat(((placed / deptStudents.length) * 100).toFixed(1)) : 0,
      };
    });

    // Salary Tiers Breakdown
    const tiers = {
      superDream: students.filter((s) => s.packageAmount && s.packageAmount >= 15.0).length,
      dream: students.filter((s) => s.packageAmount && s.packageAmount >= 8.0 && s.packageAmount < 15.0).length,
      core: students.filter((s) => s.packageAmount && s.packageAmount >= 5.0 && s.packageAmount < 8.0).length,
      mass: students.filter((s) => s.packageAmount && s.packageAmount < 5.0).length,
    };

    // 5-Year Trends
    const trends = [
      { year: '2022', total: 180, placed: 142, avgPackage: 5.8, highestPackage: 18.0 },
      { year: '2023', total: 195, placed: 160, avgPackage: 6.4, highestPackage: 22.0 },
      { year: '2024', total: 210, placed: 178, avgPackage: 7.2, highestPackage: 24.5 },
      { year: '2025', total: 225, placed: 198, avgPackage: 7.9, highestPackage: 26.0 },
      { year: '2026', total: totalStudents, placed: placedStudents, avgPackage, highestPackage },
    ];

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalStudents,
          placedStudents,
          unplacedStudents,
          placementRate,
          totalCompanies,
          activeDrives,
          totalOffers: placedStudents,
          highestPackage,
          avgPackage,
          lowestPackage,
          totalCompensation,
        },
        departmentBreakdown,
        salaryTiers: tiers,
        cohortTrends: trends,
        upcomingDrives: mockDb.drives.filter((d) => d.status === 'upcoming' || d.status === 'registration_open').slice(0, 5),
        recentActivity: mockDb.auditLogs.slice(0, 8),
      },
    });
  }

  public static async getRecentActivity(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      data: mockDb.auditLogs.slice(0, 20),
    });
  }
}
