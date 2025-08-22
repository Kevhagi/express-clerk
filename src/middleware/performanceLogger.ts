import { Request, Response, NextFunction } from 'express'

/**
 * Middleware to log request execution time for performance monitoring
 * This will help identify slow endpoints
 */
export const performanceLogger = (req: Request, res: Response, next: Function) => {
  // Skip logging for root path requests - return early without any response modification
  if (req.path === '/') {
    console.log('🔍 DEBUG: Skipping performance log for root path /')
    return next()
  }
  
  const startTime = Date.now()
  
  // Check if detailed logging is enabled
  const detailedLogging = process.env.PERFORMANCE_DETAILED_LOGGING === 'true'
  const logAllRequests = process.env.PERFORMANCE_LOG_ALL === 'true'
  
  // Override res.end to capture the response time
  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any, cb?: () => void) {
    // Double-check: don't log if this is a root path request
    if (req.path === '/') {
      return originalEnd.call(this, chunk, encoding, cb)
    }
    
    const endTime = Date.now()
    const executionTime = endTime - startTime
    
    // Always log slow requests (>= 500ms)
    const shouldLog = logAllRequests || executionTime >= 500
    
    if (shouldLog) {
      // Log performance metrics
      const timestamp = new Date().toISOString()
      const method = req.method
      const path = req.path
      const statusCode = res.statusCode
      
      // Color coding for different performance levels
      let performanceLevel = '🟢' // Fast (< 100ms)
      if (executionTime >= 1000) {
        performanceLevel = '🔴' // Slow (>= 1s)
      } else if (executionTime >= 500) {
        performanceLevel = '🟡' // Medium (500ms - 1s)
      } else if (executionTime >= 100) {
        performanceLevel = '🟠' // Moderate (100ms - 500ms)
      }
      
      if (detailedLogging) {
        const userAgent = req.get('User-Agent') || 'Unknown'
        const ip = req.ip || req.connection.remoteAddress || 'Unknown'
        const contentLength = res.get('Content-Length') || 'Unknown'
        
        console.log(
          `${performanceLevel} [${timestamp}] ${method} ${path} - ${executionTime}ms - Status: ${statusCode} - IP: ${ip} - UA: ${userAgent} - Size: ${contentLength}`
        )
      } else {
        console.log(
          `${performanceLevel} [${timestamp}] ${method} ${path} - ${executionTime}ms - Status: ${statusCode}`
        )
      }
      
      // Log slow requests with more detail
      if (executionTime >= 1000) {
        console.warn(`⚠️  SLOW REQUEST DETECTED: ${method} ${path} took ${executionTime}ms`)
      }
    }
    
    // Call the original res.end
    return originalEnd.call(this, chunk, encoding, cb)
  }
  
  next()
}
