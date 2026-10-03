import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

export const app: Express = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any origin or localhost
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static React web build if available
const webDistCandidates = [
  path.resolve(__dirname, '../../web/dist'),
  path.resolve(process.cwd(), 'apps/web/dist'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(__dirname, '../public'),
];

let staticDir: string | null = null;
for (const cand of webDistCandidates) {
  if (fs.existsSync(cand) && fs.existsSync(path.join(cand, 'index.html'))) {
    staticDir = cand;
    break;
  }
}

if (staticDir) {
  app.use(express.static(staticDir));
}

// Favicon handler
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

// Health check endpoint
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Placement Pro Enterprise API',
    version: '2026.1.0',
    environment: process.env.NODE_ENV || 'production',
  });
});

// Mock Analytics & Stats Endpoint
app.get('/api/stats', (req: Request, res: Response) => {
  res.status(200).json({
    totalStudents: 1420,
    placedStudents: 1184,
    placementRate: 83.4,
    activeDrives: 28,
    partnerCompanies: 85,
    averagePackageLPA: 9.8,
    highestPackageLPA: 44.5,
    upcomingDrivesCount: 6,
  });
});

// Mock Calendar Drives Endpoint
app.get('/api/calendar', (req: Request, res: Response) => {
  res.status(200).json({
    month: 'September 2026',
    drives: [
      { id: 'drv-1', company: 'Google Cloud', date: '2026-09-04', role: 'Cloud Engineer', ctc: '28 LPA', stage: 'Online Assessment' },
      { id: 'drv-2', company: 'Microsoft', date: '2026-09-08', role: 'Software Engineer', ctc: '44 LPA', stage: 'Technical Round 1' },
      { id: 'drv-3', company: 'Amazon AWS', date: '2026-09-12', role: 'SDE-1', ctc: '32 LPA', stage: 'System Design Interview' },
      { id: 'drv-4', company: 'Goldman Sachs', date: '2026-09-15', role: 'Quant Analyst', ctc: '30 LPA', stage: 'Aptitude & Coding' },
      { id: 'drv-5', company: 'Morgan Stanley', date: '2026-09-18', role: 'Technology Analyst', ctc: '26 LPA', stage: 'HR & Director Round' },
      { id: 'drv-6', company: 'Oracle', date: '2026-09-22', role: 'Database Engineer', ctc: '22 LPA', stage: 'Final Selection' },
      { id: 'drv-7', company: 'Cisco Systems', date: '2026-09-26', role: 'Network Software Engineer', ctc: '20 LPA', stage: 'Group Discussion' },
    ],
  });
});

// Mock Companies Endpoint
app.get('/api/companies', (req: Request, res: Response) => {
  res.status(200).json([
    { id: 'comp-1', name: 'Google Cloud', tier: 'Tier-1 Dream', ctc: '28 LPA', eligibilityCgpa: 8.5, applicants: 142, status: 'Active' },
    { id: 'comp-2', name: 'Microsoft', tier: 'Tier-1 Dream', ctc: '44 LPA', eligibilityCgpa: 8.8, applicants: 198, status: 'Active' },
    { id: 'comp-3', name: 'Amazon AWS', tier: 'Tier-1 Dream', ctc: '32 LPA', eligibilityCgpa: 8.0, applicants: 215, status: 'Active' },
    { id: 'comp-4', name: 'Goldman Sachs', tier: 'Super Dream', ctc: '30 LPA', eligibilityCgpa: 8.5, applicants: 89, status: 'Scheduled' },
    { id: 'comp-5', name: 'Morgan Stanley', tier: 'Dream', ctc: '26 LPA', eligibilityCgpa: 7.8, applicants: 110, status: 'In Progress' },
  ]);
});

// Root handler: serve SPA index.html or rich portal
app.get('/', (req: Request, res: Response) => {
  if (staticDir && fs.existsSync(path.join(staticDir, 'index.html'))) {
    return res.sendFile(path.join(staticDir, 'index.html'));
  }

  const acceptsHtml = req.accepts('html');
  if (acceptsHtml) {
    const frontendUrl = process.env.FRONTEND_URL || 'https://spvm-3-placement-hub.vercel.app';
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Placement Pro Enterprise API Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0F1117;
      --card-bg: rgba(22, 27, 38, 0.85);
      --border: rgba(255, 255, 255, 0.08);
      --primary: #6366F1;
      --primary-hover: #4F46E5;
      --emerald: #10B981;
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg);
      background-image: 
        radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container {
      max-width: 900px;
      width: 100%;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--emerald);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--emerald);
      box-shadow: 0 0 10px var(--emerald);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.9); }
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.lead {
      color: var(--text-muted);
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      transition: all 0.2s ease;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
    }
    .card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
    }
    .card-title {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: var(--primary);
      color: #FFF;
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    .code-box {
      background: #090B10;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #38BDF8;
      margin-top: 24px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="dot"></span>
      Placement Pro Serverless API Online
    </div>
    <h1>SPVM3 Placement & Company Drive Hub</h1>
    <p class="lead">Enterprise placement management platform powering real-time campus recruitment drives, student pipeline analytics, and multi-tier department isolation.</p>
    
    <div class="btn-group" style="margin-bottom: 32px;">
      <a href="${frontendUrl}" class="btn btn-primary" target="_blank" rel="noopener">
        🚀 Open React Dashboard
      </a>
      <a href="/api/health" class="btn btn-secondary">
        🩺 API Health Check
      </a>
      <a href="/api/calendar" class="btn btn-secondary">
        📅 Placement Calendar API
      </a>
    </div>

    <div class="grid">
      <a href="/api/health" class="card">
        <div class="card-title"><span>Health Endpoint</span> <span style="color: var(--emerald)">GET</span></div>
        <div class="card-desc">Real-time health telemetry, server uptime, and status verification.</div>
      </a>
      <a href="/api/stats" class="card">
        <div class="card-title"><span>Analytics & KPIs</span> <span style="color: #60A5FA">GET</span></div>
        <div class="card-desc">1,420 enrolled students, 83.4% placement rate, average LPA metrics.</div>
      </a>
      <a href="/api/calendar" class="card">
        <div class="card-title"><span>Placement Calendar</span> <span style="color: #F472B6">GET</span></div>
        <div class="card-desc">September 2026 drive schedules including Google, Microsoft & AWS.</div>
      </a>
      <a href="/api/companies" class="card">
        <div class="card-title"><span>Company Drives</span> <span style="color: #FBBF24">GET</span></div>
        <div class="card-desc">Tier-1 Dream & Super Dream recruitment partner pipelines.</div>
      </a>
    </div>

    <div class="code-box">
      curl -X GET https://spvm-3-placement-hub-api.vercel.app/api/health
    </div>
  </div>
</body>
</html>`;
    return res.status(200).send(html);
  }

  // Default JSON API response
  return res.status(200).json({
    name: 'Placement Pro Enterprise Backend API',
    version: '2026.1.0',
    status: 'online',
    health: '/api/health',
    frontendUrl: 'https://spvm-3-placement-hub.vercel.app',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      calendar: '/api/calendar',
      companies: '/api/companies',
    },
    message: 'Placement Pro Serverless API is operational.',
  });
});

// SPA fallback for all non-API routes
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  if (staticDir && fs.existsSync(path.join(staticDir, 'index.html'))) {
    return res.sendFile(path.join(staticDir, 'index.html'));
  }
  next();
});

// 404 Catch-All Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}. For the Web Dashboard, visit https://spvm-3-placement-hub.vercel.app`,
  });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
