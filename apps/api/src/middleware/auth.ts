import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Role, UserSession } from '../types';

export interface AuthRequest extends Request {
  user?: UserSession;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No authorization token provided.',
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as UserSession;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

export const requireRoles = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowedRoles = roles.map((r) => r.toUpperCase());

    // Super Admin / Principal has global access
    if (userRole === 'PRINCIPAL' || userRole === 'SUPER_ADMIN') {
      return next();
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted. Required roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

export const requireDepartmentScope = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const userRole = (req.user.role || '').toUpperCase();
  if (userRole === 'PRINCIPAL' || userRole === 'SUPER_ADMIN') {
    return next();
  }

  // If HOD or Coordinator, enforce departmentId query/body match
  const requestedDeptId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
  if (requestedDeptId && req.user.departmentId && requestedDeptId !== req.user.departmentId) {
    return res.status(403).json({
      success: false,
      message: 'Department isolation violation: You can only access records from your assigned department.',
    });
  }

  next();
};
