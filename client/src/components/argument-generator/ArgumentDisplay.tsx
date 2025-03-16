import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArgumentDisplayProps {
  generatedContent: string | null;
  isLoading: boolean;
}

const ArgumentDisplay: React.FC<ArgumentDisplayProps> = ({ 
  generatedContent, 
  isLoading 
}) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied",
        description: "Argument copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy text to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadArgument = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-argument-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Argument downloaded successfully",
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 border-b border-gray-200 bg-navy-800 text-white flex-row justify-between">
        <h3 className="font-medium">Generated Arguments</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            className="text-white hover:text-gold-500" 
            onClick={downloadArgument}
            disabled={!generatedContent || isLoading}
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-gold-500" 
            onClick={copyToClipboard}
            disabled={!generatedContent || isLoading}
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      {isLoading ? (
        <CardContent className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating legal arguments...</p>
          </div>
        </CardContent>
      ) : !generatedContent ? (
        <CardContent className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-gray-500">Submit the form to generate legal arguments</p>
          </div>
        </CardContent>
      ) : (
        <CardContent 
          className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap"
          style={{
            backgroundImage: 'radial-gradient(circle at 100% 150%, #f8f3e3 24%, #f5ecd5 25%, #f5ecd5 28%, #f8f3e3 29%, #f8f3e3 36%, #f5ecd5 36%, #f5ecd5 40%, transparent 40%, transparent), radial-gradient(circle at 0 150%, #f8f3e3 24%, #f5ecd5 25%, #f5ecd5 28%, #f8f3e3 29%, #f8f3e3 36%, #f5ecd5 36%, #f5ecd5 40%, transparent 40%, transparent), radial-gradient(circle at 50% 100%, #f5ecd5 10%, #f8f3e3 11%, #f8f3e3 23%, #f5ecd5 24%, #f5ecd5 30%, #f8f3e3 31%, #f8f3e3 43%, #f5ecd5 44%, #f5ecd5 50%, #f8f3e3 51%, #f8f3e3 63%, #f5ecd5 64%, #f5ecd5 71%, transparent 71%, transparent)',
            backgroundSize: '20px 20px'
          }}
        >
          {generatedContent}
        </CardContent>
      )}
    </Card>
  );
};

export default ArgumentDisplay;
