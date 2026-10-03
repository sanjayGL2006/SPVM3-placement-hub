import React, { useState } from 'react';
import { SecurityEvaluationOutput, useUsersStore } from '../stores/usersStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import {
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  XCircle,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LiveSecurityConsoleProps {
  onOpenSimulator?: () => void;
}

export const LiveSecurityConsole: React.FC<LiveSecurityConsoleProps> = ({ onOpenSimulator }) => {
  const { securityOutputs, clearSecurityOutputs } = useUsersStore();
  const [filterDecision, setFilterDecision] = useState<'all' | 'ALLOW' | 'DENY'>('all');
  const [selectedOutput, setSelectedOutput] = useState<SecurityEvaluationOutput | null>(
    securityOutputs[0] || null
  );

  const filteredOutputs = securityOutputs.filter((out) => {
    if (filterDecision === 'all') return true;
    return out.decision === filterDecision;
  });

  const handleCopyLog = (out: SecurityEvaluationOutput) => {
    navigator.clipboard.writeText(JSON.stringify(out, null, 2));
    toast.success(`Copied output payload for ${out.id} to clipboard`);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(securityOutputs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `security_evaluation_output_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Security evaluation outputs exported as JSON');
  };

  return (
    <div className="space-y-4">
      {/* Console Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
                Live RBAC Security Output Console
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  REAL-TIME OUTPUT
                </span>
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Inspecting real-time authorization queries, rule evaluation verdicts, and department isolation outputs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSimulator && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenSimulator}
              leftIcon={<Play className="w-3.5 h-3.5" />}
              pill
            >
              Test Policy Query
            </Button>
          )}

          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700">
            <button
              onClick={() => setFilterDecision('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterDecision === 'all'
                  ? 'bg-stone-700 text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({securityOutputs.length})
            </button>
            <button
              onClick={() => setFilterDecision('ALLOW')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterDecision === 'ALLOW'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Allow
            </button>
            <button
              onClick={() => setFilterDecision('DENY')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterDecision === 'DENY'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Deny
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-stone-300 border-stone-700 hover:bg-stone-800"
          >
            Export JSON
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearSecurityOutputs}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            className="text-stone-400 hover:text-red-400"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Main Console Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Stream List (Left column) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
          {filteredOutputs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
              <div className="text-sm font-bold text-stone-700 dark:text-stone-300">
                No Security Evaluation Outputs Found
              </div>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Trigger a policy test in the RBAC Simulator or perform user management actions to see real-time output streams.
              </p>
              {onOpenSimulator && (
                <Button variant="primary" size="sm" onClick={onOpenSimulator} pill>
                  Launch RBAC Simulator
                </Button>
              )}
            </div>
          ) : (
            filteredOutputs.map((out) => {
              const isSelected = selectedOutput?.id === out.id;
              const isAllowed = out.decision === 'ALLOW';

              return (
                <div
                  key={out.id}
                  onClick={() => setSelectedOutput(out)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm ring-1 ring-indigo-500/20'
                      : 'bg-white dark:bg-[#1C1C1C] border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold ${
                          isAllowed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/60'
                        }`}
                      >
                        {isAllowed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {out.decision} ({out.httpStatus})
                      </span>
                      <span className="text-[11px] font-mono text-stone-400 font-semibold">{out.id}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {out.timestamp.slice(11)}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                    {out.targetAction}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                    <span className="truncate max-w-[140px] font-medium">
                      User: {out.evaluatedUser.name}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {out.evaluatedUser.role.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Output Detail Inspector (Right column) */}
        <div className="lg:col-span-7">
          {selectedOutput ? (
            <Card className="space-y-4 border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 p-5">
              {/* Output Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold ${
                        selectedOutput.decision === 'ALLOW'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {selectedOutput.decision === 'ALLOW' ? (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      )}
                      HTTP {selectedOutput.httpStatus} {selectedOutput.decision}
                    </span>
                    <span className="text-xs font-mono text-stone-400 font-bold">{selectedOutput.id}</span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 dark:text-stone-50 text-base">
                    {selectedOutput.targetAction}
                  </h4>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Target Resource: <strong>{selectedOutput.targetResource}</strong>{' '}
                    {selectedOutput.targetDepartment && `(${selectedOutput.targetDepartment})`}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLog(selectedOutput)}
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                >
                  Copy Log
                </Button>
              </div>

              {/* Verdict Explanation Box */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  selectedOutput.decision === 'ALLOW'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="font-bold mb-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Policy Evaluation Decision:
                </div>
                {selectedOutput.reason}
              </div>

              {/* Evaluated Rules Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Evaluated Policy Rules ({selectedOutput.evaluatedRules.length})
                </div>
                <div className="space-y-1.5">
                  {selectedOutput.evaluatedRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-stone-200/80 dark:border-stone-800 flex items-start gap-2.5 text-xs"
                    >
                      {rule.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {rule.name}
                        </div>
                        <div className="text-stone-500 dark:text-stone-400 text-[11px]">
                          {rule.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject & JWT Claim Snapshot */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Subject Identity & Context Snapshot</span>
                  <span className="font-mono text-[10px] text-stone-400">{selectedOutput.timestamp}</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 text-stone-200 font-mono text-[11px] overflow-x-auto shadow-inner border border-stone-800 space-y-1">
                  <span className="text-indigo-400"># User:</span> {selectedOutput.evaluatedUser.name} ({selectedOutput.evaluatedUser.role.toUpperCase()})
                  <br />
                  <span className="text-indigo-400"># Dept:</span> {selectedOutput.evaluatedUser.department || 'ALL'}
                  <br />
                  <span className="text-indigo-400"># Token Claim Subject:</span> {selectedOutput.tokenClaims.sub}
                  <br />
                  <span className="text-indigo-400"># Issuer:</span> {selectedOutput.tokenClaims.iss}
                  <br />
                  <span className="text-emerald-400"># Security Audit Log:</span> Automatically recorded to immutable trail (LOG-VERIFIED)
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-stone-400">
              Select an output record from the left stream to inspect rule diagnostics.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
