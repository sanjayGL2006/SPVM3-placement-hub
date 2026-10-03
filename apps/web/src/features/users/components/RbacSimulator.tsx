import React, { useState } from 'react';
import { ManagedUser, useUsersStore, SecurityEvaluationOutput } from '../stores/usersStore';
import { useSettingsStore } from '../../settings/stores/settingsStore';
import { Department } from '../../../shared/types/global.types';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import {
  ShieldCheck,
  ShieldAlert,
  Play,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RbacSimulatorProps {
  onSuccessEvaluation?: () => void;
}

const SIMULATED_ACTIONS = [
  { id: 'STUDENT_DIRECTORY_VIEW', label: 'View Student Directory & Profiles', res: 'Student Directory Table' },
  { id: 'STUDENT_CRUD_RECORD', label: 'Create / Modify Student Placement Record', res: 'Student Profile Editor' },
  { id: 'DELETE_STUDENT_RECORD', label: 'Delete Student Record (Destructive)', res: 'Student Directory Database' },
  { id: 'SCHEDULE_CAMPUS_DRIVE', label: 'Create & Schedule Enterprise Drive', res: 'Company Drive Pipeline' },
  { id: 'REPORTS_ANNUAL_EXPORT', label: 'Export Annual Placement Report (PDF/Excel)', res: 'Executive Board Report' },
  { id: 'CREATE_USER_STAFF', label: 'Provision New Coordinator/Faculty Account', res: 'User Administration Panel' },
  { id: 'AI_RESUME_ANALYZER_ACCESS', label: 'Execute AI Resume ATS Parser', res: 'AI Intelligence Suite' },
  { id: 'VIEW_SECURITY_AUDIT_TRAIL', label: 'Access Principal Security Audit Trail', res: 'Security Audit Logs' },
];

const DEPARTMENTS: Department[] = [
  'Computer Applications',
  'Business Administration',
  'Commerce',
  'Science',
  'Hotel Management',
];

export const RbacSimulator: React.FC<RbacSimulatorProps> = ({ onSuccessEvaluation }) => {
  const { users, evaluateSecurityPolicy } = useUsersStore();
  const { addAuditLog } = useSettingsStore();

  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const [selectedAction, setSelectedAction] = useState<string>(SIMULATED_ACTIONS[0].id);
  const [targetDepartment, setTargetDepartment] = useState<Department>('Computer Applications');
  const [latestOutput, setLatestOutput] = useState<SecurityEvaluationOutput | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const handleRunEvaluation = () => {
    if (!selectedUser) {
      toast.error('Please select a user to evaluate');
      return;
    }

    setIsEvaluating(true);
    const actionObj = SIMULATED_ACTIONS.find((a) => a.id === selectedAction) || SIMULATED_ACTIONS[0];

    setTimeout(() => {
      const output = evaluateSecurityPolicy(
        selectedUser,
        selectedAction,
        actionObj.res,
        targetDepartment
      );

      setLatestOutput(output);
      setIsEvaluating(false);

      // Log to system audit trail
      addAuditLog({
        userId: selectedUser.id,
        userName: selectedUser.name,
        userRole: selectedUser.role,
        action: output.decision === 'ALLOW' ? 'POLICY_EVAL_ALLOWED' : 'POLICY_EVAL_DENIED',
        target: `${actionObj.label} (${targetDepartment})`,
        details: output.reason,
        ipAddress: selectedUser.ipAddress || '192.168.1.1',
      });

      if (output.decision === 'ALLOW') {
        toast.success(`Policy Output: ALLOW (${output.httpStatus} OK)`);
      } else {
        toast.error(`Policy Output: DENY (${output.httpStatus} Forbidden)`);
      }

      onSuccessEvaluation?.();
    }, 250);
  };

  return (
    <Card className="p-5 sm:p-6 space-y-6 bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/50">
            <Zap className="w-3.5 h-3.5" />
            Interactive Security Engine
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            RBAC & Department Isolation Policy Simulator
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Simulate how the security engine evaluates access decisions across roles and department boundaries.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          pill
          onClick={handleRunEvaluation}
          disabled={isEvaluating}
          leftIcon={<Play className="w-4 h-4" />}
          className="shadow-md shadow-indigo-500/20"
        >
          {isEvaluating ? 'Evaluating Output...' : 'Evaluate Policy Output'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Step 1: Select Subject User */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 space-y-2.5">
          <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">
            1. Select Subject (User Account)
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role.toUpperCase()} ({u.department || 'College-Wide'})
              </option>
            ))}
          </select>

          {selectedUser && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-stone-100">{selectedUser.name}</span>
                <Badge variant="primary" size="sm">
                  {selectedUser.role.toUpperCase()}
                </Badge>
              </div>
              <div className="text-[11px] text-stone-500 truncate">
                Dept: {selectedUser.department || 'All (Super Admin)'}
              </div>
              <div className="text-[10px] text-stone-400 font-mono truncate">
                Status: {selectedUser.status.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Target Action & Resource */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 space-y-2.5">
          <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">
            2. Target Action & Capability
          </label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            {SIMULATED_ACTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>

          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 space-y-1 text-[11px] text-stone-600 dark:text-stone-400">
            <div>
              Resource Target:{' '}
              <strong className="text-stone-800 dark:text-stone-200">
                {SIMULATED_ACTIONS.find((a) => a.id === selectedAction)?.res}
              </strong>
            </div>
          </div>
        </div>

        {/* Step 3: Target Resource Department */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 space-y-2.5">
          <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">
            3. Resource Department Scope
          </label>
          <select
            value={targetDepartment}
            onChange={(e) => setTargetDepartment(e.target.value as Department)}
            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 text-[11px] text-stone-500">
            Testing boundary cross-access between {selectedUser?.department || 'Super Admin'} and {targetDepartment}.
          </div>
        </div>
      </div>

      {/* Live Output Banner & Rule Breakdown */}
      {latestOutput && (
        <div className="space-y-4 pt-2 animate-fade-in">
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
              latestOutput.decision === 'ALLOW'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  latestOutput.decision === 'ALLOW' ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {latestOutput.decision === 'ALLOW' ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-tight">
                    Decision: {latestOutput.decision} (HTTP {latestOutput.httpStatus})
                  </span>
                  <span className="font-mono text-[11px] opacity-75">ID: {latestOutput.id}</span>
                </div>
                <p className="text-xs leading-relaxed font-medium">{latestOutput.reason}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] font-mono opacity-70">Evaluated in 2.4ms</div>
              <div className="text-[11px] font-bold mt-0.5">RBAC Policy Guard 2026</div>
            </div>
          </div>

          {/* Evaluated Rules Matrix */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Rule-by-Rule Audit Breakdown
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {latestOutput.evaluatedRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/60 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-[11px]">
                      {rule.name}
                    </span>
                    {rule.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    {rule.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
