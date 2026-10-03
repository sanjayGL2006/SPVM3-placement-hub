import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            403 · Access Denied
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-50">
            Department Scope Restricted
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Your current role or department does not have sufficient permissions to view or edit this resource. Please contact your Principal or HOD.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            pill
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            pill
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
