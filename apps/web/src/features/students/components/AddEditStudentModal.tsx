import { useState, useEffect } from 'react';
import { Student, PlacementStatus } from '../../../shared/types/student.types';
import { Department, Course } from '../../../shared/types/global.types';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import toast from 'react-hot-toast';

export interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any) => void;
  studentToEdit?: Student | null;
}

export const AddEditStudentModal = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}: AddEditStudentModalProps) => {
  const isEditing = !!studentToEdit;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    registerNumber: '',
    department: 'Computer Applications' as Department,
    course: 'BCA' as Course,
    section: 'A' as 'A' | 'B' | 'C',
    batch: '2022-2026',
    academicYear: '2025-26',
    tenthPercentage: 85,
    twelfthPercentage: 85,
    cgpa: 8.0,
    activeBacklogs: 0,
    placementStatus: 'Eligible' as PlacementStatus,
    companyName: '',
    packageLPA: 6.0,
    skills: 'React.js, TypeScript, SQL, Node.js',
    bio: '',
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name,
        email: studentToEdit.email,
        phone: studentToEdit.phone,
        gender: studentToEdit.gender,
        registerNumber: studentToEdit.registerNumber,
        department: studentToEdit.department,
        course: studentToEdit.course,
        section: studentToEdit.section,
        batch: studentToEdit.batch,
        academicYear: studentToEdit.academicYear,
        tenthPercentage: studentToEdit.academic.tenthPercentage,
        twelfthPercentage: studentToEdit.academic.twelfthPercentage,
        cgpa: studentToEdit.academic.cgpa,
        activeBacklogs: studentToEdit.academic.activeBacklogs,
        placementStatus: studentToEdit.placement.status,
        companyName: studentToEdit.placement.companyName || '',
        packageLPA: studentToEdit.placement.packageLPA || 6.0,
        skills: studentToEdit.skills.join(', '),
        bio: studentToEdit.bio || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        registerNumber: '',
        department: 'Computer Applications',
        course: 'BCA',
        section: 'A',
        batch: '2022-2026',
        academicYear: '2025-26',
        tenthPercentage: 85,
        twelfthPercentage: 85,
        cgpa: 8.0,
        activeBacklogs: 0,
        placementStatus: 'Eligible',
        companyName: '',
        packageLPA: 6.0,
        skills: 'React.js, TypeScript, SQL, Node.js',
        bio: '',
      });
    }
  }, [studentToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+91 98000 00000',
      gender: formData.gender,
      registerNumber: formData.registerNumber || `22${formData.course.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-3)}`,
      department: formData.department,
      course: formData.course,
      section: formData.section,
      batch: formData.batch,
      academicYear: formData.academicYear,
      academic: {
        tenthPercentage: Number(formData.tenthPercentage),
        twelfthPercentage: Number(formData.twelfthPercentage),
        cgpa: Number(formData.cgpa),
        activeBacklogs: Number(formData.activeBacklogs),
        clearedBacklogs: studentToEdit?.academic.clearedBacklogs || 0,
        semesterScores: studentToEdit?.academic.semesterScores || [
          { semester: 1, sgpa: Number(formData.cgpa) },
          { semester: 2, sgpa: Number(formData.cgpa) },
        ],
      },
      placement: {
        status: formData.placementStatus,
        companyName: formData.placementStatus === 'Placed' ? formData.companyName : undefined,
        packageLPA: formData.placementStatus === 'Placed' ? Number(formData.packageLPA) : undefined,
        appliedCount: studentToEdit?.placement.appliedCount || 0,
        interviewsCount: studentToEdit?.placement.interviewsCount || 0,
        offersCount: formData.placementStatus === 'Placed' ? 1 : 0,
        offerDate: formData.placementStatus === 'Placed' ? new Date().toISOString().split('T')[0] : undefined,
      },
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      bio: formData.bio,
      certifications: studentToEdit?.certifications || ['Campus Placement Certified'],
      projects: studentToEdit?.projects || [
        { title: 'Capstone Project', tech: 'React, Node.js', description: 'Comprehensive domain implementation.' }
      ],
      timeline: studentToEdit?.timeline || [
        { date: new Date().toISOString().split('T')[0], title: 'Record Registered', description: 'Student profile created.', type: 'academic' }
      ],
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Update Student Account' : 'Create New Student Account'}
      description="Configure student registration number, CGPA, department, and placement status."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Rahul Kumar"
          />
          <Input
            label="College Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. rahul.kumar@college.edu"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Register Number"
            value={formData.registerNumber}
            onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
            placeholder="e.g. 22BCA101"
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="Computer Applications">Computer Applications</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Commerce">Commerce</option>
              <option value="Science">Science</option>
              <option value="Hotel Management">Hotel Management</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Course
            </label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value as Course })}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="B.Com">B.Com</option>
              <option value="B.Sc Computer Science">B.Sc Computer Science</option>
              <option value="BBA Hotel Management">BBA Hotel Management</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Section
            </label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value as 'A' | 'B' | 'C' })}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input
            label="CGPA (10.0)"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
          />
          <Input
            label="Active Backlogs"
            type="number"
            min="0"
            value={formData.activeBacklogs}
            onChange={(e) => setFormData({ ...formData, activeBacklogs: Number(e.target.value) })}
          />
          <Input
            label="10th %"
            type="number"
            step="0.1"
            value={formData.tenthPercentage}
            onChange={(e) => setFormData({ ...formData, tenthPercentage: Number(e.target.value) })}
          />
          <Input
            label="12th %"
            type="number"
            step="0.1"
            value={formData.twelfthPercentage}
            onChange={(e) => setFormData({ ...formData, twelfthPercentage: Number(e.target.value) })}
          />
        </div>

        {/* Placement Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-200/60 dark:border-stone-800">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Placement Status
            </label>
            <select
              value={formData.placementStatus}
              onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value as PlacementStatus })}
              className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="Eligible">Eligible</option>
              <option value="In Process">In Process</option>
              <option value="Placed">Placed</option>
              <option value="Opted Out">Opted Out</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>
          </div>

          {formData.placementStatus === 'Placed' && (
            <>
              <Input
                label="Hiring Company"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Deloitte"
              />
              <Input
                label="Package (₹ LPA)"
                type="number"
                step="0.1"
                value={formData.packageLPA}
                onChange={(e) => setFormData({ ...formData, packageLPA: Number(e.target.value) })}
                placeholder="8.5"
              />
            </>
          )}
        </div>

        {/* Skills */}
        <Input
          label="Skills (Comma separated)"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="React, TypeScript, SQL, Node.js, Python"
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <Button variant="outline" size="sm" pill type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" pill type="submit">
            {isEditing ? 'Save Updates' : 'Create Student Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
