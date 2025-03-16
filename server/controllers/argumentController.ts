import { Request, Response } from 'express';
import { storage } from '../storage';
import { generateLegalArgument } from '../utils/aiModels';
import { AuthRequest } from '../middleware/auth';
import { generateArgumentSchema } from '@shared/schema';
import { ZodError } from 'zod';

export const generateArgument = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = generateArgumentSchema.parse(req.body);
    
    // Generate AI argument
    const generatedContent = await generateLegalArgument(
      validatedData.title,
      validatedData.jurisdiction,
      validatedData.type,
      validatedData.acts,
      validatedData.facts,
      validatedData.side
    );
    
    // Save argument
    const argument = await storage.createArgument({
      userId: req.user!.id,
      title: validatedData.title,
      caseDetails: validatedData,
      generatedContent
    });
    
    return res.status(201).json({
      message: 'Legal argument generated successfully',
      argument: {
        id: argument.id,
        title: argument.title,
        generatedContent: argument.generatedContent,
        createdAt: argument.createdAt
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    console.error('Generate argument error:', error);
    return res.status(500).json({ message: 'Failed to generate legal argument' });
  }
};

export const getUserArguments = async (req: AuthRequest, res: Response) => {
  try {
    const userArguments = await storage.getArgumentsByUserId(req.user!.id);
    
    return res.status(200).json({
      arguments: userArguments.map(arg => ({
        id: arg.id,
        title: arg.title,
        createdAt: arg.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user arguments error:', error);
    return res.status(500).json({ message: 'Failed to retrieve arguments' });
  }
};

export const getArgument = async (req: AuthRequest, res: Response) => {
  try {
    const argumentId = parseInt(req.params.id);
    if (isNaN(argumentId)) {
      return res.status(400).json({ message: 'Invalid argument ID' });
    }
    
    // Check if argument exists and belongs to user
    const argument = await storage.getArgument(argumentId);
    if (!argument) {
      return res.status(404).json({ message: 'Argument not found' });
    }
    
    if (argument.userId !== req.user!.id) {
      return res.status(403).json({ message: 'You are not authorized to access this argument' });
    }
    
    return res.status(200).json({ argument });
  } catch (error) {
    console.error('Get argument error:', error);
    return res.status(500).json({ message: 'Failed to retrieve argument' });
  }
};
