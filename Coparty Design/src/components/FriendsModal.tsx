import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, MessageSquare, UserMinus, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FriendItem {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  location?: string;
  city?: string;
  country?: string;
  isPro?: boolean;
}

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageFriend?: (id: string) => void;
  onRemoveFriend?: (id: string) => void;
  onAcceptRequest?: (id: string) => void;
  onDeclineRequest?: (id: string) => void;
  onOpenProfile?: (friend: FriendItem) => void;
}

const FriendsModal: React.FC<FriendsModalProps> = ({ 
  isOpen, 
  onClose, 
  onMessageFriend,
  onRemoveFriend,
  onAcceptRequest,
  onDeclineRequest,
  onOpenProfile
}) => {
  const [loading, setLoading] = useState(false);
  const [friendsList, setFriendsList] = useState<FriendItem[]>([]);
  const [requestsList, setRequestsList] = useState<FriendItem[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate loading
      setTimeout(() => {
        const mockFriends = [
          { 
            id: 'u1', 
            name: 'Jane Doe', 
            role: 'Product Designer', 
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face', 
            isOnline: true, 
            city: 'Berlin', 
            country: 'Germany', 
            isPro: true 
          },
          { 
            id: 'u2', 
            name: 'Alex Smith', 
            role: 'Frontend Developer', 
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 
            isOnline: false, 
            city: 'Istanbul', 
            country: 'Türkiye', 
            isPro: false 
          },
          { 
            id: 'u3', 
            name: 'Mia Chen', 
            role: 'Music Producer', 
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', 
            isOnline: true, 
            city: 'London', 
            country: 'United Kingdom', 
            isPro: true 
          },
          { 
            id: 'u4', 
            name: 'David Wilson', 
            role: 'UX Researcher', 
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', 
            isOnline: true, 
            city: 'Amsterdam', 
            country: 'Netherlands', 
            isPro: false 
          },
          { 
            id: 'u5', 
            name: 'Emma Thompson', 
            role: 'Backend Developer', 
            avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face', 
            isOnline: false, 
            city: 'Toronto', 
            country: 'Canada', 
            isPro: true 
          },
        ];
        
        const mockRequests = [
          { 
            id: 'r1', 
            name: 'Chris Johnson', 
            role: '3D Artist', 
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', 
            city: 'Prague', 
            country: 'Czechia', 
            isPro: false 
          },
          { 
            id: 'r2', 
            name: 'Sara Lee', 
            role: 'Data Scientist', 
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face', 
            city: 'Seoul', 
            country: 'South Korea', 
            isPro: true 
          },
          { 
            id: 'r3', 
            name: 'Michael Brown', 
            role: 'Game Developer', 
            avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face', 
            city: 'Melbourne', 
            country: 'Australia', 
            isPro: false 
          },
        ];
        
        setFriendsList(mockFriends);
        setRequestsList(mockRequests);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  const handleAcceptRequest = (userId: string) => {
    // Find the request and move it to friends list
    const request = requestsList.find(r => r.id === userId);
    if (request) {
      setFriendsList(prev => [...prev, request]);
      setRequestsList(prev => prev.filter(r => r.id !== userId));
      onAcceptRequest?.(userId);
    }
  };

  const handleDeclineRequest = (userId: string) => {
    setRequestsList(prev => prev.filter(r => r.id !== userId));
    onDeclineRequest?.(userId);
  };

  const handleRemoveFriend = (userId: string) => {
    const friend = friendsList.find(f => f.id === userId);
    if (friend && confirm(`Are you sure you want to remove ${friend.name} from your friends list?`)) {
      setFriendsList(prev => prev.filter(f => f.id !== userId));
      onRemoveFriend?.(userId);
    }
  };

  const handleMessageFriend = (userId: string) => {
    onMessageFriend?.(userId);
  };

  const handleProfileClick = (friend: FriendItem) => {
    onOpenProfile?.(friend);
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
          className="bg-[#0a0a0a] border border-[#333333] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-[#333333] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#316afd]" />
              <h2 className="text-lg font-bold text-white">Friends</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#111111] rounded-lg transition-colors text-[#999999] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
            {loading ? (
              <div className="text-center py-8 text-[#999999]">Loading friends and requests...</div>
            ) : (
              <>
                <section>
                  <h3 className="text-[#999999] text-xs uppercase tracking-wide mb-4">Friends ({friendsList.length})</h3>
                  {friendsList.length === 0 ? (
                    <div className="text-center py-8 text-[#666666]">No friends yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {friendsList.map((friend) => (
                        <div key={friend.id} className="flex items-center gap-4 p-4 bg-[#111111] rounded-xl border border-[#333333]">
                          <div 
                            className="w-16 h-16 rounded-xl overflow-hidden bg-[#222222] border border-[#333333] flex items-center justify-center relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleProfileClick(friend)}
                          >
                            {friend.avatarUrl ? (
                              <ImageWithFallback 
                                src={friend.avatarUrl} 
                                alt={friend.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                                {friend.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p 
                                className="text-white font-bold leading-tight truncate cursor-pointer hover:underline"
                                onClick={() => handleProfileClick(friend)}
                              >
                                {friend.name}
                              </p>
                              {friend.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                              {friend.isPro && (
                                <span className="text-xs text-white/90 font-bold tracking-wide">
                                  PRO
                                </span>
                              )}
                            </div>
                            {friend.role && (
                              <p className="text-xs text-[#999999] font-medium truncate">{friend.role}</p>
                            )}
                            {(friend.city || friend.country || friend.location) && (
                              <p className="text-xs text-[#666666] font-medium truncate">
                                {[friend.city, friend.country].filter(Boolean).join(', ') || friend.location}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-2 rounded-lg bg-[#111111] hover:bg-[#316afd] text-white border border-[#333333] transition-colors text-sm font-medium flex items-center gap-2"
                              onClick={() => handleMessageFriend(friend.id)}
                            >
                              <MessageSquare className="w-4 h-4 text-white" /> Message
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg bg-[#111111] hover:bg-red-600 text-white border border-[#333333] transition-colors text-sm font-medium flex items-center gap-2"
                              onClick={() => handleRemoveFriend(friend.id)}
                            >
                              <UserMinus className="w-4 h-4 text-white" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-[#999999] text-xs uppercase tracking-wide mb-4">Connection Requests ({requestsList.length})</h3>
                  {requestsList.length === 0 ? (
                    <div className="text-center py-8 text-[#666666]">No requests.</div>
                  ) : (
                    <div className="space-y-4">
                      {requestsList.map((request) => (
                        <div key={request.id} className="flex items-center gap-4 p-4 bg-[#111111] rounded-xl border border-[#333333]">
                          <div 
                            className="w-16 h-16 rounded-xl overflow-hidden bg-[#222222] border border-[#333333] flex items-center justify-center relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleProfileClick(request)}
                          >
                            {request.avatarUrl ? (
                              <ImageWithFallback 
                                src={request.avatarUrl} 
                                alt={request.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                                {request.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p 
                                className="text-white font-bold leading-tight truncate cursor-pointer hover:underline"
                                onClick={() => handleProfileClick(request)}
                              >
                                {request.name}
                              </p>
                              {request.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                              {request.isPro && (
                                <span className="text-xs text-white/90 font-bold tracking-wide">
                                  PRO
                                </span>
                              )}
                            </div>
                            {request.role && (
                              <p className="text-xs text-[#999999] font-medium truncate">{request.role}</p>
                            )}
                            {(request.city || request.country || request.location) && (
                              <p className="text-xs text-[#666666] font-medium truncate">
                                {[request.city, request.country].filter(Boolean).join(', ') || request.location}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-2 rounded-lg bg-[#111111] hover:bg-green-600 text-white border border-[#333333] transition-colors text-sm font-medium flex items-center gap-2"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <Check className="w-4 h-4 text-white" /> Accept
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg bg-[#111111] hover:bg-red-600 text-white border border-[#333333] transition-colors text-sm font-medium flex items-center gap-2"
                              onClick={() => handleDeclineRequest(request.id)}
                            >
                              <X className="w-4 h-4 text-white" /> Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FriendsModal;