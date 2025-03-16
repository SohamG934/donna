import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  ListChecks, 
  History, 
  HelpCircle 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="mr-3 text-gold-500 h-5 w-5" /> },
    { name: 'Chat with PDFs', path: '/pdf-chat', icon: <MessageSquare className="mr-3 text-gold-500 h-5 w-5" /> },
    { name: 'Argument Generator', path: '/argument-generator', icon: <FileText className="mr-3 text-gold-500 h-5 w-5" /> },
    { name: 'Law Search', path: '/law-search', icon: <BookOpen className="mr-3 text-gold-500 h-5 w-5" /> },
    { name: 'Saved Documents', path: '/saved-documents', icon: <ListChecks className="mr-3 text-gold-500 h-5 w-5" /> },
    { name: 'History', path: '/history', icon: <History className="mr-3 text-gold-500 h-5 w-5" /> }
  ];

  if (!isAuthenticated) {
    return null;
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className={`bg-navy w-64 shadow-xl transform transition-transform md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}>
      <div className="py-4 h-full flex flex-col">
        <div className="px-6 py-2">
          <h3 className="text-white text-xs font-medium uppercase tracking-wider">Features</h3>
        </div>
        <div className="mt-2 flex-1">
          {navigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full flex items-center px-6 py-3 text-white justify-start ${location === item.path ? 'bg-navy-800' : 'hover:bg-navy-800'}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Button>
          ))}
          
          <div className="px-6 py-2 mt-6">
            <h3 className="text-white text-xs font-medium uppercase tracking-wider">My Documents</h3>
          </div>
          
          {navigationItems.slice(4).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full flex items-center px-6 py-3 text-white justify-start ${location === item.path ? 'bg-navy-800' : 'hover:bg-navy-800'}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Button>
          ))}
        </div>
        
        <div className="px-6 pt-8 pb-4">
          <div className="p-4 bg-navy-800 rounded-lg">
            <h4 className="text-gold-500 font-medium">Need Help?</h4>
            <p className="text-white text-sm mt-1">Our support team is available 24/7</p>
            <Button className="mt-3 bg-gold-500 text-navy hover:bg-gold-600">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
