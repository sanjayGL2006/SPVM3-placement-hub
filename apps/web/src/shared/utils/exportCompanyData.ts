import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PlacementDrive } from '../types/company.types';
import { PlacementApplication } from '../types/placement.types';

export const exportCompanyDriveToExcel = (drive: PlacementDrive, applications: PlacementApplication[]) => {
  const exportData = applications.map(app => ({
    'Student Register No': app.studentRegNo,
    'Student Name': app.studentName,
    'Department': app.department,
    'Course': app.course,
    'CGPA': app.cgpa,
    'Applied Date': app.appliedDate,
    'Current Stage': app.stage,
    'Role Applied For': app.role,
    'Package (LPA)': app.packageLPA,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Drive Applications');
  XLSX.writeFile(workbook, `${drive.companyName}_Drive_${drive.id}_Data.xlsx`);
};

export const exportCompanyDriveToPdf = (drive: PlacementDrive, applications: PlacementApplication[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(`${drive.companyName} - Placement Drive Report`, 14, 22);
  
  // Subtitle / Info
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Drive ID: ${drive.id} | Date: ${drive.driveDate}`, 14, 30);
  doc.text(`Role: ${drive.role} | Package: ₹${drive.packageLPA} LPA`, 14, 36);
  
  const placedCount = applications.filter(a => a.stage === 'Placed').length;
  doc.text(`Total Applications: ${applications.length} | Placed Candidates: ${placedCount}`, 14, 42);

  // Table
  const tableColumn = ["Reg No", "Student Name", "Course", "CGPA", "Stage"];
  const tableRows = applications.map(app => [
    app.studentRegNo,
    app.studentName,
    `${app.course} (${app.department})`,
    app.cgpa.toString(),
    app.stage
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] } // Indigo 600
  });

  doc.save(`${drive.companyName}_Drive_${drive.id}_Report.pdf`);
};
