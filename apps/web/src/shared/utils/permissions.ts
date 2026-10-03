import { UserRole, Department } from '../types/global.types';
import { PREDEFINED_USERS } from '../constants/credentials';

export const hasPermission = (
  userRole: UserRole,
  permission: string,
  userDepartment?: Department,
  targetDepartment?: Department
): boolean => {
  // Principal has bypass everywhere
  if (userRole === 'principal') return true;

  // Department isolation for HOD and Coordinator
  if ((userRole === 'hod' || userRole === 'coordinator') && userDepartment && targetDepartment) {
    if (userDepartment !== targetDepartment) return false;
  }

  // Check specific permissions array from predefined template
  const templateUser = PREDEFINED_USERS.find(u => u.role === userRole);
  if (!templateUser) return false;

  if (templateUser.permissions.includes('*')) return true;
  return templateUser.permissions.includes(permission);
};

export const canCreateUser = (creatorRole: UserRole, targetRole: UserRole): boolean => {
  const hierarchy: Record<UserRole, UserRole[]> = {
    principal: ['hod', 'coordinator', 'faculty', 'student'],
    hod: ['coordinator', 'faculty', 'student'],
    coordinator: ['student'],
    faculty: [],
    student: [],
  };
  return hierarchy[creatorRole]?.includes(targetRole) ?? false;
};

export const getAvailableRolesForCreation = (creatorRole: UserRole): UserRole[] => {
  const hierarchy: Record<UserRole, UserRole[]> = {
    principal: ['hod', 'coordinator', 'faculty', 'student'],
    hod: ['coordinator', 'faculty', 'student'],
    coordinator: ['student'],
    faculty: [],
    student: [],
  };
  return hierarchy[creatorRole] || [];
};

export const canAccessDepartment = (
  userRole: UserRole,
  userDepartment?: Department,
  targetDepartment?: Department
): boolean => {
  if (userRole === 'principal' || userRole === 'faculty') return true;
  if (!userDepartment || !targetDepartment) return true;
  return userDepartment === targetDepartment;
};
