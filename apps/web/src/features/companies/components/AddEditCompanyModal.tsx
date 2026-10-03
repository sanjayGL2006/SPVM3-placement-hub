import { useState, useEffect } from 'react';
import { Company, CompanyTier } from '../../../shared/types/company.types';
import { Department, Course } from '../../../shared/types/global.types';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import toast from 'react-hot-toast';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';

export interface AddEditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (companyData: any) => void;
  companyToEdit?: Company | null;
}

export const AddEditCompanyModal = ({
  isOpen,
  onClose,
  onSave,
  companyToEdit,
}: AddEditCompanyModalProps) => {
  const isEditing = !!companyToEdit;

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Information Technology / Software',
    website: 'https://',
    location: 'Bangalore, India',
    description: '',
    tier: 'Dream (7 - 12 LPA)' as CompanyTier,
    minCgpa: '7.0',
    maxBacklogsAllowed: '0',
    minPackage: '6.0',
    maxPackage: '12.0',
    hiringRoles: 'Software Engineer, Full Stack Developer',
    eligibleCourses: 'BCA, B.Sc Computer Science',
    contactName: 'Talent Acquisition Team',
    contactDesignation: 'Campus Recruiter',
    contactEmail: 'campus@company.com',
    contactPhone: '+91 98765 43210',
  });

  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        name: companyToEdit.name,
        industry: companyToEdit.industry,
        website: companyToEdit.website,
        location: companyToEdit.location,
        description: companyToEdit.description,
        tier: companyToEdit.tier,
        minCgpa: String(companyToEdit.minCgpa),
        maxBacklogsAllowed: String(companyToEdit.maxBacklogsAllowed),
        minPackage: String(companyToEdit.packageRange.min),
        maxPackage: String(companyToEdit.packageRange.max),
        hiringRoles: companyToEdit.hiringRoles.join(', '),
        eligibleCourses: companyToEdit.eligibleCourses.join(', '),
        contactName: companyToEdit.contactPerson.name,
        contactDesignation: companyToEdit.contactPerson.designation,
        contactEmail: companyToEdit.contactPerson.email,
        contactPhone: companyToEdit.contactPerson.phone,
      });
    } else {
      setFormData({
        name: '',
        industry: 'Information Technology / Software',
        website: 'https://',
        location: 'Bangalore, India',
        description: '',
        tier: 'Dream (7 - 12 LPA)',
        minCgpa: '7.0',
        maxBacklogsAllowed: '0',
        minPackage: '6.0',
        maxPackage: '12.0',
        hiringRoles: 'Software Engineer, Full Stack Developer',
        eligibleCourses: 'BCA, B.Sc Computer Science',
        contactName: 'Talent Acquisition Team',
        contactDesignation: 'Campus Recruiter',
        contactEmail: 'campus@company.com',
        contactPhone: '+91 98765 43210',
      });
    }
  }, [companyToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    const payload = {
      name: formData.name,
      logo: getCompanyLogo(formData.name, companyToEdit?.logo),
      industry: formData.industry,
      website: formData.website,
      location: formData.location,
      description: formData.description || `${formData.name} campus hiring partner offering premium roles.`,
      tier: formData.tier,
      targetDepartments: ['Computer Applications', 'Science'] as Department[],
      eligibleCourses: formData.eligibleCourses.split(',').map((c) => c.trim() as Course),
      minCgpa: Number(formData.minCgpa),
      maxBacklogsAllowed: Number(formData.maxBacklogsAllowed),
      packageRange: { min: Number(formData.minPackage), max: Number(formData.maxPackage) },
      hiringRoles: formData.hiringRoles.split(',').map((r) => r.trim()),
      contactPerson: {
        name: formData.contactName,
        designation: formData.contactDesignation,
        email: formData.contactEmail,
        phone: formData.contactPhone,
      },
      totalVisitedYears: companyToEdit?.totalVisitedYears || 1,
      totalHiredCount: companyToEdit?.totalHiredCount || 0,
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Hiring Partner' : 'Add New Hiring Partner'}
      description="Register company information, criteria, and hiring packages."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Company Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Cisco Systems"
          />
          <Input
            label="Industry Domain"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g. Cloud & Networking"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://cisco.com"
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Bangalore / Hybrid"
          />
        </div>

        {/* Tier & Package Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Recruitment Tier
            </label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value as CompanyTier })}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="Super Dream (> 12 LPA)">Super Dream (&gt; 12 LPA)</option>
              <option value="Dream (7 - 12 LPA)">Dream (7 - 12 LPA)</option>
              <option value="Core (4 - 7 LPA)">Core (4 - 7 LPA)</option>
              <option value="Mass (< 4 LPA)">Mass (&lt; 4 LPA)</option>
            </select>
          </div>

          <Input
            label="Min Package (₹ LPA)"
            type="number"
            step="0.1"
            value={formData.minPackage}
            onChange={(e) => setFormData({ ...formData, minPackage: e.target.value })}
          />

          <Input
            label="Max Package (₹ LPA)"
            type="number"
            step="0.1"
            value={formData.maxPackage}
            onChange={(e) => setFormData({ ...formData, maxPackage: e.target.value })}
          />
        </div>

        {/* Cutoffs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Minimum CGPA Cutoff"
            type="number"
            step="0.1"
            value={formData.minCgpa}
            onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
          />
          <Input
            label="Max Backlogs Allowed"
            type="number"
            value={formData.maxBacklogsAllowed}
            onChange={(e) => setFormData({ ...formData, maxBacklogsAllowed: e.target.value })}
          />
        </div>

        <Input
          label="Hiring Roles (Comma separated)"
          value={formData.hiringRoles}
          onChange={(e) => setFormData({ ...formData, hiringRoles: e.target.value })}
          placeholder="Software Engineer, Cloud Associate"
        />

        <Input
          label="Eligible Courses (Comma separated)"
          value={formData.eligibleCourses}
          onChange={(e) => setFormData({ ...formData, eligibleCourses: e.target.value })}
          placeholder="BCA, B.Sc Computer Science, BBA"
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <Button variant="outline" size="sm" pill type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" pill type="submit">
            {isEditing ? 'Save Changes' : 'Register Partner'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
