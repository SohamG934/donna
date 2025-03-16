// User types
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// PDF types
export interface Document {
  id: number;
  title: string;
  metadata: {
    filename: string;
    size: number;
    chunks: number;
  };
  createdAt: string;
}

export interface PdfQuery {
  documentId: number;
  query: string;
}

export interface Chat {
  id: number;
  documentId: number;
  createdAt: string;
}

export interface Message {
  id: number;
  chatId: number;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface PdfResponse {
  answer: string;
  messageId: number;
  chatId: number;
}

// Argument types
export interface ArgumentData {
  title: string;
  jurisdiction: string;
  type: string;
  acts: string;
  facts: string;
  side: 'prosecution' | 'defense';
}

export interface Argument {
  id: number;
  title: string;
  caseDetails: ArgumentData;
  generatedContent: string;
  createdAt: string;
}

// Law search types
export interface LawSearchQuery {
  query: string;
  filters?: string[];
}

export interface LawSearch {
  id: number;
  query: string;
  results: any;
  createdAt: string;
}

// Stat types for dashboard
export interface UserStats {
  pdfCount: number;
  argumentCount: number;
  searchCount: number;
}
