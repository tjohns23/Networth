import jwt, { Secret } from "jsonwebtoken";
import type { Request, Response, NextFunction } from 'express';
import User from '../models/user.js';

// Define the payload shape (single definition)
interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] = process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

// Authentication middleware
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET as Secret) as JWTPayload;
    
    // Optional: Verify user still exists in database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user info to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name
    };

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

// Optional: Middleware for optional authentication (user might or might not be logged in)
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next(); // Continue without user
    }

    const decoded = jwt.verify(token, JWT_SECRET as Secret) as JWTPayload;
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      };
    }

    return next();
  } catch (error) {
    // If token is invalid, just continue without user
    return next();
  }
};

// Utility function to generate JWT tokens
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET as Secret, { expiresIn: JWT_EXPIRES_IN });
};