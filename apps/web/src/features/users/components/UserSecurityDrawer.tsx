import React, { useState } from 'react';
import { ManagedUser, useUsersStore } from '../stores/usersStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { useSettingsStore } from '../../settings/stores/settingsStore';
import { Drawer } from '../../../shared/components/ui/Drawer';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import {
  Shield,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Copy,
  Terminal,
  Activity,
  UserCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserSecurityDrawerProps {
  user: ManagedUser | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChangePwd: (user: ManagedUser) => void;
}

export const UserSecurityDrawer: React.FC<UserSecurityDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onOpenChangePwd,
}) => {
  const { demoLogin } = useAuthStore();
  const { toggleUserStatus, updateUser } = useUsersStore();
  const { addAuditLog } = useSettingsStore();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'permissions' | 'token' | 'diagnostics'>('profile');

  if (!user) return null;

  const isSuspended = user.status === 'suspended';

  const handleToggleStatus = () => {
    const nextStatus = isSuspended ? 'active' : 'suspended';
    toggleUserStatus(user.id, nextStatus);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: nextStatus === 'active' ? 'ACCOUNT_REACTIVATED' : 'ACCOUNT_SUSPENDED',
      target: `${user.name} (${user.email})`,
      details: `Account status updated to ${nextStatus.toUpperCase()} via User Administration & Security Controls.`,
      ipAddress: user.ipAddress || '192.168.1.1',
    });
    toast.success(`Account for ${user.name} is now ${nextStatus.toUpperCase()}`);
  };

  const handleToggle2FA = () => {
    const next2FA = !user.twoFactorEnabled;
    updateUser(user.id, { twoFactorEnabled: next2FA });
    addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: next2FA ? '2FA_ENROLLED' : '2FA_DISABLED',
      target: user.email,
      details: `Two-Factor Authentication was ${next2FA ? 'enabled' : 'disabled'}.`,
    });
    toast.success(`2FA ${next2FA ? 'enabled' : 'disabled'} for ${user.name}`);
  };

  const handleImpersonate = () => {
    demoLogin(user.id);
    toast.success(`Switched active session to: ${user.name} (${user.role.toUpperCase()})`);
    onClose();
  };

  const handleCopyJson = () => {
    const outputData = {
      user_id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'College-Wide Super Admin',
      course: user.course || 'All Courses',
      status: user.status,
      two_factor_auth: user.twoFactorEnabled ? 'ENFORCED' : 'OPTIONAL',
      permissions: user.permissions,
      token_payload_mock: {
        iss: 'https://auth.placementpro.college.edu',
        sub: user.id,
        aud: 'placement-pro-core',
        role: user.role,
        department_isolation: user.department || 'BYPASS_ALL',
        permissions_count: user.permissions.length,
        exp: 1773000000,
      },
    };
    navigator.clipboard.writeText(JSON.stringify(outputData, null, 2));
    toast.success('Security JSON profile copied to clipboard!');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="User Security Profile & Output Inspector"
      subtitle={`ID: ${user.id} • ${user.email}`}
      width="xl"
    >
      <div className="space-y-6">
        {/* User Quick Header */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-800 p-1 border border-stone-200 dark:border-stone-700 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-stone-900 dark:text-stone-50 text-base">
                  {user.name}
                </h3>
                <Badge
                  variant={
                    user.role === 'principal'
                      ? 'warning'
                      : user.role === 'hod'
                      ? 'primary'
                      : user.role === 'coordinator'
                      ? 'success'
                      : 'info'
                  }
                  size="sm"
                >
                  {user.role.toUpperCase()}
                </Badge>
                {isSuspended ? (
                  <Badge variant="danger" size="sm">
                    SUSPENDED
                  </Badge>
                ) : (
                  <Badge variant="success" size="sm">
                    ACTIVE
                  </Badge>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1.5 font-medium">
                <span>Dept: {user.department || 'College-Wide'}</span>
                <span>•</span>
                <span>Course: {user.course || 'All'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant={isSuspended ? 'primary' : 'outline'}
              size="sm"
              onClick={handleToggleStatus}
              leftIcon={isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            >
              {isSuspended ? 'Reactivate' : 'Suspend'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChangePwd(user)}
              leftIcon={<Key className="w-3.5 h-3.5" />}
            >
              Password
            </Button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2 pb-1">
          {[
            { id: 'profile', label: 'Security Overview' },
            { id: 'permissions', label: `Granted Claims (${user.permissions.length})` },
            { id: 'token', label: 'JWT Token Claims' },
            { id: 'diagnostics', label: 'Raw Output Inspector' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Security Overview */}
        {activeSubTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <div className="text-stone-400 font-medium">Department Isolation Scope</div>
                <div className="font-bold text-stone-800 dark:text-stone-200">
                  {user.department ? `${user.department} Only` : 'College-Wide (Super Admin Bypass)'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <div className="text-stone-400 font-medium">Authentication Multi-Factor (2FA)</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {user.twoFactorEnabled ? 'Enforced & Verified' : 'Standard Password'}
                  </span>
                  <button
                    onClick={handleToggle2FA}
                    className="text-[10px] text-indigo-600 hover:underline font-bold"
                  >
                    {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <div className="text-stone-400 font-medium">Last Login & Session</div>
                <div className="font-mono text-stone-800 dark:text-stone-200 font-semibold">
                  {user.lastLogin || '2026-03-09 11:24:00'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <div className="text-stone-400 font-medium">Recorded Client IP</div>
                <div className="font-mono text-stone-800 dark:text-stone-200 font-semibold">
                  {user.ipAddress || '192.168.1.15'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>Active RBAC Authorization Guard</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                This account operates under tier <strong>{user.role.toUpperCase()}</strong>. Dynamic queries
                against students, drives, and reports will strictly isolate data to{' '}
                <strong>{user.department || 'all college departments'}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Granted Permissions */}
        {activeSubTab === 'permissions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Direct Action Claims & Capability Scopes:</span>
              <span className="font-mono font-bold text-indigo-600">
                {user.permissions.includes('*') ? 'Wildcard (*)' : `${user.permissions.length} Grants`}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-[320px] overflow-y-auto p-1">
              {user.permissions.map((perm, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {perm}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: JWT Token Claims */}
        {activeSubTab === 'token' && (
          <div className="space-y-3">
            <div className="text-xs text-stone-500">
              Simulated Cryptographic JWT Payload (RS256 Verified):
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto shadow-inner border border-stone-800 space-y-1">
              <div className="text-stone-500">// Header</div>
              <div className="text-pink-400">
                {JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'key_2026_placement' }, null, 2)}
              </div>
              <div className="text-stone-500 pt-2">// Payload Claims</div>
              <div className="text-emerald-400">
                {JSON.stringify(
                  {
                    sub: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    dept: user.department || 'ALL',
                    course: user.course || 'ALL',
                    scope: user.permissions,
                    iss: 'https://auth.placementpro.college.edu',
                    iat: 1773050000,
                    exp: 1773136400,
                  },
                  null,
                  2
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Diagnostics */}
        {activeSubTab === 'diagnostics' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5 font-bold">
                <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                Live Security JSON Inspection Output
              </span>
              <Button variant="outline" size="sm" onClick={handleCopyJson}>
                Copy JSON
              </Button>
            </div>
            <pre className="p-3 rounded-2xl bg-stone-900 text-amber-300 font-mono text-xs overflow-x-auto border border-stone-800 leading-relaxed max-h-[320px]">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {/* Bottom Drawer Actions */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyJson}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            Copy Security JSON
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImpersonate}
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              Test As This User
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
