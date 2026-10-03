import { FileQuestion, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-[#FAFAF9] dark:bg-[#0F0F0F]">
      <div className="max-w-md bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            404 · Page Not Found
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-50">
            Lost in the Academic Hallway?
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            The page or placement resource you are looking for has been moved, renamed, or does not exist in this portal.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Button
            variant="primary"
            size="md"
            pill
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
