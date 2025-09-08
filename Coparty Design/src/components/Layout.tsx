import React, { useState } from 'react';
import { Menu, Plus, Bell, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import logoImage from 'figma:asset/48d4bdafb1d7cd86d25a47ed9c25472033bf4994.png';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    uid: string;
    displayName?: string;
    photoURL?: string;
    email?: string;
  } | null;
  onAuthModalOpen?: () => void;
  onProfileSetupOpen?: () => void;
  onNotificationsOpen?: () => void;
  projectCount?: number;
  hasUnreadNotifications?: boolean;
  onSignOut?: () => void;
  onNavigate?: (path: string) => void;
  onOpenModal?: (modalType: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  viewMode?: 'profiles' | 'projects';
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  onAuthModalOpen,
  onProfileSetupOpen,
  onNotificationsOpen,
  projectCount = 0,
  hasUnreadNotifications = false,
  onSignOut,
  onNavigate,
  onOpenModal,
  showSearch = false,
  searchPlaceholder = "What are you looking for?",
  viewMode = 'profiles',
  onSearch,
  onFilterChange
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handlePlusClick = () => {
    if (!user) {
      onAuthModalOpen?.();
      return;
    }
    onProfileSetupOpen?.();
  };

  const handleBellClick = () => {
    if (!user) {
      onAuthModalOpen?.();
      return;
    }
    onNotificationsOpen?.();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navigation Bar */}
      <nav className={`w-full flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#333333] bg-black/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-40 ${showMobileMenu ? 'blur-sm' : 'blur-none'} transition-all duration-300`}>
        {/* Left: Menu button (for authenticated users) */}
        <div className="flex items-center gap-3 min-w-0" style={{ flex: 1 }}>
          {user && (
            <button
              className={`p-3 rounded-full hover:bg-[#222222] transition-colors text-[#999999] hover:text-white ${showMobileMenu ? 'hidden' : 'block'}`}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ height: '100%', pointerEvents: 'none' }}>
          <button
            className="flex items-center gap-2 p-2 md:p-0 bg-transparent border-none shadow-none focus:outline-none"
            style={{ pointerEvents: 'auto' }}
          >
            <img 
              src={logoImage} 
              alt="CoParty Logo" 
              className="w-9 h-9 object-contain"
            />
          </button>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2 md:gap-4 justify-end flex-1">
          {user ? (
            <>
              {/* Mobile Project Setup Button */}
              <div className="relative md:hidden">
                <button
                  onClick={handlePlusClick}
                  className="p-3 rounded-full hover:bg-[#222222] transition-colors text-[#999999] hover:text-white relative"
                >
                  <Plus className="w-6 h-6" />
                  {projectCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#316afd] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {projectCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Notifications Bell */}
              <div className="relative md:hidden">
                <button
                  onClick={handleBellClick}
                  className="relative p-3 rounded-full hover:bg-[#222222] transition-colors text-[#999999] hover:text-white"
                >
                  <Bell className="w-6 h-6" />
                  {hasUnreadNotifications && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                  )}
                </button>
              </div>

              {/* Desktop buttons */}
              <div className="hidden md:flex items-center gap-2 md:gap-4">
                <button
                  onClick={handlePlusClick}
                  className="p-3 md:p-2 rounded-full hover:bg-[#222222] transition-colors text-[#999999] hover:text-white relative"
                >
                  <Plus className="w-6 h-6" />
                  {projectCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#316afd] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {projectCount}
                    </span>
                  )}
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={handleBellClick}
                    className="relative p-3 md:p-2 rounded-full hover:bg-[#222222] transition-colors text-[#999999] hover:text-white"
                  >
                    <Bell className="w-6 h-6" />
                    {hasUnreadNotifications && (
                      <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                      </span>
                    )}
                  </button>
                </div>


              </div>
            </>
          ) : (
            <button
              onClick={onAuthModalOpen}
              className="px-6 py-2 text-white font-medium transition-colors text-base hover:text-[#316afd]"
            >
              Sign In / Join Now
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      {user && (
        <Sidebar 
          isOpen={showMobileMenu} 
          onClose={() => setShowMobileMenu(false)} 
          currentUserId={user.uid}
          onSignOut={onSignOut}
          onNavigate={onNavigate}
          onOpenModal={onOpenModal}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col pt-16 transition-all duration-300 ${showMobileMenu ? 'blur-sm' : 'blur-none'}`}>
        {/* Search Bar - Only show if showSearch is true */}
        {showSearch && (
          <div className="w-full bg-[#0a0a0a] border-b border-[#333333] py-6">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
              <SearchBar
                onSearch={onSearch || (() => {})}
                placeholder={searchPlaceholder}
                onFilterChange={onFilterChange}
                viewMode={viewMode}
              />
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;