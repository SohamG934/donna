import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ArgumentForm from '@/components/argument-generator/ArgumentForm';
import ArgumentDisplay from '@/components/argument-generator/ArgumentDisplay';
import { ArgumentData } from '@/lib/types';
import { generateArgument } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ArgumentGenerator: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: generateArgument,
    onSuccess: (data) => {
      setGeneratedContent(data.argument.generatedContent);
      toast({
        title: "Success",
        description: "Legal arguments generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate arguments",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: ArgumentData) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-navy">Legal Argument Generator</h2>
        <p className="mt-2 text-gray-600">Generate structured legal arguments with citations based on your case details</p>
      </div>
      
      <div className="wood-divider my-6 h-5 bg-[url('https://images.unsplash.com/photo-1594493581981-3c73746e3078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form section */}
        <ArgumentForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
        
        {/* Results section */}
        <ArgumentDisplay 
          generatedContent={generatedContent} 
          isLoading={mutation.isPending} 
        />
      </div>
    </div>
  );
};

export default ArgumentGenerator;
