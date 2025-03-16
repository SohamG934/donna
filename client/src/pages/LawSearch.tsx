import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import SearchBar from '@/components/law-search/SearchBar';
import SearchResults from '@/components/law-search/SearchResults';
import { LawSearchQuery, LawSearch as LawSearchType } from '@/lib/types';
import { searchLaw } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const LawSearch: React.FC = () => {
  const [searchResult, setSearchResult] = useState<LawSearchType | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: searchLaw,
    onSuccess: (data) => {
      setSearchResult(data.search);
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search law database",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (query: LawSearchQuery) => {
    mutation.mutate(query);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-navy">Indian Legal Database</h2>
        <p className="mt-2 text-gray-600">Search acts, rules, and precedents from comprehensive Indian legal sources</p>
      </div>
      
      <div className="wood-divider my-6 h-5 bg-[url('https://images.unsplash.com/photo-1594493581981-3c73746e3078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      {/* Search section */}
      <SearchBar onSearch={handleSearch} isSearching={mutation.isPending} />
      
      {/* Results section */}
      <SearchResults searchResult={searchResult} isLoading={mutation.isPending} />
    </div>
  );
};

export default LawSearch;
