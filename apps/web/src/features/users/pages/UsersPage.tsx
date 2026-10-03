import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUsersStore, ManagedUser } from '../stores/usersStore';
import { useSettingsStore } from '../../settings/stores/settingsStore';
import { canCreateUser, getAvailableRolesForCreation } from '../../../shared/utils/permissions';
import { UserRole, Department } from '../../../shared/types/global.types';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { UserSecurityDrawer } from '../components/UserSecurityDrawer';
import { LiveSecurityConsole } from '../components/LiveSecurityConsole';
import { RbacSimulator } from '../components/RbacSimulator';
import { CreateUserModal } from '../components/CreateUserModal';
import {
  Users as UsersIcon,
  Shield,
  UserPlus,
  Lock,
  Unlock,
  Key,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  LayoutGrid,
  List,
  ExternalLink,
  ShieldCheck,
  Zap,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const { user: currentUser, demoLogin } = useAuthStore();
  const { users, securityOutputs, changePassword, toggleUserStatus } = useUsersStore();
  const { auditLogs, addAuditLog } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<'directory' | 'console' | 'simulator' | 'matrix' | 'audit'>('directory');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Drawer
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [userToChangePwd, setUserToChangePwd] = useState<ManagedUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [inspectingUser, setInspectingUser] = useState<ManagedUser | null>(null);

  const isPrincipal = currentUser?.role === 'principal';
  const isHod = currentUser?.role === 'hod';
  const availableRoles = currentUser ? getAvailableRolesForCreation(currentUser.role) : [];

  // Filter users based on scope and search
  const visibleUsers = useMemo(() => {
    return users.filter((u) => {
      // Department isolation for HOD
      if (isHod && currentUser?.department && u.department && u.department !== currentUser.department && u.role !== 'principal') {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesDept = u.department?.toLowerCase().includes(q);
        const matchesRole = u.role.toLowerCase().includes(q);
        const matchesId = u.id.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesDept && !matchesRole && !matchesId) {
          return false;
        }
      }

      // Role Filter
      if (roleFilter !== 'all' && u.role !== roleFilter) {
        return false;
      }

      // Department Filter
      if (deptFilter !== 'all' && u.department !== deptFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && u.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [users, isHod, currentUser, searchQuery, roleFilter, deptFilter, statusFilter]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (userToChangePwd) {
      changePassword(userToChangePwd.id, newPassword);
      addAuditLog({
        userId: currentUser?.id || 'usr_system',
        userName: currentUser?.name || 'Administrator',
        userRole: currentUser?.role || 'principal',
        action: 'PASSWORD_RESET',
        target: `${userToChangePwd.name} (${userToChangePwd.email})`,
        details: `Credentials updated by ${currentUser?.name} via User Administration.`,
      });
      toast.success(`Password successfully updated for ${userToChangePwd.name}`);
      setIsChangePwdOpen(false);
      setNewPassword('');
      setUserToChangePwd(null);
    }
  };

  const handleToggleStatus = (u: ManagedUser) => {
    const nextStatus = u.status === 'active' ? 'suspended' : 'active';
    toggleUserStatus(u.id, nextStatus);
    addAuditLog({
      userId: currentUser?.id || 'usr_system',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'principal',
      action: nextStatus === 'active' ? 'USER_REACTIVATED' : 'USER_SUSPENDED',
      target: `${u.name} (${u.role.toUpperCase()})`,
      details: `Account status toggled to ${nextStatus.toUpperCase()}.`,
    });
    toast.success(`Account for ${u.name} is now ${nextStatus.toUpperCase()}`);
  };

  const handleImpersonate = (u: ManagedUser) => {
    demoLogin(u.id);
    toast.success(`Switched active session to: ${u.name} (${u.role.toUpperCase()})`);
  };

  const handleExportUsersCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Course', 'Status', '2FA Enforced', 'Last Login'];
    const rows = visibleUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role.toUpperCase(),
      `"${u.department || 'College-Wide'}"`,
      `"${u.course || 'All'}"`,
      u.status.toUpperCase(),
      u.twoFactorEnabled ? 'YES' : 'NO',
      `"${u.lastLogin || 'Never'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `institutional_users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('User administration directory exported to CSV');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'principal':
        return 'warning';
      case 'hod':
        return 'primary';
      case 'coordinator':
        return 'success';
      case 'faculty':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1.5 border border-indigo-200/60 dark:border-indigo-800/60">
            <Shield className="w-3.5 h-3.5" />
            <span>RBAC 5-Tier Governance & Live Security Output</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
            User Administration & Security Controls
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Manage hierarchical accounts (Principal → HOD → Coordinator → Faculty → Student) with live RBAC policy output inspection.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportUsersCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            pill
          >
            Export Directory
          </Button>

          {availableRoles.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              pill
              className="shadow-md shadow-indigo-500/20"
            >
              Create Account
            </Button>
          )}
        </div>
      </div>

      {/* Top Metrics Cards (Pinterest Academic Glassmorphism) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 leading-tight">
              {users.length}
            </div>
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Total Accounts ({visibleUsers.length} in scope)
            </div>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 leading-tight">
              {users.filter((u) => u.status === 'active').length}
            </div>
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Active Verified Sessions
            </div>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 leading-tight">
              100%
            </div>
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Dept Isolation Health
            </div>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 leading-tight">
              {securityOutputs.length}
            </div>
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Live Policy Outputs
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Pill Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'directory', label: `Staff & Users Directory (${visibleUsers.length})`, icon: UsersIcon },
            { id: 'console', label: `Live Output Console (${securityOutputs.length})`, icon: Terminal, highlight: true },
            { id: 'simulator', label: 'RBAC Policy Simulator', icon: Zap },
            { id: 'matrix', label: 'Permission Matrix', icon: ShieldCheck },
            ...(isPrincipal ? [{ id: 'audit', label: `Audit Trail Logs (${auditLogs.length})`, icon: Activity }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-stone-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'directory' && (
          <div className="flex items-center gap-1 bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-stone-400'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-stone-400'
              }`}
              title="Dense Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: User Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, ID, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 text-xs font-semibold placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none"
              >
                <option value="all">All Roles (Principal, HOD, Coord, Faculty, Student)</option>
                <option value="principal">Principal (Super Admin)</option>
                <option value="hod">HOD (Department Admin)</option>
                <option value="coordinator">Placement Coordinator</option>
                <option value="faculty">Faculty (View-Only)</option>
                <option value="student">Student Accounts</option>
              </select>
            </div>

            <div>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none"
              >
                <option value="all">All Departments</option>
                <option value="Computer Applications">Computer Applications (BCA)</option>
                <option value="Business Administration">Business Administration (BBA)</option>
                <option value="Commerce">Commerce (B.Com)</option>
                <option value="Science">Science (B.Sc CS)</option>
                <option value="Hotel Management">Hotel Management</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none"
              >
                <option value="all">All Account Statuses</option>
                <option value="active">Active Verified</option>
                <option value="suspended">Suspended / Inactive</option>
              </select>
            </div>
          </div>

          {/* User Cards Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleUsers.map((u) => {
                const isSuspended = u.status === 'suspended';

                return (
                  <div
                    key={u.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md transition-all space-y-4 relative group"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 p-1 border border-stone-200 dark:border-stone-700 shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-50 truncate">
                            {u.name}
                          </h4>
                          <p className="text-xs text-stone-400 font-mono truncate">{u.email}</p>
                          <div className="text-[10px] text-stone-400 font-medium truncate mt-0.5">
                            ID: {u.id}
                          </div>
                        </div>
                      </div>

                      <Badge variant={getRoleBadgeVariant(u.role)} size="sm">
                        {u.role.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Department Scope & Status */}
                    <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 font-medium">Department Scope:</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 truncate max-w-[150px]">
                          {u.department || 'College-Wide (Super Admin)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 font-medium">Security Status:</span>
                        <span className="flex items-center gap-1 font-bold">
                          {isSuspended ? (
                            <span className="text-rose-500 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Suspended
                            </span>
                          ) : (
                            <span className="text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Active (Verified)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInspectingUser(u)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect Output
                      </Button>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImpersonate(u)}
                          title="Test session as this user"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>

                        {(isPrincipal || (isHod && u.department === currentUser?.department)) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUserToChangePwd(u);
                              setNewPassword('');
                              setIsChangePwdOpen(true);
                            }}
                            title="Change User Password"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        {isPrincipal && (
                          <Button
                            variant={isSuspended ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => handleToggleStatus(u)}
                            title={isSuspended ? 'Reactivate User' : 'Suspend User'}
                            className={!isSuspended ? 'text-stone-400 hover:text-red-500' : ''}
                          >
                            {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* User Table Dense View */}
          {viewMode === 'table' && (
            <Card className="p-0 overflow-hidden shadow-xs border-stone-200 dark:border-stone-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Department Scope</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">2FA</th>
                      <th className="py-3 px-4">Last Login</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                    {visibleUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 shrink-0" />
                            <div>
                              <div className="font-bold text-stone-900 dark:text-stone-50">{u.name}</div>
                              <div className="text-[11px] text-stone-400 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getRoleBadgeVariant(u.role)} size="sm">
                            {u.role.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                          {u.department || 'College-Wide (Super Admin)'}
                        </td>
                        <td className="py-3 px-4">
                          {u.status === 'suspended' ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Suspended
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-500">
                          {u.twoFactorEnabled ? 'ENFORCED' : 'OPTIONAL'}
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-400 text-[11px]">
                          {u.lastLogin || '2026-03-09'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="sm" onClick={() => setInspectingUser(u)}>
                              Inspect
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleImpersonate(u)}>
                              Test
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: Live Security Output Console */}
      {activeTab === 'console' && (
        <LiveSecurityConsole onOpenSimulator={() => setActiveTab('simulator')} />
      )}

      {/* TAB 3: RBAC Simulator */}
      {activeTab === 'simulator' && (
        <RbacSimulator onSuccessEvaluation={() => {}} />
      )}

      {/* TAB 4: Permission Matrix */}
      {activeTab === 'matrix' && (
        <Card className="p-0 overflow-hidden shadow-xs border-stone-200 dark:border-stone-800">
          <div className="p-4 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-50">
                Institutional 5-Tier RBAC Permission Grid
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Formal authorization blueprint implemented across backend middleware and frontend route guards.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('simulator')}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Test Rules in Simulator
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Feature / Action Capability</th>
                  <th className="py-3.5 px-4 text-center">Principal (Super Admin)</th>
                  <th className="py-3.5 px-4 text-center">HOD (Dept Admin)</th>
                  <th className="py-3.5 px-4 text-center">Placement Coordinator</th>
                  <th className="py-3.5 px-4 text-center">Faculty (Read-Only)</th>
                  <th className="py-3.5 px-4 text-center">Student (Self-Service)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {[
                  { name: 'University-Wide Dashboard & Cohort Trends', p: true, h: false, c: false, f: true, s: false },
                  { name: 'Department-Scoped Student Directory CRUD', p: true, h: true, c: true, f: false, s: false },
                  { name: 'Excel / CSV Live Student Import & Export', p: true, h: true, c: true, f: false, s: false },
                  { name: 'Company Partner Directory & Salary Tier Management', p: true, h: true, c: true, f: true, s: false },
                  { name: 'Schedule Campus Recruitment Drives & Rounds', p: true, h: true, c: true, f: false, s: false },
                  { name: 'Provision Subordinate Staff & Coordinator Accounts', p: true, h: true, c: false, f: false, s: false },
                  { name: 'Annual Executive Placement Report (PDF/Excel)', p: true, h: true, c: true, f: false, s: false },
                  { name: 'AI Placement Chatbot (RBAC-Constrained)', p: true, h: true, c: true, f: true, s: true },
                  { name: 'ATS Resume Analyzer & Keyword Matcher', p: true, h: true, c: true, f: false, s: true },
                  { name: 'AI Mock Aptitude Test & Interactive Scorecard', p: false, h: false, c: false, f: false, s: true },
                  { name: 'AI Voice/Text Mock Interview Coach', p: false, h: false, c: false, f: false, s: true },
                  { name: 'Principal Security Audit Trail & Access Logs', p: true, h: false, c: false, f: false, s: false },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">{row.p ? '✅ ALLOW' : '—'}</td>
                    <td className="py-3.5 px-4 text-center">{row.h ? '✅ ALLOW' : '—'}</td>
                    <td className="py-3.5 px-4 text-center">{row.c ? '✅ ALLOW' : '—'}</td>
                    <td className="py-3.5 px-4 text-center">{row.f ? '✅ ALLOW' : '—'}</td>
                    <td className="py-3.5 px-4 text-center">{row.s ? '✅ ALLOW' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 5: Audit Trail Logs */}
      {activeTab === 'audit' && isPrincipal && (
        <Card className="p-0 overflow-hidden shadow-xs border-stone-200 dark:border-stone-800">
          <div className="p-4 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-50">
                Principal Security Audit Trail & Verification Logs
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Immutable event stream for system audits, credential changes, and authorization decisions.
              </p>
            </div>
            <span className="font-mono text-xs text-indigo-600 font-bold">
              {auditLogs.length} Logged Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-mono text-stone-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-stone-800 dark:text-stone-200">{log.userName}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md text-[11px] border border-indigo-200/50 dark:border-indigo-800/50">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">{log.target}</td>
                    <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{log.details}</td>
                    <td className="py-3 px-4 font-mono text-stone-400 text-[11px]">{log.ipAddress || '192.168.1.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Slide-Over Security Profile Drawer */}
      <UserSecurityDrawer
        user={inspectingUser}
        isOpen={!!inspectingUser}
        onClose={() => setInspectingUser(null)}
        onOpenChangePwd={(u) => {
          setUserToChangePwd(u);
          setNewPassword('');
          setIsChangePwdOpen(true);
        }}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={(newUser) => {
          setInspectingUser(newUser);
        }}
      />

      {/* Change Password Modal */}
      <Modal
        isOpen={isChangePwdOpen}
        onClose={() => setIsChangePwdOpen(false)}
        title={`Change Password — ${userToChangePwd?.name}`}
        description="Issue fresh credentials with instant cryptographic hashing and audit trail logging."
      >
        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter minimum 6 characters"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsChangePwdOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" pill>
              Save & Log Change
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
