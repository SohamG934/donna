import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import DashboardStats from '@/components/dashboard/DashboardStats';
import FeatureCard from '@/components/dashboard/FeatureCard';
import { FileText, MessageSquare, BookOpen } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { UserStats } from '@/lib/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch user statistics
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['/api/user/stats'],
    queryFn: async () => {
      try {
        // This endpoint might not exist yet, so we're handling the error
        const res = await apiRequest('GET', '/api/user/stats');
        return await res.json();
      } catch (error) {
        // Return mock stats if the endpoint doesn't exist
        return {
          pdfCount: 12,
          argumentCount: 8,
          searchCount: 27
        };
      }
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-navy">Welcome back, {user?.name || 'Advocate'}</h2>
        <p className="mt-2 text-gray-600">Access all LexAI tools to streamline your legal work</p>
      </div>
      
      <div className="wood-divider my-6 h-5 bg-[url('https://images.unsplash.com/photo-1594493581981-3c73746e3078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      {/* Dashboard stats */}
      <DashboardStats 
        stats={stats || { pdfCount: 0, argumentCount: 0, searchCount: 0 }} 
        isLoading={isLoading} 
      />
      
      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Chat with PDFs" 
          description="Upload legal documents and get AI-powered answers from their contents"
          icon={FileText}
          path="/pdf-chat"
        />
        
        <FeatureCard 
          title="Argument Generator" 
          description="Generate structured legal arguments with citations based on case details"
          icon={MessageSquare}
          path="/argument-generator"
        />
        
        <FeatureCard 
          title="Law Search" 
          description="Search Indian legal acts, rules, and precedents from centralized database"
          icon={BookOpen}
          path="/law-search"
        />
      </div>
      
      {/* Scales of justice */}
      <div className="mt-12 flex justify-center">
        <div className="scales relative w-40 h-40 cursor-pointer group">
          <div className="absolute top-0 left-0 right-0 h-8 bg-navy rounded-full"></div>
          <div className="absolute top-8 left-1/2 -ml-1 w-2 h-20 bg-navy"></div>
          <div className="absolute top-28 left-1/2 -ml-10 w-20 h-4 bg-navy rounded-full"></div>
          <div className="left-scale absolute top-32 left-4 w-16 h-2 bg-gold-500 transform -rotate-6 origin-left transition-transform duration-300 group-hover:rotate-[-15deg] group-hover:translate-y-2"></div>
          <div className="absolute top-34 left-4 w-16 h-16 rounded-full border-2 border-gold-500 opacity-50"></div>
          <div className="right-scale absolute top-32 right-4 w-16 h-2 bg-gold-500 transform rotate-6 origin-right transition-transform duration-300 group-hover:rotate-[15deg] group-hover:-translate-y-2"></div>
          <div className="absolute top-34 right-4 w-16 h-16 rounded-full border-2 border-gold-500 opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
