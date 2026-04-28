import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware to restrict access based on user roles.
 * @param allowedRoles Array of roles that are allowed to access the route.
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.warn('[ROLE ERROR] No user object found on request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userRole = req.user.role.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!isAllowed) {
      console.warn(`[ROLE ERROR] Access denied. User Role: ${req.user.role}, Allowed Roles: ${allowedRoles.join(', ')}`);
      return res.status(403).json({ 
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]` 
      });
    }

    next();
  };
};
