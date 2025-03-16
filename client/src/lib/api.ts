import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  Document, 
  Chat, 
  Message, 
  Argument, 
  LawSearch,
  LoginCredentials,
  RegisterData,
  PdfQuery,
  ArgumentData,
  LawSearchQuery
} from './types';

// Auth API
export const login = async (credentials: LoginCredentials) => {
  const res = await apiRequest('POST', '/api/auth/login', credentials);
  return res.json();
};

export const register = async (data: RegisterData) => {
  const res = await apiRequest('POST', '/api/auth/register', data);
  return res.json();
};

// PDF API
export const uploadPdf = async (file: File, title: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  
  const res = await fetch('/api/pdf/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  
  return res.json();
};

export const getUserDocuments = async () => {
  const res = await apiRequest('GET', '/api/pdf/documents');
  return res.json();
};

export const deleteDocument = async (documentId: number) => {
  const res = await apiRequest('DELETE', `/api/pdf/documents/${documentId}`);
  return res.json();
};

export const askPdf = async (query: PdfQuery) => {
  const res = await apiRequest('POST', '/api/pdf/ask', query);
  return res.json();
};

export const getChatMessages = async (chatId: number) => {
  const res = await apiRequest('GET', `/api/pdf/chats/${chatId}`);
  return res.json();
};

// Argument API
export const generateArgument = async (data: ArgumentData) => {
  const res = await apiRequest('POST', '/api/argument/generate', data);
  return res.json();
};

export const getUserArguments = async () => {
  const res = await apiRequest('GET', '/api/argument/list');
  return res.json();
};

export const getArgument = async (argumentId: number) => {
  const res = await apiRequest('GET', `/api/argument/${argumentId}`);
  return res.json();
};

// Law search API
export const searchLaw = async (query: LawSearchQuery) => {
  const res = await apiRequest('POST', '/api/law/search', query);
  return res.json();
};

export const getUserSearches = async () => {
  const res = await apiRequest('GET', '/api/law/searches');
  return res.json();
};

export const getSearch = async (searchId: number) => {
  const res = await apiRequest('GET', `/api/law/search/${searchId}`);
  return res.json();
};
