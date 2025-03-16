// Commented out HuggingFace due to import issues
// import { HuggingFaceInference } from '@langchain/community/llms/huggingface';
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

// Initialize models
const getOpenAI = () => {
  const openaiApiKey = process.env.OPENAI_API_KEY || 'sk-dummy-key';
  return new OpenAI({ 
    openAIApiKey: openaiApiKey,
    modelName: "gpt-3.5-turbo-instruct",
    temperature: 0.7
  });
};

// Commented out HuggingFace due to import issues
// const getHuggingFace = () => {
//   const hfApiKey = process.env.HUGGINGFACE_API_KEY || 'hf-dummy-key';
//   return new HuggingFaceInference({
//     apiKey: hfApiKey,
//     model: "mistralai/Mistral-7B-Instruct-v0.1",
//     temperature: 0.7
//   });
// };

// Prompt templates
const PDF_QUERY_PROMPT = `
You are LexAI, an AI assistant for legal professionals in India. 
Use the following pieces of context to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Always cite specific sections or page numbers when referencing information from the document.

Context:
{context}

Question: {question}

Answer:
`;

const LEGAL_ARGUMENT_PROMPT = `
You are LexAI, an AI assistant for legal professionals in India.
Generate structured legal arguments for a {side} based on the following case details.
Your response should follow formal legal argument structure with citations to relevant laws, precedents, and sections.
Focus on Indian legal context and jurisdiction.

Case Title: {title}
Jurisdiction: {jurisdiction}
Case Type: {type}
Relevant Acts/Sections: {acts}
Case Facts: {facts}

Generate a formal legal argument with:
1. Introduction/Summary
2. 3-5 main arguments with supporting citations
3. Conclusion
4. Format as if it's a formal legal submission

Your response:
`;

const LAW_SEARCH_PROMPT = `
You are LexAI, an AI assistant for legal professionals in India.
Provide a clear, concise explanation of the following legal query:

Query: {query}

Explain this legal concept, section, or act in the context of Indian law. Include:
1. The exact text of the section/act (if applicable)
2. Key interpretations from important case laws
3. Recent amendments or changes (if any)
4. Practical application in legal proceedings

Your response:
`;

// Generate response from PDF content
export const generatePdfResponse = async (query: string, context: string[]): Promise<string> => {
  try {
    const llm = getOpenAI();
    
    const prompt = new PromptTemplate({
      template: PDF_QUERY_PROMPT,
      inputVariables: ["context", "question"],
    });
    
    const formattedPrompt = await prompt.format({
      context: context.join('\n\n'),
      question: query
    });
    
    const response = await llm.call(formattedPrompt);
    return response;
  } catch (error) {
    console.error('Error generating PDF response:', error);
    throw new Error('Failed to generate response');
  }
};

// Generate legal argument
export const generateLegalArgument = async (
  title: string,
  jurisdiction: string,
  type: string,
  acts: string,
  facts: string,
  side: string
): Promise<string> => {
  try {
    const llm = getOpenAI();
    
    const prompt = new PromptTemplate({
      template: LEGAL_ARGUMENT_PROMPT,
      inputVariables: ["title", "jurisdiction", "type", "acts", "facts", "side"],
    });
    
    const formattedPrompt = await prompt.format({
      title,
      jurisdiction,
      type,
      acts,
      facts,
      side
    });
    
    const response = await llm.call(formattedPrompt);
    return response;
  } catch (error) {
    console.error('Error generating legal argument:', error);
    throw new Error('Failed to generate legal argument');
  }
};

// Search law database
export const searchLawDatabase = async (query: string): Promise<string> => {
  try {
    const llm = getOpenAI();
    
    const prompt = new PromptTemplate({
      template: LAW_SEARCH_PROMPT,
      inputVariables: ["query"],
    });
    
    const formattedPrompt = await prompt.format({
      query
    });
    
    const response = await llm.call(formattedPrompt);
    return response;
  } catch (error) {
    console.error('Error searching law database:', error);
    throw new Error('Failed to search law database');
  }
};
