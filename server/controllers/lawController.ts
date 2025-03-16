import { Request, Response } from 'express';
import { storage } from '../storage';
import { searchLawDatabase } from '../utils/aiModels';
import { AuthRequest } from '../middleware/auth';
import { searchLawSchema } from '@shared/schema';
import { ZodError } from 'zod';
import axios from 'axios';

// Function to search Indian Kanoon API (or a similar legal database)
// This is a simulation since we don't have actual API access
const searchLegalDatabase = async (query: string, filters: string[] = []): Promise<any> => {
  try {
    // In a real implementation, we would use the actual API
    // For now, we'll use our AI model to generate responses
    const response = await searchLawDatabase(query);
    
    // Simulated structure for search results
    const results = {
      acts: {
        results: [],
        total: 0
      },
      cases: {
        results: [],
        total: 0
      },
      commentaries: {
        results: [],
        total: 0
      }
    };
    
    // Parse the AI response and structure it
    // This is simplified for the demo
    
    return {
      response,
      results
    };
  } catch (error) {
    console.error('Legal database search error:', error);
    throw new Error('Failed to search legal database');
  }
};

export const searchLaw = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = searchLawSchema.parse(req.body);
    
    // Search legal database
    const searchResults = await searchLegalDatabase(
      validatedData.query,
      validatedData.filters
    );
    
    // Save search
    const lawSearch = await storage.createLawSearch({
      userId: req.user!.id,
      query: validatedData.query,
      results: searchResults
    });
    
    return res.status(200).json({
      message: 'Law search completed',
      search: {
        id: lawSearch.id,
        query: lawSearch.query,
        results: lawSearch.results,
        createdAt: lawSearch.createdAt
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    console.error('Law search error:', error);
    return res.status(500).json({ message: 'Failed to search law database' });
  }
};

export const getUserSearches = async (req: AuthRequest, res: Response) => {
  try {
    const searches = await storage.getLawSearchesByUserId(req.user!.id);
    
    return res.status(200).json({
      searches: searches.map(search => ({
        id: search.id,
        query: search.query,
        createdAt: search.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user searches error:', error);
    return res.status(500).json({ message: 'Failed to retrieve searches' });
  }
};

export const getSearch = async (req: AuthRequest, res: Response) => {
  try {
    const searchId = parseInt(req.params.id);
    if (isNaN(searchId)) {
      return res.status(400).json({ message: 'Invalid search ID' });
    }
    
    // Check if search exists and belongs to user
    const search = await storage.getLawSearch(searchId);
    if (!search) {
      return res.status(404).json({ message: 'Search not found' });
    }
    
    if (search.userId !== req.user!.id) {
      return res.status(403).json({ message: 'You are not authorized to access this search' });
    }
    
    return res.status(200).json({ search });
  } catch (error) {
    console.error('Get search error:', error);
    return res.status(500).json({ message: 'Failed to retrieve search' });
  }
};
