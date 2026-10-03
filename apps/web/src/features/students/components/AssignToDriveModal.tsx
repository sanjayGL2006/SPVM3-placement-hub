import React, { useState } from 'react';
import { X, Briefcase, Calendar } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { useCompanyStore } from '../../companies/stores/companyStore';
import { usePlacementStore } from '../../placements/stores/placementStore';
import { useStudentStore } from '../stores/studentStore';
import toast from 'react-hot-toast';

export interface AssignToDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentIds: string[];
}

export const AssignToDriveModal = ({ isOpen, onClose, selectedStudentIds }: AssignToDriveModalProps) => {
  const { drives, companies } = useCompanyStore();
  const { students } = useStudentStore();
  const { addApplication } = usePlacementStore();

  const [selectedDriveId, setSelectedDriveId] = useState<string>('');
  
  if (!isOpen) return null;

  const handleAssign = () => {
    if (!selectedDriveId) {
      toast.error('Please select a placement drive');
      return;
    }

    const drive = drives.find(d => d.id === selectedDriveId);
    if (!drive) return;

    const company = companies.find(c => c.name === drive.companyName);

    // Get selected students data
    const studentsToAssign = students.filter(s => selectedStudentIds.includes(s.id));

    if (studentsToAssign.length === 0) return;

    const today = new Date().toISOString().split('T')[0];

    studentsToAssign.forEach(student => {
      addApplication({
        studentId: student.id,
        studentName: student.name,
        studentRegNo: student.registerNumber,
        department: student.department,
        course: student.course,
        cgpa: student.academic.cgpa,
        driveId: drive.id,
        companyId: company?.id || 'CMP-XXX',
        companyName: drive.companyName,
        companyLogo: drive.companyLogo || '',
        role: drive.role || 'Software Engineer',
        packageLPA: drive.packageLPA,
        appliedDate: today,
        stage: 'Applied'
      });
    });

    toast.success(`Successfully assigned ${studentsToAssign.length} students to ${drive.companyName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            Assign to Placement Drive
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 py-2">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            You are about to assign <strong>{selectedStudentIds.length}</strong> selected students to a placement drive. This will create active applications for them in the placement pipeline.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Select Drive</label>
            <select
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Choose a Placement Drive --</option>
              {drives.map(drive => (
                <option key={drive.id} value={drive.id}>
                  {drive.companyName} - {drive.role || 'Role'} (₹{drive.packageLPA} LPA)
                </option>
              ))}
            </select>
            {drives.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> No active drives available. Create one in Companies page first.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedDriveId}>
            Assign Students
          </Button>
        </div>
      </div>
    </div>
  );
};
