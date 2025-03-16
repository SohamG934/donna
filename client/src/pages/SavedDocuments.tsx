import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserDocuments, getUserArguments, getUserSearches } from '@/lib/api';
import { FileText, MessageSquare, Search, ExternalLink, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';

const SavedDocuments: React.FC = () => {
  // Fetch user documents
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/pdf/documents'],
    queryFn: async () => {
      const response = await getUserDocuments();
      return response.documents;
    }
  });

  // Fetch user arguments
  const { data: legalArguments, isLoading: isLoadingArguments } = useQuery({
    queryKey: ['/api/argument/list'],
    queryFn: async () => {
      const response = await getUserArguments();
      return response.arguments;
    }
  });

  // Fetch user searches
  const { data: searches, isLoading: isLoadingSearches } = useQuery({
    queryKey: ['/api/law/searches'],
    queryFn: async () => {
      const response = await getUserSearches();
      return response.searches;
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-navy">Saved Documents</h2>
        <p className="mt-2 text-gray-600">Access and manage all your saved legal documents, arguments, and searches</p>
      </div>
      
      <div className="wood-divider my-6 h-5 bg-[url('https://images.unsplash.com/photo-1594493581981-3c73746e3078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Legal Resources</CardTitle>
        </CardHeader>
        <Tabs defaultValue="documents">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="documents" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                PDF Documents
              </TabsTrigger>
              <TabsTrigger value="arguments" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Legal Arguments
              </TabsTrigger>
              <TabsTrigger value="searches" className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Law Searches
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            <TabsContent value="documents">
              {isLoadingDocuments ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-md animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : documents?.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No documents saved yet</p>
                  <Link href="/pdf-chat">
                    <Button variant="outline" className="mt-4">
                      Upload a Document
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents?.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="text-navy h-8 w-8 mr-3" />
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <p className="text-sm text-gray-500">
                              Uploaded {format(new Date(doc.createdAt), 'PP')}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/pdf-chat?document=${doc.id}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="arguments">
              {isLoadingArguments ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-md animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : legalArguments?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No arguments generated yet</p>
                  <Link href="/argument-generator">
                    <Button variant="outline" className="mt-4">
                      Generate Arguments
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {legalArguments?.map((arg) => (
                    <div key={arg.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MessageSquare className="text-navy h-8 w-8 mr-3" />
                          <div>
                            <h3 className="font-medium">{arg.title}</h3>
                            <p className="text-sm text-gray-500">
                              Generated {format(new Date(arg.createdAt), 'PP')}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/argument-generator?id=${arg.id}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="searches">
              {isLoadingSearches ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-md animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searches?.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No law searches performed yet</p>
                  <Link href="/law-search">
                    <Button variant="outline" className="mt-4">
                      Search Laws
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {searches?.map((search) => (
                    <div key={search.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Search className="text-navy h-8 w-8 mr-3" />
                          <div>
                            <h3 className="font-medium">"{search.query}"</h3>
                            <p className="text-sm text-gray-500">
                              Searched {format(new Date(search.createdAt), 'PP')}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/law-search?id=${search.id}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SavedDocuments;
