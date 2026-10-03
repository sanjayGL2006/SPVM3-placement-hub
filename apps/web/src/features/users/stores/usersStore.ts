import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, Department, Course } from '../../../shared/types/global.types';
import { PREDEFINED_USERS, PredefinedUser } from '../../../shared/constants/credentials';

export type UserStatus = 'active' | 'suspended' | 'pending_2fa';

export interface ManagedUser extends PredefinedUser {
  status: UserStatus;
  twoFactorEnabled?: boolean;
  lastLogin?: string;
  createdAt?: string;
  ipAddress?: string;
}

export interface SecurityEvaluationOutput {
  id: string;
  timestamp: string;
  evaluatedUser: {
    id: string;
    name: string;
    role: UserRole;
    department?: Department;
  };
  targetAction: string;
  targetResource: string;
  targetDepartment?: Department;
  decision: 'ALLOW' | 'DENY';
  httpStatus: number;
  reason: string;
  evaluatedRules: {
    name: string;
    passed: boolean;
    description: string;
  }[];
  tokenClaims: {
    sub: string;
    iss: string;
    role: UserRole;
    dept: string;
    iat: number;
    exp: number;
  };
  auditLogged: boolean;
}

interface UsersState {
  users: ManagedUser[];
  selectedUser: ManagedUser | null;
  securityOutputs: SecurityEvaluationOutput[];
  
  // Actions
  setSelectedUser: (user: ManagedUser | null) => void;
  addUser: (userData: Omit<ManagedUser, 'id' | 'createdAt' | 'status' | 'avatar'>) => ManagedUser;
  updateUser: (id: string, partial: Partial<ManagedUser>) => void;
  changePassword: (id: string, newPassword: string) => void;
  toggleUserStatus: (id: string, newStatus?: UserStatus) => void;
  deleteUser: (id: string) => void;
  resetToDefaults: () => void;
  
  // Security Evaluator & Diagnostics
  evaluateSecurityPolicy: (
    user: ManagedUser,
    targetAction: string,
    targetResource: string,
    targetDepartment?: Department
  ) => SecurityEvaluationOutput;
  clearSecurityOutputs: () => void;
}

const INITIAL_MANAGED_USERS: ManagedUser[] = PREDEFINED_USERS.map((u, index) => ({
  ...u,
  status: 'active' as UserStatus,
  twoFactorEnabled: u.role === 'principal' || u.role === 'hod',
  lastLogin: `2026-03-${10 - (index % 5)} 09:${15 + (index * 3)}:22`,
  createdAt: '2025-08-01',
  ipAddress: `192.168.${(index % 4) + 1}.${10 + index}`,
}));

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: INITIAL_MANAGED_USERS,
      selectedUser: null,
      securityOutputs: [
        {
          id: 'EVAL-INIT-001',
          timestamp: '2026-03-10 10:14:02',
          evaluatedUser: {
            id: 'usr_principal_001',
            name: 'Dr. Rajesh Sharma',
            role: 'principal',
          },
          targetAction: 'REPORTS_ANNUAL_EXPORT',
          targetResource: 'University Placement Dossier 2026',
          targetDepartment: 'Computer Applications',
          decision: 'ALLOW',
          httpStatus: 200,
          reason: 'Super Admin role grants universal bypass across all college departments (*).',
          evaluatedRules: [
            { name: 'SuperAdminBypassRule', passed: true, description: 'Role is principal (Super Admin)' },
            { name: 'DeptIsolationCheck', passed: true, description: 'Exempt from department boundary limits' },
            { name: 'TokenValidityCheck', passed: true, description: 'Signed JWT is active and unexpired' },
          ],
          tokenClaims: {
            sub: 'usr_principal_001',
            iss: 'https://auth.placementpro.college.edu',
            role: 'principal',
            dept: 'College-Wide Super Admin',
            iat: Math.floor(Date.now() / 1000) - 3600,
            exp: Math.floor(Date.now() / 1000) + 86400,
          },
          auditLogged: true,
        },
      ],

      setSelectedUser: (user) => set({ selectedUser: user }),

      addUser: (userData) => {
        const id = `usr_${userData.role}_${Date.now().toString().slice(-4)}`;
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const newUser: ManagedUser = {
          ...userData,
          id,
          status: 'active',
          twoFactorEnabled: false,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name.toLowerCase())}`,
          createdAt: now,
          lastLogin: 'Never (New Account)',
          ipAddress: '192.168.1.1',
        };

        set((state) => ({ users: [newUser, ...state.users] }));
        return newUser;
      },

      updateUser: (id, partial) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...partial } : u)),
          selectedUser:
            state.selectedUser?.id === id ? { ...state.selectedUser, ...partial } : state.selectedUser,
        }));
      },

      changePassword: (id, newPassword) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, password: newPassword } : u)),
        }));
      },

      toggleUserStatus: (id, newStatus) => {
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id === id) {
              const updatedStatus: UserStatus =
                newStatus || (u.status === 'active' ? 'suspended' : 'active');
              return { ...u, status: updatedStatus };
            }
            return u;
          }),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        }));
      },

      resetToDefaults: () => {
        set({ users: INITIAL_MANAGED_USERS });
      },

      evaluateSecurityPolicy: (user, targetAction, targetResource, targetDepartment) => {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const evalId = `EVAL-${Date.now().toString().slice(-6)}`;

        let decision: 'ALLOW' | 'DENY' = 'ALLOW';
        let httpStatus = 200;
        let reason = '';
        const evaluatedRules: { name: string; passed: boolean; description: string }[] = [];

        // 1. Account Active Status Check
        if (user.status === 'suspended') {
          decision = 'DENY';
          httpStatus = 403;
          reason = `Access Denied: Account (${user.name}) is currently in SUSPENDED state.`;
          evaluatedRules.push({
            name: 'AccountActiveStatusRule',
            passed: false,
            description: 'Account status must be active to perform operations.',
          });
        } else {
          evaluatedRules.push({
            name: 'AccountActiveStatusRule',
            passed: true,
            description: 'Account is active and verified in directory.',
          });
        }

        // 2. Super Admin Check
        if (user.role === 'principal' && decision === 'ALLOW') {
          evaluatedRules.push({
            name: 'SuperAdminBypassRule',
            passed: true,
            description: 'Principal role has full college-wide wildcard (*) authorization.',
          });
          reason = 'Access Granted: Principal Super Admin has universal college-wide permissions.';
        } else if (decision === 'ALLOW') {
          // 3. Department Isolation Check
          if (
            (user.role === 'hod' || user.role === 'coordinator') &&
            targetDepartment &&
            user.department !== targetDepartment
          ) {
            decision = 'DENY';
            httpStatus = 403;
            reason = `Department Isolation Boundary Violation: User is in "${user.department}", but resource belongs to "${targetDepartment}".`;
            evaluatedRules.push({
              name: 'DepartmentIsolationBoundaryRule',
              passed: false,
              description: `Cross-department access restricted. HOD/Coordinator cannot access "${targetDepartment}".`,
            });
          } else {
            evaluatedRules.push({
              name: 'DepartmentIsolationBoundaryRule',
              passed: true,
              description: targetDepartment
                ? `Department matches assigned scope (${user.department}).`
                : 'No department boundary violation detected.',
            });
          }

          // 4. Role Hierarchy & Action Check
          if (decision === 'ALLOW') {
            if (targetAction.includes('AUDIT_TRAIL') && user.role !== 'principal') {
              decision = 'DENY';
              httpStatus = 403;
              reason = 'Access Denied: Security Audit Trails require Super Admin (Principal) clearance.';
              evaluatedRules.push({
                name: 'AuditTrailClearanceRule',
                passed: false,
                description: 'Principal role required for raw security event logs.',
              });
            } else if (targetAction.includes('CREATE_USER_STAFF') && user.role !== 'principal' && user.role !== 'hod') {
              decision = 'DENY';
              httpStatus = 403;
              reason = `Access Denied: Role "${user.role}" is not authorized to provision staff accounts.`;
              evaluatedRules.push({
                name: 'StaffProvisioningRule',
                passed: false,
                description: 'Coordinator, faculty, and students cannot create staff users.',
              });
            } else if (targetAction.includes('DELETE_STUDENT') && (user.role === 'faculty' || user.role === 'student')) {
              decision = 'DENY';
              httpStatus = 403;
              reason = `Access Denied: Role "${user.role}" does not have student record deletion authority.`;
              evaluatedRules.push({
                name: 'DestructiveActionRule',
                passed: false,
                description: 'Only Principal and Department HOD can delete student records.',
              });
            } else {
              evaluatedRules.push({
                name: 'ActionRolePermissionRule',
                passed: true,
                description: `Role "${user.role}" possesses sufficient claim grants for action "${targetAction}".`,
              });
              reason = `Access Granted: Action "${targetAction}" authorized under role "${user.role}".`;
            }
          }
        }

        const evaluationResult: SecurityEvaluationOutput = {
          id: evalId,
          timestamp,
          evaluatedUser: {
            id: user.id,
            name: user.name,
            role: user.role,
            department: user.department,
          },
          targetAction,
          targetResource,
          targetDepartment,
          decision,
          httpStatus,
          reason,
          evaluatedRules,
          tokenClaims: {
            sub: user.id,
            iss: 'https://auth.placementpro.college.edu',
            role: user.role,
            dept: user.department || 'College-Wide',
            iat: Math.floor(Date.now() / 1000) - 1200,
            exp: Math.floor(Date.now() / 1000) + 86400,
          },
          auditLogged: true,
        };

        set((state) => ({
          securityOutputs: [evaluationResult, ...state.securityOutputs.slice(0, 19)],
        }));

        return evaluationResult;
      },

      clearSecurityOutputs: () => set({ securityOutputs: [] }),
    }),
    {
      name: 'placement_pro_managed_users',
    }
  )
);
