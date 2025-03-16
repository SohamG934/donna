import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';

let embeddings: OpenAIEmbeddings;

// Initialize embeddings with API key from environment variables
const getEmbeddings = () => {
  if (!embeddings) {
    const openaiApiKey = process.env.OPENAI_API_KEY || 'sk-dummy-key';
    embeddings = new OpenAIEmbeddings({ openAIApiKey: openaiApiKey });
  }
  return embeddings;
};

// Store document chunks in Chroma DB
export const storeDocumentEmbeddings = async (
  documentId: number,
  chunks: string[]
): Promise<void> => {
  try {
    const documents = chunks.map(
      (chunk, i) => 
        new Document({
          pageContent: chunk,
          metadata: { documentId, chunkIndex: i }
        })
    );
    
    const vectorStore = await Chroma.fromDocuments(
      documents,
      getEmbeddings(),
      {
        collectionName: `document_${documentId}`,
        url: process.env.CHROMA_URL || 'http://localhost:8000'
      }
    );
    
    return;
  } catch (error) {
    console.error('Error storing document embeddings:', error);
    throw new Error('Failed to create document embeddings');
  }
};

// Retrieve relevant document chunks based on query
export const retrieveRelevantChunks = async (
  documentId: number,
  query: string,
  maxResults: number = 5
): Promise<{text: string, metadata: any}[]> => {
  try {
    const vectorStore = await Chroma.fromExistingCollection(
      getEmbeddings(),
      {
        collectionName: `document_${documentId}`,
        url: process.env.CHROMA_URL || 'http://localhost:8000'
      }
    );
    
    const results = await vectorStore.similaritySearch(query, maxResults);
    
    return results.map(doc => ({
      text: doc.pageContent,
      metadata: doc.metadata
    }));
  } catch (error) {
    console.error('Error retrieving relevant chunks:', error);
    throw new Error('Failed to retrieve document content');
  }
};
