import { useState } from 'react';
import { useAuthStore } from '../../auth/stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useStudentStore } from '../../students/stores/studentStore';
import { useCompanyStore } from '../../companies/stores/companyStore';
import { usePlacementStore } from '../../placements/stores/placementStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Badge } from '../../../shared/components/ui/Badge';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { ThemeToggle } from '../../../shared/components/ThemeToggle';
import {
  Settings,
  User,
  Palette,
  Bell,
  Shield,
  Database,
  AlertTriangle,
  RotateCcw,
  Download,
  Trash2,
  RefreshCw,
  Archive,
  CheckCircle2,
  Users,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { user, updateCurrentUser } = useAuthStore();
  const {
    theme,
    emailNotifications,
    driveAlerts,
    interviewReminders,
    aiInsightsAlerts,
    twoFactorEnabled,
    toggleSetting,
  } = useSettingsStore();

  const {
    students,
    recycleBin: studentTrash,
    restoreStudent,
    emptyRecycleBin: emptyStudentTrash,
    clearAllStudents,
  } = useStudentStore();

  const {
    companies,
    recycleBin: companyTrash,
    restoreFromRecycleBin,
    emptyRecycleBin: emptyCompanyTrash,
    clearAllCompanies,
  } = useCompanyStore();

  const { clearAllPlacements } = usePlacementStore();

  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'notifications' | 'security' | 'data' | 'recycleBin'>('account');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Confirm Modals State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
  });

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, email });
    toast.success('Account profile updated successfully!');
  };

  const handleResetStudentsOnly = () => {
    // Delete students and push into trash
    const allIds = students.map((s) => s.id);
    useStudentStore.getState().bulkDeleteStudents(allIds);
    toast.success('All student records wiped and archived into Recycle Bin!');
  };

  const handleResetCompaniesOnly = () => {
    companies.forEach((c) => {
      useCompanyStore.getState().deleteCompany(c.id);
    });
    toast.success('All company records wiped and archived into Recycle Bin!');
  };

  const handleResetAllData = () => {
    handleResetStudentsOnly();
    handleResetCompaniesOnly();
    clearAllPlacements();
    toast.success('Complete system data wiped and backed up into Recycle Bin!');
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      user,
      app: 'placement-pro-enterprise',
      version: '2026.1.0',
      totalStudents: students.length,
      totalCompanies: companies.length,
      students,
      companies,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Placement_Pro_Full_Backup_${Date.now()}.json`;
    a.click();
    toast.success('Full database backup downloaded!');
  };

  const totalTrashCount = (studentTrash?.length || 0) + (companyTrash?.length || 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
          <Settings className="w-3.5 h-3.5" />
          System Preferences & Governance
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
          Settings & Data Administration
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Manage system preferences, data wipes, backups, and Recycle Bin recovery.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex overflow-x-auto bg-stone-100 dark:bg-stone-800/80 p-1 rounded-2xl gap-1 max-w-3xl custom-scrollbar">
        {[
          { id: 'account', name: 'Account', icon: User },
          { id: 'appearance', name: 'Appearance', icon: Palette },
          { id: 'notifications', name: 'Notifications', icon: Bell },
          { id: 'security', name: 'Security', icon: Shield },
          { id: 'data', name: 'Data Wipe & Reset', icon: Database },
          {
            id: 'recycleBin',
            name: `Recycle Bin ${totalTrashCount > 0 ? `(${totalTrashCount})` : ''}`,
            icon: Archive,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* ACCOUNT TAB */}
      {activeTab === 'account' && (
        <Card className="max-w-2xl space-y-6">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
            Personal Profile Information
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full bg-stone-200 ring-2 ring-indigo-500/20"
            />
            <div>
              <div className="font-bold text-sm text-stone-900 dark:text-stone-50">{user?.name}</div>
              <div className="text-xs text-stone-500 capitalize">{user?.role} Role</div>
            </div>
          </div>

          <form onSubmit={handleSaveAccount} className="space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="primary" size="sm" pill type="submit">
              Save Profile Changes
            </Button>
          </form>
        </Card>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <Card className="max-w-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              Theme & Interface Styling
            </h3>
            <p className="text-xs text-stone-500">
              Switch between Light, Charcoal Dark, and System Preferences.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Color Theme</div>
              <div className="text-xs text-stone-500 capitalize">Currently: {theme} Mode</div>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <Card className="max-w-2xl space-y-6">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
            Notification Preferences
          </h3>

          <div className="space-y-3">
            {[
              { key: 'emailNotifications', title: 'Email Digest Notifications', desc: 'Receive daily placement round summaries' },
              { key: 'driveAlerts', title: 'New Recruitment Drive Alerts', desc: 'Instant push when high-CTC companies register' },
              { key: 'interviewReminders', title: 'Interview Slot Reminders', desc: '1 hour countdown before scheduled technical rounds' },
              { key: 'aiInsightsAlerts', title: 'AI ATS Score Recommendations', desc: 'Tips when recruiter skill requirements update' },
            ].map((item) => (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{item.title}</div>
                  <div className="text-xs text-stone-500">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={
                    item.key === 'emailNotifications'
                      ? emailNotifications
                      : item.key === 'driveAlerts'
                      ? driveAlerts
                      : item.key === 'interviewReminders'
                      ? interviewReminders
                      : aiInsightsAlerts
                  }
                  onChange={() => toggleSetting(item.key as any)}
                  className="w-5 h-5 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <Card className="max-w-2xl space-y-6">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
            Security & Authentication
          </h3>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Two-Factor Authentication (2FA)
              </div>
              <div className="text-xs text-stone-500">
                Enforce TOTP / Authenticator on staff logins
              </div>
            </div>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={() => {
                toggleSetting('twoFactorEnabled');
                toast.success(`2FA ${!twoFactorEnabled ? 'Enabled' : 'Disabled'}`);
              }}
              className="w-5 h-5 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </Card>
      )}

      {/* DATA WIPE & RESET PANEL TAB */}
      {activeTab === 'data' && (
        <div className="space-y-6 max-w-3xl">
          {/* Backup Card */}
          <Card className="space-y-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              Database Export & Backup
            </h3>
            <p className="text-xs text-stone-500">
              Download complete institutional configuration, active drives, and student records in JSON format.
            </p>
            <Button
              variant="outline"
              size="sm"
              pill
              onClick={handleExportBackup}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Full Database Backup (.JSON)
            </Button>
          </Card>

          {/* Granular System Reset & Wipe Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-50 font-extrabold text-base">
              <Database className="w-5 h-5 text-indigo-600" />
              Granular Data Wipe & Reset Controls
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Select specific entity domains to wipe. All deleted records are automatically backed up in the Recycle Bin for instant recovery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Reset Student Data Only */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-stone-100">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Reset Student Data Only
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Wipes all {students.length} student profiles and moves them to Trash.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  pill
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      title: 'Reset Student Data Only?',
                      message: `This will wipe ${students.length} student records and archive them into the Recycle Bin.`,
                      action: handleResetStudentsOnly,
                    })
                  }
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  className="w-full text-xs font-semibold"
                >
                  Wipe Students Only
                </Button>
              </div>

              {/* Reset Company Data Only */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-stone-100">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    Reset Company Data Only
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Wipes all {companies.length} hiring partners and moves them to Trash.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  pill
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      title: 'Reset Company Data Only?',
                      message: `This will wipe ${companies.length} hiring partner records and archive them into the Recycle Bin.`,
                      action: handleResetCompaniesOnly,
                    })
                  }
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  className="w-full text-xs font-semibold"
                >
                  Wipe Companies Only
                </Button>
              </div>
            </div>

            {/* Total Danger Zone (Delete All Data) */}
            <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  Total System Wipe (Factory Reset)
                </div>
                <Badge variant="danger" size="sm">
                  Full Reset
                </Badge>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Wipes both student and company directories simultaneously with snapshots archived in the Recycle Bin.
              </p>
              <Button
                variant="danger"
                size="sm"
                pill
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    title: 'Delete All System Data?',
                    message:
                      'This will wipe all active students, companies, and drives, moving them to the Recycle Bin for recovery.',
                    action: handleResetAllData,
                  })
                }
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="font-bold"
              >
                Delete All Data (Move to Trash)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RECYCLE BIN / TRASH RECOVERY TAB */}
      {activeTab === 'recycleBin' && (
        <div className="space-y-5 max-w-3xl">
          <div className="flex items-center justify-between bg-white dark:bg-[#1C1C1C] rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-50">
                  Recycle Bin & Trash Recovery
                </h3>
                <p className="text-xs text-stone-500">
                  {totalTrashCount} archived record{totalTrashCount !== 1 ? 's' : ''} available for 1-click restore
                </p>
              </div>
            </div>

            {totalTrashCount > 0 && (
              <Button
                variant="danger"
                size="sm"
                pill
                onClick={() => {
                  emptyStudentTrash();
                  emptyCompanyTrash();
                  toast.success('Recycle Bin permanently purged!');
                }}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Empty Recycle Bin
              </Button>
            )}
          </div>

          {totalTrashCount === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#1C1C1C] rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                Recycle Bin is Empty
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                No deleted student or company records currently archived.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Deleted Students */}
              {studentTrash && studentTrash.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block px-1">
                    Archived Students ({studentTrash.length})
                  </span>
                  {studentTrash.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                          {item.student.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            {item.student.name} ({item.student.registerNumber})
                          </div>
                          <div className="text-[11px] text-stone-400">
                            {item.student.department} · Deleted on {new Date(item.deletedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        pill
                        onClick={() => {
                          restoreStudent(item.id);
                          toast.success(`Restored ${item.student.name} successfully!`);
                        }}
                        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                        className="text-xs font-bold px-3 py-1"
                      >
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Deleted Companies */}
              {companyTrash && companyTrash.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block px-1">
                    Archived Companies ({companyTrash.length})
                  </span>
                  {companyTrash.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            {item.entityName}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            Archived Partner · Deleted on {new Date(item.deletedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        pill
                        onClick={() => {
                          restoreFromRecycleBin(item.id);
                          toast.success(`Restored ${item.entityName} successfully!`);
                        }}
                        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                        className="text-xs font-bold px-3 py-1"
                      >
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Confirm Wipe"
        variant="danger"
      />
    </div>
  );
};
