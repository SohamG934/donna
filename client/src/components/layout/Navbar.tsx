import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu } from 'lucide-react';

interface NavbarProps {
  toggleMobileMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleMobileMenu }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <nav className="bg-navy shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 relative animate-[float_3s_ease-in-out_infinite]">
                  <svg className="text-gold-500 h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.1 3.5L9.4 2 5.7 3.5 2 10 5.7 14 6.3 17.4 9.4 18.5 12.5 17.4 13.1 14 11.29 13C11.11 13 11 12.89 11 12.71V12.5C11 12.22 11.22 12 11.5 12H12.71C12.89 12 13 12.11 13 12.29V12.59C13.16 12.76 13.26 13 13.2 13.25V15.77C13.2 15.9 13.1 16 13 16H10V13.9L9.4 14 8.04 13.5 7.8 12.3 9.4 11 13.1 12.3 13.9 10 13.1 3.5M20.89 7.11L15.11 1.33C14.7 0.93 14 0.93 13.59 1.33L11.11 3.82L19.17 11.89L21.67 9.4C22.07 9 22.07 8.3 21.67 7.9L20.89 7.11Z" />
                  </svg>
                </div>
                <h1 className="ml-3 text-gold-500 font-serif text-2xl font-bold">LexAI</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" className="text-white hover:bg-navy-800">
                      <User className="mr-2 h-4 w-4" />
                      {user?.name}
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-navy-800" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" className="text-white hover:bg-navy-800" onClick={openLoginModal}>
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                )}
              </div>
              <div className="flex items-center md:hidden">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-navy-800"
                  onClick={toggleMobileMenu}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Navbar;
