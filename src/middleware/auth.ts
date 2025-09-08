import type { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JwtPayload } from '../utils/jwt';
import { MembershipLimits } from '../utils/membership';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | undefined;
      membershipLimits?: MembershipLimits | undefined;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      message: 'Access token is required',
      code: 401,
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      message: 'Invalid or expired token',
      code: 403,
    });
    return;
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      req.user = undefined;
    }
  }

  next();
}
