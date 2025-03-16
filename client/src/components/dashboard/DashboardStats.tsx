import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, MessageSquare, Search } from 'lucide-react';
import { UserStats } from '@/lib/types';

interface DashboardStatsProps {
  stats: UserStats;
  isLoading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Uploaded PDFs',
      value: stats.pdfCount,
      icon: <FileText className="h-6 w-6" />,
      color: 'border-navy text-navy',
      bgColor: 'bg-navy bg-opacity-10'
    },
    {
      title: 'Generated Arguments',
      value: stats.argumentCount,
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'border-gold-500 text-gold-500',
      bgColor: 'bg-gold-500 bg-opacity-10'
    },
    {
      title: 'Law Searches',
      value: stats.searchCount,
      icon: <Search className="h-6 w-6" />,
      color: 'border-green-600 text-green-600',
      bgColor: 'bg-green-600 bg-opacity-10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className={`border-l-4 ${item.color}`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${item.bgColor} ${item.color}`}>
                {item.icon}
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500">{item.title}</h4>
                <h3 className="text-2xl font-semibold text-navy">{item.value}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
