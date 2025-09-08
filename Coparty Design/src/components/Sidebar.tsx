import React, { useState } from 'react';
import { 
  User, Folder, Users, Bookmark, Map, Calendar, Settings, 
  HelpCircle, X, Laptop, Video, Edit, UserPen, LogOut
} from 'lucide-react';
import logoImage from 'figma:asset/48d4bdafb1d7cd86d25a47ed9c25472033bf4994.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onSignOut?: () => void;
  onNavigate?: (path: string) => void;
  onOpenModal?: (modalType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  currentUserId,
  onSignOut,
  onNavigate,
  onOpenModal
}) => {
  const [activeItem, setActiveItem] = useState('profiles');

  const handleNavClick = (itemId: string, action?: string, path?: string) => {
    setActiveItem(itemId);
    
    if (action && onOpenModal) {
      onOpenModal(action);
    } else if (path && onNavigate) {
      onNavigate(path);
    }
    
    onClose();
  };

  const handleGetPro = () => {
    onOpenModal?.('pro-upgrade');
    onClose();
  };

  const handleSignOut = () => {
    onSignOut?.();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed bg-black/70 backdrop-blur-md z-50"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-[60]
          w-80 bg-black/80 backdrop-blur-xl text-white border-r border-[#333333]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="CoParty Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg">CoParty</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors text-[#999999] hover:text-white hover:bg-[#316afd]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SOCIAL */}
          <div className="mb-3">
            <p className="text-xs uppercase text-[#666666] mb-1 font-medium tracking-wider">Social</p>
            <nav className="space-y-0.5">
              <button 
                onClick={() => handleNavClick('profiles', undefined, 'profiles')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'profiles' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <User size={18} /> Profiles
              </button>
              <button 
                onClick={() => handleNavClick('projects', undefined, 'projects')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'projects' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <Laptop size={18} /> Projects
              </button>
              <button 
                onClick={() => handleNavClick('friends', 'friends')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'friends' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <Users size={18} /> Friends
              </button>
              <button 
                onClick={() => handleNavClick('saved', 'saved')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'saved' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <Bookmark size={18} /> Saved
              </button>
              <button 
                onClick={() => handleNavClick('meetings', 'meetings')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'meetings' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <Video size={18} /> Meetings
              </button>
            </nav>
          </div>

          {/* MAP & EVENTS */}
          <div className="mb-3">
            <p className="text-xs uppercase text-[#666666] mb-1 font-medium tracking-wider">Map & Events</p>
            <nav className="space-y-0.5">
              <button 
                onClick={() => handleNavClick('map', undefined, 'map')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'map' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <Map size={18} /> Map
              </button>
              <button 
                onClick={() => handleNavClick('events', undefined, 'events')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'events' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <Calendar size={18} /> Events
              </button>
            </nav>
          </div>

          {/* SETTINGS */}
          <div className="mb-3">
            <p className="text-xs uppercase text-[#666666] mb-1 font-medium tracking-wider">Settings</p>
            <nav className="space-y-0.5">
              <button 
                onClick={() => handleNavClick('profile-edit', 'profile-edit')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'profile-edit' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <UserPen size={18} /> Edit Profile
              </button>
              <button 
                onClick={() => handleNavClick('settings', 'settings')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeItem === 'settings' ? 'bg-[#316afd] text-white' : 'hover:bg-[#316afd] text-white text-[#cccccc]'
                }`}
              >
                <Settings size={18} /> Settings
              </button>
            </nav>
          </div>

          {/* GET PRO CTA Button */}
          <div className="mb-3">
            <div className="border-t border-[#333333] mb-2"></div>
            <button 
              onClick={handleGetPro}
              className="w-full flex items-center justify-center p-3 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-gradient"
              style={{
                background: 'linear-gradient(45deg, #316afd, #8b5cf6, #316afd, #7c3aed)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 3s ease infinite'
              }}
            >
              GET PRO
            </button>
          </div>

          {/* SUPPORT & LOGOUT */}
          <div className="mt-auto">
            <div className="border-t border-[#333333] pt-4 space-y-1">
              <button 
                onClick={() => handleNavClick('help', 'help')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#316afd] hover:text-white transition-colors text-[#cccccc]"
              >
                <HelpCircle size={18} /> Help & Support
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600/20 hover:text-red-400 transition-colors text-[#cccccc]"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#333333]">
              <img 
                src={logoImage} 
                alt="CoParty Logo" 
                className="w-6 h-6 object-contain"
              />
              <p className="text-xs text-[#666666]">CoParty v0.1.0</p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Sidebar;