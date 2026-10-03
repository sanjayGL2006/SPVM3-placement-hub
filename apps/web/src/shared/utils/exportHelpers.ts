import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Student } from '../types/student.types';
import autoTable from 'jspdf-autotable';

export const exportStudentsToExcel = (students: Student[], filename = 'Students_Placement_Data.xlsx') => {
  const exportData = students.map(s => ({
    'Register No': s.registerNumber,
    'Full Name': s.name,
    'Email': s.email,
    'Phone': s.phone,
    'Department': s.department,
    'Course': s.course,
    'Section': s.section,
    'Batch': s.batch,
    'CGPA': s.academic.cgpa,
    'Active Backlogs': s.academic.activeBacklogs,
    'Placement Status': s.placement.status,
    'Placed Company': s.placement.companyName || '-',
    'Role': s.placement.roleOffered || '-',
    'Package (LPA)': s.placement.packageLPA || '-',
    'Offer Date': s.placement.offerDate || '-',
    'Skills': s.skills.join(', '),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, filename);
};

export const exportStudentsToCSV = (students: Student[], filename = 'Students_Placement_Data.csv') => {
  const exportData = students.map(s => ({
    'Register No': s.registerNumber,
    'Full Name': s.name,
    'Email': s.email,
    'Department': s.department,
    'Course': s.course,
    'CGPA': s.academic.cgpa,
    'Placement Status': s.placement.status,
    'Company': s.placement.companyName || '-',
    'Package LPA': s.placement.packageLPA || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportDataToPdf = (title: string, headers: string[], rows: any[][], filename: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] } // Indigo 600
  });

  doc.save(filename);
};

export const exportElementToPdf = async (elementId: string, filename = 'Placement_Report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error('Failed to generate PDF:', err);
  }
};

export const exportPlacementTextReport = (
  academicYear: string,
  totalCohort: number,
  placedCount: number,
  lowestPkg: number,
  highestPkg: number,
  avgPkg: number,
  dominantBranch: string,
  departmentBreakdown: Record<string, number>,
  students: Student[],
  filename = 'Institutional_Placement_Report.txt'
) => {
  const rate = totalCohort > 0 ? ((placedCount / totalCohort) * 100).toFixed(1) : '0';
  const lines: string[] = [
    '================================================================================',
    '🎓 PLACEMENT PRO — INSTITUTIONAL ANNUAL PLACEMENT & RECRUITMENT REPORT',
    `Academic Year Cohort: ${academicYear}`,
    `Generated On: ${new Date().toLocaleString()}`,
    '================================================================================',
    '',
    '1. EXECUTIVE SUMMARY & KEY PLACEMENT BENCHMARKS',
    `   - Total Registered Students:   ${totalCohort}`,
    `   - Total Verified Placements:   ${placedCount}`,
    `   - Cohort Placement Rate:       ${rate}%`,
    `   - Lowest Package Secured:      ₹${lowestPkg} LPA`,
    `   - Highest Package Secured:     ₹${highestPkg} LPA`,
    `   - Institutional Average CTC:   ₹${avgPkg.toFixed(2)} LPA`,
    `   - Dominant Placement Branch:   ${dominantBranch}`,
    '',
    '2. DEPARTMENT-WISE PLACEMENT BREAKDOWN',
  ];

  Object.entries(departmentBreakdown).forEach(([dept, count]) => {
    lines.push(`   - ${dept.padEnd(30, ' ')} : ${count} Placed Candidates`);
  });

  lines.push('', '3. STUDENT OFFER LETTER RECIPIENTS ROSTER', '--------------------------------------------------------------------------------');
  lines.push(
    `${'REG NO'.padEnd(12)} | ${'STUDENT NAME'.padEnd(22)} | ${'DEPT'.padEnd(20)} | ${'COMPANY'.padEnd(18)} | ${'CTC (LPA)'}`
  );
  lines.push('--------------------------------------------------------------------------------');

  const placedStudents = students.filter((s) => s.placement.status === 'Placed');
  placedStudents.forEach((s) => {
    const reg = s.registerNumber.padEnd(12);
    const name = s.name.padEnd(22).slice(0, 22);
    const dept = (s.department || '').padEnd(20).slice(0, 20);
    const comp = (s.placement.companyName || '-').padEnd(18).slice(0, 18);
    const pkg = s.placement.packageLPA ? `₹${s.placement.packageLPA} LPA` : '-';
    lines.push(`${reg} | ${name} | ${dept} | ${comp} | ${pkg}`);
  });

  lines.push(
    '--------------------------------------------------------------------------------',
    '',
    '================================================================================',
    'Verified by Principal Office & Placement Directorate',
    '================================================================================'
  );

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

