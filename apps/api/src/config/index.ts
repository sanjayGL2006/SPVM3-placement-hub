import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config(); // fallback

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'placement-pro-super-secure-jwt-secret-key-2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'placement-pro-refresh-token-secret-2026',
  jwtExpiresIn: '24h' as const,
  jwtRefreshExpiresIn: '7d' as const,
  databaseMode: process.env.DATABASE_MODE || 'mock', // 'postgres' | 'mock'
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/placement_pro?schema=public',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  uploadDir: path.resolve(process.cwd(), 'uploads'),
};
