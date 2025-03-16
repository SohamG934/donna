import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Trash2 } from 'lucide-react';
import { Document } from '@/lib/types';
import { uploadPdf, deleteDocument } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

interface PdfUploadProps {
  documents: Document[];
  isLoading: boolean;
  onSelectDocument: (document: Document) => void;
  refetch: () => void;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ 
  documents, 
  isLoading, 
  onSelectDocument,
  refetch
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    let title = documentTitle.trim() || file.name.replace(/\.[^/.]+$/, '');
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 20;
          return next > 90 ? 90 : next;
        });
      }, 500);
      
      await uploadPdf(file, title);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: `${title} has been uploaded successfully.`,
      });
      
      // Reset form
      setDocumentTitle('');
      
      // Refetch documents
      refetch();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/pdf/documents'] });
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload the PDF file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [documentTitle, toast, refetch, queryClient]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
    multiple: false
  });
  
  const handleDeleteDocument = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteDocument(id);
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully."
      });
      
      // Refetch documents
      refetch();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/pdf/documents'] });
      
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete the document.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Document upload */}
        <div 
          {...getRootProps()} 
          className={`dropzone border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-navy bg-navy bg-opacity-5' : 'border-gray-300 hover:bg-gray-50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-navy mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {isDragActive ? "Drop the PDF here" : "Drag & drop your document here or"}
          </p>
          <Button type="button" variant="ghost" className="text-navy font-medium" disabled={isUploading}>
            Browse files
          </Button>
          <p className="text-xs text-gray-500 mt-2">Supports PDF files up to 10MB</p>
        </div>
        
        {/* Document title input */}
        <div className="mt-4">
          <Input 
            placeholder="Document title (optional)" 
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            disabled={isUploading}
          />
        </div>
        
        {/* Upload progress */}
        {isUploading && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Uploading document...</p>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {/* Document list */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Documents</h4>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center p-3 bg-gray-50 rounded-md animate-pulse">
                  <div className="h-6 w-6 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onSelectDocument(doc)}
                >
                  <FileText className="text-navy h-5 w-5 mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded {format(new Date(doc.createdAt), 'PP')}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-red-500" 
                    size="sm"
                    onClick={(e) => handleDeleteDocument(doc.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfUpload;
