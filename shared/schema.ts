import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  documentId: integer("document_id").references(() => documents.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chats.id),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  createdAt: timestamp("created_at").defaultNow(),
});

export const legalArguments = pgTable("arguments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  caseDetails: jsonb("case_details").notNull(),
  generatedContent: text("generated_content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lawSearches = pgTable("law_searches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  query: text("query").notNull(),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export const insertChatSchema = createInsertSchema(chats).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertArgumentSchema = createInsertSchema(legalArguments).omit({ id: true, createdAt: true });
export const insertLawSearchSchema = createInsertSchema(lawSearches).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertChat = z.infer<typeof insertChatSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertArgument = z.infer<typeof insertArgumentSchema>;
export type InsertLawSearch = z.infer<typeof insertLawSearchSchema>;

export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Argument = typeof legalArguments.$inferSelect;
export type LawSearch = typeof lawSearches.$inferSelect;

// Additional schemas for API requests
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const askPdfSchema = z.object({
  documentId: z.number(),
  query: z.string().min(1, "Query is required"),
});

export const generateArgumentSchema = z.object({
  title: z.string().min(1, "Case title is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  type: z.string().min(1, "Case type is required"),
  acts: z.string().min(1, "Relevant acts/sections are required"),
  facts: z.string().min(1, "Case facts are required"),
  side: z.enum(["prosecution", "defense"]),
});

export const searchLawSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  filters: z.array(z.string()).optional(),
});
