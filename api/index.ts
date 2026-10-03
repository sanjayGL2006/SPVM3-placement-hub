export default function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Favicon handler
  if (req.url === '/favicon.ico' || req.url?.startsWith('/favicon')) {
    res.setHeader('Content-Type', 'image/x-icon');
    return res.status(204).end();
  }

  // Health check endpoint
  if (req.url === '/api/health' || req.url === '/health') {
    return res.status(200).json({
      status: 'healthy',
      service: 'Placement Pro Enterprise API (Vercel Serverless)',
      timestamp: new Date().toISOString(),
      version: '2026.1.0'
    });
  }

  // Default API response
  return res.status(200).json({
    app: 'Placement Pro Enterprise Backend API',
    status: 'Online',
    version: '2026.1.0',
    health: '/api/health',
    timestamp: new Date().toISOString(),
    message: 'Placement Pro Serverless API is operational.'
  });
}
