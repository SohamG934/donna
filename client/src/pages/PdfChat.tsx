import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PdfUpload from '@/components/pdf-chat/PdfUpload';
import ChatInterface from '@/components/pdf-chat/ChatInterface';
import { Document } from '@/lib/types';
import { getUserDocuments } from '@/lib/api';

const PdfChat: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Fetch user documents
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/pdf/documents'],
    queryFn: async () => {
      const response = await getUserDocuments();
      return response.documents;
    }
  });

  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-navy">Chat with Legal PDFs</h2>
        <p className="mt-2 text-gray-600">Upload and interact with your legal documents using AI assistance</p>
      </div>
      
      <div className="wood-divider my-6 h-5 bg-[url('https://images.unsplash.com/photo-1594493581981-3c73746e3078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload section */}
        <div className="lg:col-span-1">
          <PdfUpload 
            documents={data || []} 
            isLoading={isLoading} 
            onSelectDocument={handleSelectDocument}
            refetch={refetch}
          />
        </div>
        
        {/* Chat section */}
        <div className="lg:col-span-2">
          <ChatInterface selectedDocument={selectedDocument} />
        </div>
      </div>
    </div>
  );
};

export default PdfChat;
