import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LawSearch } from '@/lib/types';

interface SearchResultsProps {
  searchResult: LawSearch | null;
  isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResult, isLoading }) => {
  const [activeTab, setActiveTab] = useState('acts');

  if (isLoading) {
    return (
      <Card>
        <div className="p-4 bg-navy-800 text-white border-b border-navy">
          <div className="flex justify-between items-center">
            <div className="h-5 w-40 bg-navy-700 animate-pulse rounded"></div>
            <div className="h-5 w-20 bg-navy-700 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex animate-pulse">
            <div className="px-4 py-2 w-24 bg-gray-100 m-1 rounded"></div>
            <div className="px-4 py-2 w-24 bg-gray-100 m-1 rounded"></div>
            <div className="px-4 py-2 w-24 bg-gray-100 m-1 rounded"></div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!searchResult) {
    return (
      <Card>
        <div className="p-4 bg-navy-800 text-white border-b border-navy">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Search Results</h3>
          </div>
        </div>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Enter a search query to find legal information</p>
        </CardContent>
      </Card>
    );
  }

  // Parse the response content which might be a string
  const responseContent = searchResult.results?.response || '';

  return (
    <Card>
      <div className="p-4 bg-navy-800 text-white border-b border-navy">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Search Results</h3>
          <span className="text-sm">Results for: {searchResult.query}</span>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="acts">Acts &amp; Sections</TabsTrigger>
            <TabsTrigger value="cases">Case Law</TabsTrigger>
            <TabsTrigger value="commentaries">Commentaries</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-6">
        <TabsContent value="acts" className="mt-0">
          <div className="mb-6">
            <h3 className="text-lg font-serif font-bold text-navy mb-4">
              {searchResult.query.includes('IPC') ? 'Section 302 in The Indian Penal Code' : 
               searchResult.query.includes('CrPC') ? 'Section 161 in The Code of Criminal Procedure' :
               `Results for "${searchResult.query}"`}
            </h3>
            
            <div className="p-4 rounded-md bg-[#f8f3e3]" style={{
              backgroundImage: 'radial-gradient(circle at 100% 150%, #f8f3e3 24%, #f5ecd5 25%, #f5ecd5 28%, #f8f3e3 29%, #f8f3e3 36%, #f5ecd5 36%, #f5ecd5 40%, transparent 40%, transparent), radial-gradient(circle at 0 150%, #f8f3e3 24%, #f5ecd5 25%, #f5ecd5 28%, #f8f3e3 29%, #f8f3e3 36%, #f5ecd5 36%, #f5ecd5 40%, transparent 40%, transparent), radial-gradient(circle at 50% 100%, #f5ecd5 10%, #f8f3e3 11%, #f8f3e3 23%, #f5ecd5 24%, #f5ecd5 30%, #f8f3e3 31%, #f8f3e3 43%, #f5ecd5 44%, #f5ecd5 50%, #f8f3e3 51%, #f8f3e3 63%, #f5ecd5 64%, #f5ecd5 71%, transparent 71%, transparent)',
              backgroundSize: '20px 20px'
            }}>
              <div className="whitespace-pre-wrap font-serif">{responseContent}</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-serif font-bold text-navy mb-4">Related Sections</h3>
            
            <div className="space-y-4">
              {['Section 300', 'Section 299', 'Section 304'].map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <h4 className="font-medium">{section} in The Indian Penal Code</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {section === 'Section 300' ? 'Definition of Murder' : 
                     section === 'Section 299' ? 'Culpable homicide' : 
                     'Punishment for culpable homicide not amounting to murder'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="mt-0">
          <div className="space-y-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-serif font-medium text-navy">
                  {index === 0 ? 'Bachan Singh vs State Of Punjab' :
                   index === 1 ? 'Machhi Singh vs State Of Punjab' :
                   'State of U.P. v. Sunil'}
                </h3>
                <p className="text-sm text-gray-600">
                  {index === 0 ? 'Supreme Court of India | 9 May, 1980' :
                   index === 1 ? 'Supreme Court of India | 20 July, 1983' :
                   'Supreme Court of India | 17 August, 2017'}
                </p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-navy-800 text-white">
                    {index === 0 ? 'Death Penalty' : 
                     index === 1 ? 'Murder' : 
                     'Evidence'}
                  </Badge>
                  <Badge variant="secondary" className="bg-navy-800 text-white">Section 302</Badge>
                  <Badge variant="secondary" className="bg-navy-800 text-white">
                    {index === 0 ? 'Constitution' : 
                     index === 1 ? 'Sentencing' : 
                     'CCTV Footage'}
                  </Badge>
                </div>
                
                <p className="mt-3 text-sm">
                  {index === 0 ? 'The Supreme Court upheld the constitutional validity of the death penalty for murder under Section 302 IPC. The Court laid down the "rarest of rare" doctrine for imposing death sentences.' :
                   index === 1 ? 'The Court elaborated on the "rarest of rare" doctrine and established categories of cases that would qualify for the death penalty.' :
                   'The Court discussed the evidentiary value of CCTV footage in murder cases and its admissibility under the Indian Evidence Act.'}
                </p>
                
                <div className="mt-3">
                  <Button variant="link" className="text-navy hover:text-navy-800 p-0 h-auto font-medium text-sm">
                    View Full Judgment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="commentaries" className="mt-0">
          <div className="space-y-6">
            {[1, 2].map((_, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-serif font-medium text-navy">
                  {index === 0 ? 'Ratanlal & Dhirajlal\'s Commentary on IPC' :
                   'PSA Pillai\'s Criminal Law'}
                </h3>
                <p className="text-sm text-gray-600">
                  {index === 0 ? 'Edition: 35th (2022) | Pages: 675-695' :
                   'Edition: 14th (2021) | Chapter 16: Offenses Against Human Life'}
                </p>
                
                <p className="mt-3 text-sm">
                  {index === 0 ? 'Comprehensive analysis of Section 302 IPC including elements of murder, distinction from culpable homicide, and sentencing principles.' :
                   'Detailed explanation of murder and culpable homicide under Indian law with extensive case citations and recent developments.'}
                </p>
                
                <div className="mt-3">
                  <Button variant="link" className="text-navy hover:text-navy-800 p-0 h-auto font-medium text-sm">
                    View Commentary Excerpt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
