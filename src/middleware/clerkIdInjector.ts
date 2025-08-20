import { Request, Response, NextFunction } from 'express'

// Extend the Express Request interface to include clerkId
declare global {
  namespace Express {
    interface Request {
      clerkId?: string;
    }
  }
}

/**
 * Enhanced version that also logs the clerk ID
 */
export const clerkIdInjectorWithLogging = (req: Request, res: Response, next: NextFunction) => {
  const clerkId = req.headers['x-clerk-id'] as string || req.headers['X-CLERK-ID'] as string || 'system';
  
  // Inject the clerk ID into the request object
  req.clerkId = clerkId;
  
  // Log the request with clerk ID
  console.log(`[${new Date().toISOString()}] X-CLERK-ID: ${clerkId} - ${req.method} ${req.path}`);
  
  next();
}
