import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  GraduationCap,
  Building2,
  Calendar,
  Sparkles,
  Bot,
  FileText,
  Wand2,
  Target,
  Brain,
  Video,
} from 'lucide-react';
import { Modal } from '../../shared/components/ui/Modal';
import { useStudentStore } from '../../features/students/stores/studentStore';
import { useCompanyStore } from '../../features/companies/stores/companyStore';
import { getCompanyLogo } from '../../shared/utils/companyLogos';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { students, setSelectedStudent } = useStudentStore();
  const { companies, setSelectedCompany } = useCompanyStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredStudents = query
    ? students
        .filter(
          (s: any) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.registerNumber.toLowerCase().includes(query.toLowerCase()) ||
            s.skills.some((sk: string) => sk.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const filteredCompanies = query
    ? companies
        .filter(
          (c: any) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.industry.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const quickNav = [
    { title: 'Dashboard Overview', path: '/dashboard', icon: Sparkles, desc: 'Placement KPIs and visual analytics' },
    { title: 'AI Placement Chatbot', path: '/ai-chat', icon: Bot, desc: 'Natural language placement intelligence assistant' },
    { title: 'ATS Resume Analyzer', path: '/resume-analyzer', icon: FileText, desc: 'Score resumes & get keyword recommendations' },
    { title: 'AI Resume Builder', path: '/resume-builder', icon: Wand2, desc: 'Single-column high-scoring PDF generator' },
    { title: 'Skills Gap Radar', path: '/skills-gap', icon: Target, desc: 'Benchmark skills vs. top dream companies' },
    { title: 'AI Mock Tests', path: '/mock-tests', icon: Brain, desc: 'Timed aptitude & CS practice test engine' },
    { title: 'AI Mock Interview Coach', path: '/mock-interview', icon: Video, desc: 'Speech & text interview simulation' },
    { title: 'Student Directory', path: '/students', icon: GraduationCap, desc: 'Manage 200+ student profiles and resumes' },
    { title: 'Company Partners', path: '/companies', icon: Building2, desc: 'Partner hiring directory and packages' },
    { title: 'Active Placement Drives', path: '/drives', icon: Calendar, desc: 'Drive calendar, registration deadlines & hiring rounds' },
    { title: 'Placement Pipeline & Rounds', path: '/placements', icon: Calendar, desc: 'Selection stages and pipeline tracking' },
    { title: 'Analytics & Reports', path: '/reports', icon: FileText, desc: 'Salary distribution, department comparisons & hiring trends' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="-m-6">
        {/* Search Header */}
        <div className="flex items-center px-5 py-4 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Type a student name, company, skill, or page..."
            className="w-full bg-transparent text-stone-900 dark:text-stone-50 text-base placeholder-stone-400 focus:outline-none"
          />
          <span className="text-[11px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-500 px-2 py-0.5 rounded-md shrink-0">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Navigation Pages */}
          {!query && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
                Quick Navigation
              </div>
              <div className="space-y-1 mt-1">
                {quickNav.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 text-stone-600 dark:text-stone-300 group-hover:text-indigo-600">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                        {item.title}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Student Matches */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
                Students
              </div>
              <div className="space-y-1 mt-1">
                {filteredStudents.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStudent(s);
                      handleNavigate('/students');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                          {s.name}
                        </div>
                        <div className="text-xs text-stone-500">
                          {s.course} · {s.registerNumber} · CGPA: {s.academic.cgpa}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                      {s.placement.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Company Matches */}
          {filteredCompanies.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
                Companies
              </div>
              <div className="space-y-1 mt-1">
                {filteredCompanies.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCompany(c);
                      handleNavigate('/companies');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getCompanyLogo(c.name, c.logo)}
                        alt={c.name}
                        className="w-7 h-7 object-contain rounded-lg p-0.5 bg-white border border-stone-200"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          (e.currentTarget as HTMLImageElement).src = getCompanyLogo(c.name);
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                          {c.name}
                        </div>
                        <div className="text-xs text-stone-500">{c.industry}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                      ₹{c.packageRange.min} - ₹{c.packageRange.max} LPA
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredStudents.length === 0 && filteredCompanies.length === 0 && (
            <div className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
              No results found for "<span className="font-semibold text-stone-700 dark:text-stone-200">{query}</span>"
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
