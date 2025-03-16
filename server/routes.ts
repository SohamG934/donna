import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Import controllers
import * as authController from "./controllers/authController";
import * as pdfController from "./controllers/pdfController";
import * as argumentController from "./controllers/argumentController";
import * as lawController from "./controllers/lawController";

// Import middleware
import { authMiddleware } from "./middleware/auth";
import { rateLimitMiddleware } from "./middleware/rateLimit";
import multer from "multer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();
  
  // Auth routes
  apiRouter.post("/auth/register", authController.register);
  apiRouter.post("/auth/login", authController.login);
  
  // Protected routes
  apiRouter.use(authMiddleware);
  apiRouter.use(rateLimitMiddleware);
  
  // PDF routes
  apiRouter.post("/pdf/upload", pdfController.uploadPdf);
  apiRouter.get("/pdf/documents", pdfController.getUserDocuments);
  apiRouter.delete("/pdf/documents/:id", pdfController.deleteDocument);
  apiRouter.post("/pdf/ask", pdfController.askPdf);
  apiRouter.get("/pdf/chats/:id", pdfController.getChatMessages);
  
  // Argument routes
  apiRouter.post("/argument/generate", argumentController.generateArgument);
  apiRouter.get("/argument/list", argumentController.getUserArguments);
  apiRouter.get("/argument/:id", argumentController.getArgument);
  
  // Law search routes
  apiRouter.post("/law/search", lawController.searchLaw);
  apiRouter.get("/law/searches", lawController.getUserSearches);
  apiRouter.get("/law/search/:id", lawController.getSearch);
  
  // Use API router with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
