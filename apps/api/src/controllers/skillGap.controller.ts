import { Request, Response } from 'express';
import { mockDb } from '../mock/mockStore';

export class SkillGapController {
  public static async getAnalysis(req: Request, res: Response) {
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;

    let students = mockDb.students.filter((s) => !s.isDeleted);
    if (departmentId) {
      students = students.filter((s) => s.departmentId === departmentId);
    }

    const totalStudents = students.length || 1;

    // Aggregate student skills
    const studentSkillCounts: Record<string, number> = {};
    for (const student of students) {
      for (const skill of student.skills) {
        const normalized = skill.trim();
        studentSkillCounts[normalized] = (studentSkillCounts[normalized] || 0) + 1;
      }
    }

    // Recruiter demand benchmark
    const industrySkills = [
      { name: 'TypeScript & React', demand: 85, category: 'Frontend & Full-Stack' },
      { name: 'Python & AI / ML', demand: 80, category: 'Data & Intelligence' },
      { name: 'SQL & PostgreSQL', demand: 75, category: 'Databases & Backend' },
      { name: 'Node.js & Express', demand: 72, category: 'Backend Architecture' },
      { name: 'Docker & Cloud', demand: 68, category: 'DevOps & Deployment' },
      { name: 'Java & Spring Boot', demand: 65, category: 'Enterprise Systems' },
      { name: 'Financial Modeling', demand: 60, category: 'Business & Finance' },
      { name: 'PowerBI & Tableau', demand: 58, category: 'Analytics & BI' },
    ];

    const comparison = industrySkills.map((item) => {
      // Find matching skill count in student records
      const matchingKey = Object.keys(studentSkillCounts).find((k) =>
        item.name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]!)
      );
      const studentCount = matchingKey ? studentSkillCounts[matchingKey] || 0 : Math.floor(totalStudents * 0.4);
      const studentPercentage = Math.min(100, Math.round((studentCount / totalStudents) * 100));
      const gap = Math.max(0, item.demand - studentPercentage);

      return {
        skill: item.name,
        category: item.category,
        demand: item.demand,
        availability: studentPercentage,
        gap,
        priority: gap > 35 ? 'HIGH' : gap > 20 ? 'MEDIUM' : 'LOW',
      };
    });

    // Workshop Recommendations based on high gaps
    const workshops = [
      {
        id: 1,
        title: 'Full-Stack TypeScript & Cloud Deployment Bootcamp',
        targetSkill: 'TypeScript & React',
        gapIdentified: '38% Gap',
        recommendedDuration: '2 Weeks (12 Hours)',
        suggestedTrainer: 'Industry Expert / Alumni Network',
        impact: 'Boosts eligibility for Google, Microsoft, and Amazon drives',
      },
      {
        id: 2,
        title: 'Applied Machine Learning & GenAI with Python',
        targetSkill: 'Python & AI / ML',
        gapIdentified: '32% Gap',
        recommendedDuration: '10 Days (8 Hours)',
        suggestedTrainer: 'Data Science Faculty / Corporate Trainer',
        impact: 'Enhances student ATS resume scores for AI/Cloud roles',
      },
      {
        id: 3,
        title: 'Advanced Financial Modeling & PowerBI Masterclass',
        targetSkill: 'PowerBI & Tableau',
        gapIdentified: '25% Gap',
        recommendedDuration: '1 Week (6 Hours)',
        suggestedTrainer: 'Deloitte Alumni / Finance Faculty',
        impact: 'Prepares BBA & B.Com students for high-ticket consulting roles',
      }
    ];

    return res.status(200).json({
      success: true,
      data: {
        skillsComparison: comparison,
        highDemandSkills: comparison.filter((c) => c.demand >= 75),
        criticalGaps: comparison.filter((c) => c.priority === 'HIGH'),
        suggestedWorkshops: workshops,
      },
    });
  }
}
