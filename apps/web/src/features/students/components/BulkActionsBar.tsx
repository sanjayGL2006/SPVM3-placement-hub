import { useState } from 'react';
import { CheckSquare, Trash2, Download, CheckCircle2, Briefcase, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { PlacementStatus } from '../../../shared/types/student.types';

export interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkStatusUpdate: (status: PlacementStatus, companyName?: string, packageLPA?: number) => void;
  onBulkExport: () => void;
  onAssignToDrive: () => void;
}

export const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkStatusUpdate,
  onBulkExport,
  onAssignToDrive,
}: BulkActionsBarProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<PlacementStatus>('Placed');
  const [companyName, setCompanyName] = useState('Deloitte');
  const [packageLPA, setPackageLPA] = useState(8.5);

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-slide-up border border-stone-700 dark:border-stone-300">
        <div className="flex items-center gap-2 border-r border-stone-700 dark:border-stone-300 pr-4">
          <CheckSquare className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
          <span className="text-xs font-bold whitespace-nowrap">
            {selectedCount === 1 ? '1 Student Selected' : `${selectedCount} Students Selected`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Update Button */}
          <button
            onClick={() => setStatusDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:hover:bg-stone-300 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            Update Status
          </button>

          {/* Assign to Drive Button */}
          <button
            onClick={onAssignToDrive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 dark:bg-indigo-500/20 dark:text-indigo-600 dark:hover:bg-indigo-500/30 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Assign to Drive
          </button>

          {/* Export Selected Button */}
          <button
            onClick={onBulkExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:hover:bg-stone-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Selected
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-600/90 hover:bg-red-600 text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>

          {/* Deselect All */}
          <button
            onClick={onClearSelection}
            className="p-1 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 text-stone-400 hover:text-white dark:hover:text-stone-900 transition-colors ml-1"
            title="Deselect All"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          onBulkDelete();
          setDeleteDialogOpen(false);
        }}
        title={`Delete ${selectedCount} Students?`}
        message="This action cannot be undone. All academic records, resumes, and placement history for these students will be permanently deleted."
        confirmText="Delete Selected"
        variant="danger"
      />

      {/* Status Update Modal */}
      {statusDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                Bulk Update Status ({selectedCount} Students)
              </h3>
              <button
                onClick={() => setStatusDialogOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Target Status
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as PlacementStatus)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="Placed">Placed</option>
                  <option value="In Process">In Process</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Opted Out">Opted Out</option>
                  <option value="Not Eligible">Not Eligible</option>
                </select>
              </div>

              {targetStatus === 'Placed' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                      Company
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Deloitte"
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                      Package (₹ LPA)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={packageLPA}
                      onChange={(e) => setPackageLPA(Number(e.target.value))}
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2 text-sm"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Button variant="outline" size="sm" pill onClick={() => setStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                pill
                onClick={() => {
                  onBulkStatusUpdate(targetStatus, targetStatus === 'Placed' ? companyName : undefined, targetStatus === 'Placed' ? packageLPA : undefined);
                  setStatusDialogOpen(false);
                }}
              >
                Apply Updates
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
