import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SavedItem {
  id: string;
  title: string;
  ownerName: string;
  avatarUrl?: string;
  createdAt?: Date;
  isPro?: boolean;
  location?: string;
  city?: string;
  country?: string;
  isOnline?: boolean;
  description?: string;
}

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProject?: (projectId: string) => void;
  onRemoveProject?: (projectId: string) => void;
  onOpenProfile?: (owner: any) => void;
}

const SavedModal: React.FC<SavedModalProps> = ({ 
  isOpen, 
  onClose, 
  onViewProject,
  onRemoveProject,
  onOpenProfile
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate loading
      setTimeout(() => {
        const mockItems = [
          { 
            id: 'p1', 
            title: 'AI-powered UI Builder - Looking for Frontend Developer', 
            ownerName: 'Jane Doe', 
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face', 
            isPro: true, 
            isOnline: true, 
            city: 'Berlin', 
            country: 'Germany', 
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            description: 'Building an innovative AI-powered UI design tool that helps developers create beautiful interfaces faster.'
          },
          { 
            id: 'p2', 
            title: 'Indie Game – Pixel Art Adventure', 
            ownerName: 'Alex Smith', 
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 
            isPro: false, 
            isOnline: false, 
            city: 'Istanbul', 
            country: 'Türkiye', 
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            description: 'Creating a nostalgic pixel art adventure game with modern gameplay mechanics.'
          },
          { 
            id: 'p3', 
            title: 'Podcast Production Platform', 
            ownerName: 'Mia Chen', 
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', 
            isOnline: true, 
            city: 'London', 
            country: 'United Kingdom', 
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            description: 'All-in-one platform for podcast creators to record, edit, and distribute their content.'
          },
          { 
            id: 'p4', 
            title: 'E-commerce Mobile App', 
            ownerName: 'Chris Johnson', 
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', 
            isPro: true, 
            isOnline: true, 
            city: 'Prague', 
            country: 'Czechia', 
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            description: 'Modern mobile e-commerce application with AI-powered product recommendations.'
          },
          { 
            id: 'p5', 
            title: 'Data Visualization Dashboard', 
            ownerName: 'Sara Lee', 
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face', 
            isPro: true, 
            isOnline: false, 
            city: 'Seoul', 
            country: 'South Korea', 
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            description: 'Interactive dashboard for visualizing complex datasets with real-time analytics.'
          },
        ];
        setItems(mockItems);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  const handleRemoveProject = async (projectId: string) => {
    setRemovingId(projectId);
    
    // Simulate API call
    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== projectId));
      setRemovingId(null);
      onRemoveProject?.(projectId);
    }, 1000);
  };

  const handleProjectClick = (item: SavedItem) => {
    onViewProject?.(item.id);
  };

  const handleProfileClick = (item: SavedItem) => {
    onOpenProfile?.({
      id: item.id + '_owner',
      name: item.ownerName,
      avatarUrl: item.avatarUrl,
      role: 'Project Creator',
      location: item.location || item.city || item.country || '',
      isOnline: item.isOnline || false,
      isPro: item.isPro || false,
      bio: `Creator of "${item.title}"`,
      focus: 'Project development and collaboration',
      skills: ['Project Management', 'Leadership'],
      highlights: ['Project Creator'],
      links: [],
      lookingFor: 'Collaborators and team members',
      aiInsight: 'This user is actively looking for project collaborators.'
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#0a0a0a] border border-[#333333] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-[#333333] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#316afd]" />
              <h2 className="text-lg font-bold text-white">Saved Projects</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#111111] rounded-lg transition-colors text-[#999999] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#316afd]" />
                <span className="ml-2 text-[#999999]">Loading saved projects...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-[#666666]">No saved projects yet.</div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-[#111111] rounded-xl border border-[#333333] hover:border-[#444444] transition-colors">
                    {/* Avatar */}
                    <div 
                      className="w-16 h-16 rounded-xl overflow-hidden bg-[#222222] border border-[#333333] flex items-center justify-center relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleProfileClick(item)}
                    >
                      {item.avatarUrl ? (
                        <ImageWithFallback 
                          src={item.avatarUrl} 
                          alt={item.ownerName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                          {item.ownerName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <p 
                        className="text-white font-bold leading-tight cursor-pointer hover:text-[#316afd] transition-colors mb-1 break-words"
                        onClick={() => handleProjectClick(item)}
                      >
                        {item.title}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-[#666666] mb-1">
                        <span>
                          by <span 
                            className="text-white cursor-pointer hover:underline"
                            onClick={() => handleProfileClick(item)}
                          >
                            {item.ownerName}
                          </span>
                        </span>
                        {item.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                        {item.isPro && (
                          <span className="text-xs text-white/90 font-bold tracking-wide">
                            PRO
                          </span>
                        )}
                      </div>
                      
                      {(item.city || item.country || item.location) && (
                        <p className="text-xs text-[#555555]">
                          {[item.city, item.country].filter(Boolean).join(', ') || item.location}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-2 rounded-lg bg-[#111111] hover:bg-[#316afd] text-white border border-[#333333] transition-colors text-sm font-medium flex items-center gap-2"
                        onClick={() => handleProjectClick(item)}
                      >
                        <ExternalLink className="w-4 h-4 text-white" /> View
                      </button>
                      <button
                        className="px-3 py-2 rounded-lg bg-[#111111] hover:bg-red-600 text-white border border-[#333333] transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleRemoveProject(item.id)}
                        disabled={removingId === item.id}
                      >
                        {removingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-white" />
                        )}
                        {removingId === item.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SavedModal;