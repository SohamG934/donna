import { 
  users, 
  documents, 
  chats, 
  messages, 
  legalArguments, 
  lawSearches,
  type User, 
  type Document, 
  type Chat, 
  type Message, 
  type Argument, 
  type LawSearch,
  type InsertUser,
  type InsertDocument,
  type InsertChat,
  type InsertMessage,
  type InsertArgument,
  type InsertLawSearch
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByUserId(userId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Chat operations
  getChat(id: number): Promise<Chat | undefined>;
  getChatsByUserId(userId: number): Promise<Chat[]>;
  getChatsByDocumentId(documentId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  // Message operations
  getMessagesByChatId(chatId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Argument operations
  getArgument(id: number): Promise<Argument | undefined>;
  getArgumentsByUserId(userId: number): Promise<Argument[]>;
  createArgument(argument: InsertArgument): Promise<Argument>;
  
  // Law search operations
  getLawSearch(id: number): Promise<LawSearch | undefined>;
  getLawSearchesByUserId(userId: number): Promise<LawSearch[]>;
  createLawSearch(lawSearch: InsertLawSearch): Promise<LawSearch>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  private arguments: Map<number, Argument>;
  private lawSearches: Map<number, LawSearch>;
  
  currentUserId: number;
  currentDocumentId: number;
  currentChatId: number;
  currentMessageId: number;
  currentArgumentId: number;
  currentLawSearchId: number;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.arguments = new Map();
    this.lawSearches = new Map();
    
    this.currentUserId = 1;
    this.currentDocumentId = 1;
    this.currentChatId = 1;
    this.currentMessageId = 1;
    this.currentArgumentId = 1;
    this.currentLawSearchId = 1;
    
    // Add a demo user
    this.createUser({
      username: "demo",
      password: "password",
      email: "demo@example.com",
      name: "Adv. Rahul Sharma"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.userId === userId,
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const createdAt = new Date();
    const document: Document = { ...insertDocument, id, createdAt };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Chat operations
  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async getChatsByUserId(userId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.userId === userId,
    );
  }

  async getChatsByDocumentId(documentId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.documentId === documentId,
    );
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = this.currentChatId++;
    const createdAt = new Date();
    const chat: Chat = { ...insertChat, id, createdAt };
    this.chats.set(id, chat);
    return chat;
  }
  
  // Message operations
  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.chatId === chatId,
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, createdAt };
    this.messages.set(id, message);
    return message;
  }
  
  // Argument operations
  async getArgument(id: number): Promise<Argument | undefined> {
    return this.arguments.get(id);
  }

  async getArgumentsByUserId(userId: number): Promise<Argument[]> {
    return Array.from(this.arguments.values()).filter(
      (argument) => argument.userId === userId,
    );
  }

  async createArgument(insertArgument: InsertArgument): Promise<Argument> {
    const id = this.currentArgumentId++;
    const createdAt = new Date();
    const argument: Argument = { ...insertArgument, id, createdAt };
    this.arguments.set(id, argument);
    return argument;
  }
  
  // Law search operations
  async getLawSearch(id: number): Promise<LawSearch | undefined> {
    return this.lawSearches.get(id);
  }

  async getLawSearchesByUserId(userId: number): Promise<LawSearch[]> {
    return Array.from(this.lawSearches.values()).filter(
      (lawSearch) => lawSearch.userId === userId,
    );
  }

  async createLawSearch(insertLawSearch: InsertLawSearch): Promise<LawSearch> {
    const id = this.currentLawSearchId++;
    const createdAt = new Date();
    const lawSearch: LawSearch = { ...insertLawSearch, id, createdAt };
    this.lawSearches.set(id, lawSearch);
    return lawSearch;
  }
}

export const storage = new MemStorage();
