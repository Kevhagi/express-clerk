import { Request, Response, NextFunction } from 'express'

/**
 * Middleware to log all requests with X-CLERK-ID header
 * Logs the header value if present, or indicates if it's missing
 */
export const clerkIdLogger = (req: Request, res: Response, next: NextFunction) => {
  const clerkId = req.headers['x-clerk-id'] || req.headers['X-CLERK-ID']
  
  if (clerkId) {
    console.log(`[${new Date().toISOString()}] X-CLERK-ID: ${clerkId} - ${req.method} ${req.path}`)
  } else {
    console.log(`[${new Date().toISOString()}] X-CLERK-ID: MISSING - ${req.method} ${req.path}`)
  }
  
  next()
}

/**
 * Enhanced version with additional request details
 * Includes IP address, user agent, and request body size
 */
export const enhancedClerkIdLogger = (req: Request, res: Response, next: NextFunction) => {
  const clerkId = req.headers['x-clerk-id'] || req.headers['X-CLERK-ID']
  const timestamp = new Date().toISOString()
  const ip = req.ip || req.connection.remoteAddress || 'unknown'
  const userAgent = req.get('User-Agent') || 'unknown'
  const contentLength = req.get('Content-Length') || '0'
  
  const logData = {
    timestamp,
    clerkId: clerkId || 'MISSING',
    method: req.method,
    path: req.path,
    ip,
    userAgent: userAgent.substring(0, 100), // Truncate long user agents
    contentLength
  }
  
  console.log(`[${logData.timestamp}] X-CLERK-ID: ${logData.clerkId} - ${logData.method} ${logData.path} - IP: ${logData.ip} - Size: ${logData.contentLength} bytes`)
  
  next()
}

