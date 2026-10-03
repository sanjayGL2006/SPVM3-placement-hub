import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './app/layout/AppLayout';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { LoginPage } from './features/auth/pages/LoginPage';
import { ForbiddenPage } from './features/auth/pages/ForbiddenPage';
import { NotFoundPage } from './features/auth/pages/NotFoundPage';
import { RouteTitleHandler } from './shared/components/RouteTitleHandler';

import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { StudentDirectoryPage } from './features/students/pages/StudentDirectoryPage';
import { StudentProfilePage } from './features/students/pages/StudentProfilePage';
import { CompanyDirectoryPage } from './features/companies/pages/CompanyDirectoryPage';
import { CompanyDriveDetailPage } from './features/companies/pages/CompanyDriveDetailPage';
import { PlacementDrivesPage } from './features/companies/pages/PlacementDrivesPage';
import { PlacementsPage } from './features/placements/pages/PlacementsPage';
import { ReportsPage } from './features/reports/pages/ReportsPage';
import { AnnualReportPage } from './features/reports/pages/AnnualReportPage';

import { AiChatbotPage } from './features/ai-intelligence/pages/AiChatbotPage';
import { ResumeAnalyzerPage } from './features/ai-intelligence/pages/ResumeAnalyzerPage';
import { ResumeGeneratorPage } from './features/ai-intelligence/pages/ResumeGeneratorPage';
import { SkillsGapPage } from './features/ai-intelligence/pages/SkillsGapPage';
import { MockTestPage } from './features/ai-intelligence/pages/MockTestPage';
import { MockInterviewPage } from './features/ai-intelligence/pages/MockInterviewPage';

import { UsersPage } from './features/users/pages/UsersPage';
import { SettingsPage } from './features/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <>
        <RouteTitleHandler />
        <LoginPage />
      </>
    ),
  },
  {
    path: '/forbidden',
    element: (
      <>
        <RouteTitleHandler />
        <ForbiddenPage />
      </>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RouteTitleHandler />
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'students',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty']}>
            <StudentDirectoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'students/:id',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty']}>
            <StudentProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'companies',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty']}>
            <CompanyDirectoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'companies/:id/drive',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty']}>
            <CompanyDriveDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'drives',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator']}>
            <PlacementDrivesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'placements',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty', 'student']}>
            <PlacementsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty']}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports/annual',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator']}>
            <AnnualReportPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ai-chat',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty', 'student']}>
            <AiChatbotPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'resume-analyzer',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'student']}>
            <ResumeAnalyzerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'resume-builder',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'student']}>
            <ResumeGeneratorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'skills-gap',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'student']}>
            <SkillsGapPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'mock-tests',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'student']}>
            <MockTestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'mock-interview',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'student']}>
            <MockInterviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty', 'student']}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute allowedRoles={['principal', 'hod', 'coordinator', 'faculty', 'student']}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <>
        <RouteTitleHandler />
        <NotFoundPage />
      </>
    ),
  },
]);

