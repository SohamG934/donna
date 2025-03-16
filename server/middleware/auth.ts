import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || 'lexai-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export const createToken = (userId: number, username: string): string => {
  return jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
};

export const validateToken = (token: string): { id: number; username: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string };
  } catch (error) {
    return null;
  }
};

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = validateToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    
    const user = await storage.getUser(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    
    req.user = { id: user.id, username: user.username };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
