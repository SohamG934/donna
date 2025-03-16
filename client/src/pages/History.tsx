import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserDocuments, getUserArguments, getUserSearches } from '@/lib/api';
import { FileText, MessageSquare, Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const History: React.FC = () => {
  // Fetch documents, arguments, and searches for history
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/pdf/documents'],
    queryFn: async () => {
      const response = await getUserDocuments();
      return response.documents;
    }
  });

  const { data: legalArguments, isLoading: isLoadingArguments } = useQuery({
    queryKey: ['/api/argument/list'],
    queryFn: async () => {
      const response = await getUserArguments();
      return response.arguments;
    }
  });

  const { data: searches, isLoading: isLoadingSearches } = useQuery({
    queryKey: ['/api/law/searches'],
    queryFn: async () => {
      const response = await getUserSearches();
      return response.searches;
    }
  });

  // Group all items by date
  const groupByDate = (items: any[]) => {
    if (!items) return {};
    
    return items.reduce((groups: Record<string, any[]>, item) => {
      const date = format(new Date(item.createdAt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  };

  // Combine and sort all activities
  const allActivities = [
    ...(documents || []).map(doc => ({ 
      type: 'document', 
      action: 'Uploaded document', 
      title: doc.title, 
      date: doc.createdAt 
    })),
    ...(legalArguments || []).map(arg => ({ 
      type: 'argument', 
      action: 'Generated argument', 
      title: arg.title, 
      date: arg.createdAt 
    })),
    ...(searches || []).map(search => ({ 
      type: 'search', 
      action: 'Searched for', 
      title: search.query, 
      date: search.createdAt 
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isLoading = isLoadingDocuments || isLoadingArguments || isLoadingSearches;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-navy">Activity History</h2>
        <p className="mt-2 text-gray-600">Track your recent activities and interactions with LexAI</p>
      </div>
      
      <div className="wood-divider my-6 h-5 bg-[url('https://images.unsplash.com/photo-1594493581981-3c73746e3078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All Activities</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="arguments" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Arguments
              </TabsTrigger>
              <TabsTrigger value="searches" className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Searches
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="all" className="m-0">
                {isLoading ? (
                  <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="space-y-4">
                          {[1, 2].map((j) => (
                            <div key={j} className="flex">
                              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No activities to display</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(
                      allActivities.reduce((groups: Record<string, any[]>, activity) => {
                        const date = format(new Date(activity.date), 'yyyy-MM-dd');
                        if (!groups[date]) groups[date] = [];
                        groups[date].push(activity);
                        return groups;
                      }, {})
                    ).map(([date, activities]) => (
                      <div key={date}>
                        <h3 className="font-medium text-gray-600 mb-4">
                          {format(new Date(date), 'PPPP')}
                        </h3>
                        <div className="space-y-4">
                          {activities.map((activity, index) => (
                            <div key={index} className="flex">
                              {activity.type === 'document' && (
                                <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center mr-4">
                                  <FileText className="text-navy h-5 w-5" />
                                </div>
                              )}
                              {activity.type === 'argument' && (
                                <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center mr-4">
                                  <MessageSquare className="text-gold-500 h-5 w-5" />
                                </div>
                              )}
                              {activity.type === 'search' && (
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                  <Search className="text-green-600 h-5 w-5" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">
                                  {activity.action}: <span className="font-normal">{activity.title}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(activity.date), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="m-0">
                {isLoadingDocuments ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !documents || documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No document activity to display</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupByDate(documents)).map(([date, docs]) => (
                      <div key={date}>
                        <h3 className="font-medium text-gray-600 mb-4">
                          {format(new Date(date), 'PPPP')}
                        </h3>
                        <div className="space-y-4">
                          {docs.map((doc) => (
                            <div key={doc.id} className="flex">
                              <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center mr-4">
                                <FileText className="text-navy h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  Uploaded document: <span className="font-normal">{doc.title}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(doc.createdAt), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="arguments" className="m-0">
                {isLoadingArguments ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !legalArguments || legalArguments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No argument activity to display</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupByDate(legalArguments)).map(([date, args]) => (
                      <div key={date}>
                        <h3 className="font-medium text-gray-600 mb-4">
                          {format(new Date(date), 'PPPP')}
                        </h3>
                        <div className="space-y-4">
                          {args.map((arg) => (
                            <div key={arg.id} className="flex">
                              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center mr-4">
                                <MessageSquare className="text-gold-500 h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  Generated argument: <span className="font-normal">{arg.title}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(arg.createdAt), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="searches" className="m-0">
                {isLoadingSearches ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !searches || searches.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No search activity to display</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupByDate(searches)).map(([date, searchItems]) => (
                      <div key={date}>
                        <h3 className="font-medium text-gray-600 mb-4">
                          {format(new Date(date), 'PPPP')}
                        </h3>
                        <div className="space-y-4">
                          {searchItems.map((search) => (
                            <div key={search.id} className="flex">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <Search className="text-green-600 h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  Searched for: <span className="font-normal">"{search.query}"</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(search.createdAt), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
