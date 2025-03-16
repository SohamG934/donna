import { Request, Response } from 'express';
import { storage } from '../storage';
import { loginSchema, registerSchema } from '@shared/schema';
import { createToken } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(validatedData.username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user without confirmPassword field
    const { confirmPassword, ...userData } = validatedData;
    
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword
    });
    
    // Create token
    const token = createToken(user.id, user.username);
    
    // Return user info and token
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await storage.getUserByUsername(validatedData.username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = createToken(user.id, user.username);
    
    // Return user info and token
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};
