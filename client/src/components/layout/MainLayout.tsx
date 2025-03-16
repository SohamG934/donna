import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-navy font-medium">Loading LexAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleMobileMenu={toggleSidebar} />
      
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar button */}
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 md:hidden z-20">
          <Button 
            className="bg-navy shadow-lg rounded-full p-3 text-white"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      {!isAuthenticated && (
        <LoginModal isOpen={true} onClose={() => {}} />
      )}
    </div>
  );
};

export default MainLayout;
