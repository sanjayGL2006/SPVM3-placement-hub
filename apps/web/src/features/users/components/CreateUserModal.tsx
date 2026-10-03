import React, { useState } from 'react';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUsersStore, ManagedUser } from '../stores/usersStore';
import { useSettingsStore } from '../../settings/stores/settingsStore';
import { canCreateUser, getAvailableRolesForCreation } from '../../../shared/utils/permissions';
import { UserRole, Department, Course } from '../../../shared/types/global.types';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Shield, UserPlus, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (newUser: ManagedUser) => void;
}

const DEPARTMENTS: { dept: Department; defaultCourse: Course }[] = [
  { dept: 'Computer Applications', defaultCourse: 'BCA' },
  { dept: 'Business Administration', defaultCourse: 'BBA' },
  { dept: 'Commerce', defaultCourse: 'B.Com' },
  { dept: 'Science', defaultCourse: 'B.Sc Computer Science' },
  { dept: 'Hotel Management', defaultCourse: 'BBA Hotel Management' },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  const { user: currentUser } = useAuthStore();
  const { addUser } = useUsersStore();
  const { addAuditLog } = useSettingsStore();

  const isPrincipal = currentUser?.role === 'principal';
  const isHod = currentUser?.role === 'hod';
  const availableRoles = currentUser ? getAvailableRolesForCreation(currentUser.role) : [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: (availableRoles[0] || 'coordinator') as UserRole,
    department: (isHod ? currentUser?.department : 'Computer Applications') as Department,
    course: (isHod ? currentUser?.course : 'BCA') as Course,
    twoFactorRequired: false,
  });

  const handleRoleChange = (newRole: UserRole) => {
    setFormData((prev) => ({ ...prev, role: newRole }));
  };

  const handleDeptChange = (newDept: Department) => {
    const match = DEPARTMENTS.find((d) => d.dept === newDept);
    setFormData((prev) => ({
      ...prev,
      department: newDept,
      course: match ? match.defaultCourse : 'BCA',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Full name and email are required');
      return;
    }

    if (currentUser && !canCreateUser(currentUser.role, formData.role)) {
      toast.error(`Your role (${currentUser.role}) is not permitted to provision ${formData.role} accounts.`);
      return;
    }

    // Default permissions based on role
    const permissionsMap: Record<UserRole, string[]> = {
      principal: ['*'],
      hod: [
        'dashboard:view',
        'students:view',
        'students:create',
        'students:edit',
        'students:delete',
        'companies:view',
        'companies:create',
        'placements:view',
        'placements:manage',
        'reports:view',
        'reports:generate',
        'ai:chatbot',
        'ai:resume_analyze',
      ],
      coordinator: [
        'dashboard:view',
        'students:view',
        'students:edit',
        'companies:view',
        'placements:view',
        'reports:view',
        'ai:chatbot',
      ],
      faculty: ['dashboard:view', 'students:view', 'companies:view', 'reports:view'],
      student: [
        'student:dashboard',
        'student:profile',
        'student:resume',
        'student:applications',
        'student:mock_test',
        'student:mock_interview',
      ],
    };

    const newUser = addUser({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password || 'Password@2026',
      role: formData.role,
      department: formData.department,
      course: formData.course,
      twoFactorEnabled: formData.twoFactorRequired,
      permissions: permissionsMap[formData.role] || ['dashboard:view'],
    });

    addAuditLog({
      userId: currentUser?.id || 'usr_system',
      userName: currentUser?.name || 'Authorized Admin',
      userRole: currentUser?.role || 'principal',
      action: 'USER_CREATED',
      target: `${newUser.name} (${newUser.role.toUpperCase()})`,
      details: `Provisioned institutional account with email ${newUser.email} in ${newUser.department || 'College-Wide'}.`,
    });

    toast.success(`Created account for ${newUser.name} as ${newUser.role.toUpperCase()}`);
    onUserCreated?.(newUser);
    onClose();

    // Reset
    setFormData({
      name: '',
      email: '',
      password: '',
      role: (availableRoles[0] || 'coordinator') as UserRole,
      department: (isHod ? currentUser?.department : 'Computer Applications') as Department,
      course: (isHod ? currentUser?.course : 'BCA') as Course,
      twoFactorRequired: false,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Authorized User Account"
      description="Hierarchical RBAC Enforcement: Provision accounts with assigned department permissions."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input
          label="Full Legal / Academic Name"
          required
          placeholder="e.g. Dr. Rajesh Verma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Institutional Email Address"
          type="email"
          required
          placeholder="e.g. r.verma@college.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Initial Password (Defaults to Password@2026)"
          type="password"
          placeholder="Leave blank for Password@2026"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Assigned Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-bold uppercase"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Department Scope
            </label>
            <select
              value={formData.department}
              disabled={isHod} // HOD cannot change assigned department
              onChange={(e) => handleDeptChange(e.target.value as Department)}
              className={`w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold ${
                isHod ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.dept} value={d.dept}>
                  {d.dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Enforce Two-Factor Authentication (2FA)
            </span>
          </div>
          <input
            type="checkbox"
            checked={formData.twoFactorRequired}
            onChange={(e) => setFormData({ ...formData, twoFactorRequired: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            pill
          >
            Create Account & Issue Credentials
          </Button>
        </div>
      </form>
    </Modal>
  );
};
