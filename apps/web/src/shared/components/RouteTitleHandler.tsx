import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLE_MAP: Record<string, string> = {
  '/login': 'Login — Placement Pro',
  '/forbidden': 'Access Denied — Placement Pro',
  '/dashboard': 'Dashboard — Placement Pro',
  '/students': 'Student Directory — Placement Pro',
  '/companies': 'Company Directory — Placement Pro',
  '/drives': 'Placement Drives — Placement Pro',
  '/placements': 'Placements Tracker — Placement Pro',
  '/reports': 'Placement Reports — Placement Pro',
  '/reports/annual': 'Annual Placement Report — Placement Pro',
  '/ai-chat': 'AI Career Assistant — Placement Pro',
  '/resume-analyzer': 'Resume Analyzer — Placement Pro',
  '/resume-builder': 'Resume Builder — Placement Pro',
  '/skills-gap': 'Skills Gap Analysis — Placement Pro',
  '/mock-tests': 'Mock Tests — Placement Pro',
  '/mock-interview': 'Mock Interview — Placement Pro',
  '/users': 'User Management — Placement Pro',
  '/settings': 'Settings — Placement Pro',
};

export const RouteTitleHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (TITLE_MAP[pathname]) {
      document.title = TITLE_MAP[pathname];
    } else if (pathname.startsWith('/students/')) {
      document.title = 'Student Profile — Placement Pro';
    } else if (pathname.startsWith('/companies/') && pathname.includes('/drive')) {
      document.title = 'Placement Drive — Placement Pro';
    } else if (pathname.startsWith('/companies/')) {
      document.title = 'Company Details — Placement Pro';
    } else {
      document.title = '404 Page Not Found — Placement Pro';
    }
  }, [location.pathname]);

  return null;
};
