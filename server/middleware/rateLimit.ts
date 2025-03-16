import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Simple in-memory rate limiting
// For production, use a more robust solution like Redis
const requestCounts = new Map<number, { count: number, resetTime: number }>();

const RATE_LIMIT = 10; // 10 requests per minute
const WINDOW_SIZE = 60 * 1000; // 1 minute in milliseconds

export const rateLimitMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next();
  }

  const userId = req.user.id;
  const now = Date.now();
  
  // Get or initialize user's rate limit data
  let userData = requestCounts.get(userId);
  
  if (!userData || now > userData.resetTime) {
    // Create new window if none exists or if the previous window expired
    userData = { count: 0, resetTime: now + WINDOW_SIZE };
    requestCounts.set(userId, userData);
  }
  
  // Increment request count
  userData.count++;
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT - userData.count).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(userData.resetTime / 1000).toString());
  
  // Check if rate limit exceeded
  if (userData.count > RATE_LIMIT) {
    return res.status(429).json({
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((userData.resetTime - now) / 1000)
    });
  }
  
  next();
};
