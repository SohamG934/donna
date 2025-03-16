import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { LawSearchQuery } from '@/lib/types';

interface SearchBarProps {
  onSearch: (query: LawSearchQuery) => void;
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

  const quickFilterOptions = [
    { id: 'ipc', label: 'IPC' },
    { id: 'crpc', label: 'CrPC' },
    { id: 'evidence', label: 'Evidence Act' },
    { id: 'constitution', label: 'Constitution' },
    { id: 'supreme-court', label: 'Supreme Court' },
    { id: 'high-courts', label: 'High Courts' }
  ];

  const handleAddFilter = (filterId: string) => {
    if (!filters.includes(filterId)) {
      setFilters([...filters, filterId]);
    }
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter(id => id !== filterId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch({
        query: searchQuery.trim(),
        filters
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                className="w-full py-3"
                placeholder="Search acts, sections, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isSearching}
              />
            </div>
            <div>
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-navy hover:bg-navy-800 py-3 px-6"
                disabled={!searchQuery.trim() || isSearching}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickFilterOptions.map(option => (
            <Button
              key={option.id}
              variant="secondary"
              className="bg-navy-800 text-white text-sm py-1 px-3 rounded-full hover:bg-navy"
              onClick={() => handleAddFilter(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {filters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map(filter => {
              const option = quickFilterOptions.find(opt => opt.id === filter);
              return (
                <Badge key={filter} className="bg-navy text-white py-1 px-3 flex items-center">
                  <span>{option?.label || filter}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 text-white hover:text-red-300"
                    onClick={() => handleRemoveFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchBar;
