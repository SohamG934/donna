import { Request, Response } from 'express';
import { storage } from '../storage';
import { processPdf } from '../utils/pdfProcessor';
import { storeDocumentEmbeddings, retrieveRelevantChunks } from '../utils/vectorStore';
import { generatePdfResponse } from '../utils/aiModels';
import { AuthRequest } from '../middleware/auth';
import { askPdfSchema } from '@shared/schema';
import multer from 'multer';
import { ZodError } from 'zod';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

export const uploadPdf = async (req: AuthRequest, res: Response) => {
  try {
    // Handle file upload
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Document title is required' });
      }
      
      // Process PDF
      const { fullText, chunks } = await processPdf(req.file.buffer);
      
      // Save document
      const document = await storage.createDocument({
        userId: req.user!.id,
        title,
        content: fullText,
        metadata: {
          filename: req.file.originalname,
          size: req.file.size,
          chunks: chunks.length
        }
      });
      
      // Store embeddings
      await storeDocumentEmbeddings(document.id, chunks);
      
      return res.status(201).json({
        message: 'Document uploaded successfully',
        document: {
          id: document.id,
          title: document.title,
          metadata: document.metadata,
          createdAt: document.createdAt
        }
      });
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    return res.status(500).json({ message: 'Failed to upload PDF' });
  }
};

export const getUserDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await storage.getDocumentsByUserId(req.user!.id);
    
    return res.status(200).json({
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        metadata: doc.metadata,
        createdAt: doc.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user documents error:', error);
    return res.status(500).json({ message: 'Failed to retrieve documents' });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    if (isNaN(documentId)) {
      return res.status(400).json({ message: 'Invalid document ID' });
    }
    
    // Check if document exists and belongs to user
    const document = await storage.getDocument(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    if (document.userId !== req.user!.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this document' });
    }
    
    // Delete document
    await storage.deleteDocument(documentId);
    
    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({ message: 'Failed to delete document' });
  }
};

export const askPdf = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = askPdfSchema.parse(req.body);
    
    // Check if document exists and belongs to user
    const document = await storage.getDocument(validatedData.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    if (document.userId !== req.user!.id) {
      return res.status(403).json({ message: 'You are not authorized to access this document' });
    }
    
    // Retrieve relevant chunks
    const relevantChunks = await retrieveRelevantChunks(
      validatedData.documentId,
      validatedData.query
    );
    
    // Create or get existing chat
    let chat = (await storage.getChatsByDocumentId(validatedData.documentId))[0];
    if (!chat) {
      chat = await storage.createChat({
        userId: req.user!.id,
        documentId: validatedData.documentId
      });
    }
    
    // Save user message
    await storage.createMessage({
      chatId: chat.id,
      content: validatedData.query,
      role: 'user'
    });
    
    // Generate response
    const aiResponse = await generatePdfResponse(
      validatedData.query,
      relevantChunks.map(chunk => chunk.text)
    );
    
    // Save AI response
    const message = await storage.createMessage({
      chatId: chat.id,
      content: aiResponse,
      role: 'assistant'
    });
    
    return res.status(200).json({
      answer: aiResponse,
      messageId: message.id,
      chatId: chat.id
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    console.error('Ask PDF error:', error);
    return res.status(500).json({ message: 'Failed to process query' });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = parseInt(req.params.id);
    if (isNaN(chatId)) {
      return res.status(400).json({ message: 'Invalid chat ID' });
    }
    
    // Check if chat exists and belongs to user
    const chat = await storage.getChat(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (chat.userId !== req.user!.id) {
      return res.status(403).json({ message: 'You are not authorized to access this chat' });
    }
    
    // Get messages
    const messages = await storage.getMessagesByChatId(chatId);
    
    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Get chat messages error:', error);
    return res.status(500).json({ message: 'Failed to retrieve chat messages' });
  }
};
