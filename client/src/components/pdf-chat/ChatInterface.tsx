import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Download, Send, Mic, User, Bot } from 'lucide-react';
import { Document, Message } from '@/lib/types';
import { askPdf, getChatMessages } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  selectedDocument: Document | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedDocument }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [chatId, setChatId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get chat messages if we have a selected document
  const { data: chatData, isLoading: isLoadingChat } = useQuery({
    queryKey: chatId ? [`/api/pdf/chats/${chatId}`] : null,
    enabled: !!chatId,
  });

  // Get initial welcome message
  useEffect(() => {
    if (selectedDocument) {
      const welcomeMessage: Message = {
        id: -1,
        chatId: -1,
        content: `I'm LexAI, your legal assistant. I've processed your document "${selectedDocument.title}". Ask me anything about its contents, and I'll provide concise answers with relevant citations.`,
        role: 'assistant',
        createdAt: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      setChatId(null);
    } else {
      setMessages([]);
      setChatId(null);
    }
  }, [selectedDocument]);

  // Update messages when chat data changes
  useEffect(() => {
    if (chatData?.messages) {
      setMessages(prev => {
        // Keep the welcome message if it exists
        const welcomeMessage = prev.find(m => m.id === -1);
        return welcomeMessage 
          ? [welcomeMessage, ...chatData.messages]
          : chatData.messages;
      });
    }
  }, [chatData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Mutation for sending a message
  const askMutation = useMutation({
    mutationFn: askPdf,
    onSuccess: (data) => {
      // Update chatId if needed
      if (!chatId && data.chatId) {
        setChatId(data.chatId);
      }
      
      // Invalidate the chat query to refresh messages
      if (data.chatId) {
        queryClient.invalidateQueries({ queryKey: [`/api/pdf/chats/${data.chatId}`] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get an answer",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = async () => {
    if (!query.trim() || !selectedDocument) return;
    
    // Add user message to the UI immediately
    const userMessage: Message = {
      id: Date.now(), // Temporary ID
      chatId: chatId || -1,
      content: query,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setQuery('');
    
    // Send query to API
    askMutation.mutate({
      documentId: selectedDocument.id,
      query: query.trim()
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    // For now, just toggle the state
    // In a real implementation, this would use the Web Speech API
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Voice Input",
        description: "Voice input feature is not implemented in this demo.",
      });
    }
  };

  const downloadChat = () => {
    if (messages.length === 0) return;
    
    // Format messages for download
    const content = messages
      .map(msg => {
        const role = msg.role === 'user' ? 'You' : 'LexAI';
        const time = format(new Date(msg.createdAt), 'PPpp');
        return `${role} (${time}):\n${msg.content}\n\n`;
      })
      .join('');
    
    // Create a download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${selectedDocument?.title || 'document'}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show empty state if no document is selected
  if (!selectedDocument) {
    return (
      <Card className="h-full flex flex-col" style={{ minHeight: '600px' }}>
        <CardContent className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No document selected</h3>
            <p className="text-gray-500 max-w-md">
              Please select a document from the left panel or upload a new one to start chatting.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col" style={{ minHeight: '600px' }}>
      {/* Document title bar */}
      <CardHeader className="p-4 border-b border-gray-200 bg-navy-800 text-white flex-row justify-between">
        <div className="flex items-center">
          <FileText className="text-gold-500 mr-2 h-5 w-5" />
          <h3 className="font-medium">{selectedDocument.title}</h3>
        </div>
        <Button variant="ghost" className="text-white hover:text-gold-500" onClick={downloadChat}>
          <Download className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      {/* Chat area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div 
            key={`${message.id}-${index}`} 
            className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <Avatar className="flex-shrink-0 bg-navy-800 h-8 w-8 mr-3">
                <Bot className="h-4 w-4 text-gold-500" />
              </Avatar>
            )}
            
            <div 
              className={`py-3 px-4 max-w-3xl ${
                message.role === 'user' 
                  ? 'bg-navy text-white rounded-lg' 
                  : 'bg-[#f8f3e3] rounded-lg shadow-sm'
              }`}
              style={message.role === 'assistant' ? {
                backgroundImage: 'radial-gradient(circle at 100% 150%, #f8f3e3 24%, #f5ecd5 25%, #f5ecd5 28%, #f8f3e3 29%, #f8f3e3 36%, #f5ecd5 36%, #f5ecd5 40%, transparent 40%, transparent), radial-gradient(circle at 0 150%, #f8f3e3 24%, #f5ecd5 25%, #f5ecd5 28%, #f8f3e3 29%, #f8f3e3 36%, #f5ecd5 36%, #f5ecd5 40%, transparent 40%, transparent), radial-gradient(circle at 50% 100%, #f5ecd5 10%, #f8f3e3 11%, #f8f3e3 23%, #f5ecd5 24%, #f5ecd5 30%, #f8f3e3 31%, #f8f3e3 43%, #f5ecd5 44%, #f5ecd5 50%, #f8f3e3 51%, #f8f3e3 63%, #f5ecd5 64%, #f5ecd5 71%, transparent 71%, transparent)',
                backgroundSize: '20px 20px'
              } : {}}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
            
            {message.role === 'user' && (
              <Avatar className="flex-shrink-0 bg-navy h-8 w-8 ml-3">
                <User className="h-4 w-4 text-white" />
              </Avatar>
            )}
          </div>
        ))}
        
        {askMutation.isPending && (
          <div className="flex items-start">
            <Avatar className="flex-shrink-0 bg-navy-800 h-8 w-8 mr-3">
              <Bot className="h-4 w-4 text-gold-500" />
            </Avatar>
            <div className="bg-gray-100 rounded-lg py-3 px-4 max-w-3xl">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="flex-shrink-0 text-gray-500 hover:text-navy"
            onClick={toggleVoiceInput}
          >
            <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
          </Button>
          <Input 
            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus-visible:ring-navy"
            placeholder="Ask a question about this document..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={askMutation.isPending}
          />
          <Button 
            className="bg-navy text-white rounded-r-lg hover:bg-navy-800"
            onClick={handleSendMessage}
            disabled={!query.trim() || askMutation.isPending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {isRecording && (
          <div className="mt-2 flex items-center text-sm text-red-500">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span>Recording... Click mic again to stop</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Add missing import
const FileText = React.lazy(() => import('lucide-react').then(mod => ({ default: mod.FileText })));

export default ChatInterface;
