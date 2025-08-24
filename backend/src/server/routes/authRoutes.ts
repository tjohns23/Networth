import express from 'express';
import type { Request, Response } from 'express';
import User from '../models/user.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Request body interfaces
interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// Response interfaces
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface ErrorResponse {
  message: string;
  errors?: string[];
}

// POST /auth/register - Create new user account
router.post('/register', async (req: Request<{}, AuthResponse | ErrorResponse, RegisterRequestBody>, res: Response<AuthResponse | ErrorResponse>) => {
  try {
    const { email, password, name } = req.body;

    // Basic validation
    const errors: string[] = [];
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    if (!name) errors.push('Name is required');
    if (password && password.length < 6) errors.push('Password must be at least 6 characters long');
    
    // Email format validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Create new user (password will be hashed automatically by the pre-save middleware)
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name.trim()
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email
    });

    // Return user data (without password) and token
    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    res.status(500).json({ message: 'Error creating user account' });
  }
});

// POST /auth/login - Authenticate user and return token
router.post('/login', async (req: Request<{}, AuthResponse | ErrorResponse, LoginRequestBody>, res: Response<AuthResponse | ErrorResponse>) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password using the instance method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email
    });

    // Return user data (without password) and token
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// POST /auth/logout - Logout user (client-side token removal)
router.post('/logout', (_req: Request, res: Response) => {
  // With JWT, logout is typically handled client-side by removing the token
  // This endpoint exists for consistency and potential future server-side logout logic
  res.json({ message: 'Logged out successfully' });
});

// GET /auth/me - Get current user info (requires authentication)
import { authenticateUser } from '../middleware/auth.js';

router.get('/me', authenticateUser, (req: Request, res: Response) => {
  // The authenticateUser middleware ensures req.user exists
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  res.json({
    user: req.user
  });
});

export default router;