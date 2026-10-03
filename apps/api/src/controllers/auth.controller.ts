import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';
import { UserSession } from '../types';

export class AuthController {
  public static async login(req: Request, res: Response) {
    const { email } = req.body;

    const user = mockDb.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const tokenPayload: UserSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      departmentName: user.departmentName,
      courseId: user.courseId,
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: '24h',
    });

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    mockDb.logAudit('USER_LOGIN', 'User', String(user.id), { email: user.email }, tokenPayload);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: tokenPayload,
      },
    });
  }

  public static async logout(req: AuthRequest, res: Response) {
    if (req.user) {
      mockDb.logAudit('USER_LOGOUT', 'User', String(req.user.id), undefined, req.user);
    }

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  public static async getMe(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }

  public static async refreshSession(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing',
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
      const user = mockDb.users.find((u) => u.id === decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
        });
      }

      const tokenPayload: UserSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        departmentName: user.departmentName,
      };

      const newToken = jwt.sign(tokenPayload, config.jwtSecret, {
        expiresIn: '24h',
      });

      res.cookie('token', newToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        data: {
          token: newToken,
          user: tokenPayload,
        },
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }
  }

  public static async getPredefinedAccounts(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      data: mockDb.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        departmentName: u.departmentName,
      })),
    });
  }
}
