import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, UserPlus, Share2, Loader2, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileModalData {
  id: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  focus?: string;
  skills?: string[];
  highlights?: string[];
  links?: string[];
  lookingFor?: string;
  location: string;
  role: string;
  isOnline: boolean;
  isPro: boolean;
}

interface ProfileModalProps {
  isOpen: boolean;
  profile: ProfileModalData | null;
  onClose: () => void;
  onConnect?: (profile: ProfileModalData) => void;
  onMessage?: (profile: ProfileModalData) => void;
  onShare?: (profile: ProfileModalData) => void;
  connectionStatus?: 'none' | 'pending' | 'accepted';
}

export default function ProfileModal({ 
  isOpen, 
  profile, 
  onClose,
  onConnect,
  onMessage,
  onShare,
  connectionStatus = 'none'
}: ProfileModalProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [isConnectLoading, setIsConnectLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAvatarError(false);
      setIsConnectLoading(false);
      setIsMessageLoading(false);
      setConnectSuccess(false);
      setMessageSuccess(false);
    }
  }, [isOpen]);

  // Early return if no profile or modal not open
  if (!isOpen || !profile) return null;

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const shouldShowAvatar = profile.avatarUrl && 
    profile.avatarUrl.startsWith('http') && 
    !avatarError;

  const handleShareProfile = () => {
    onShare?.(profile);
  };

  const handleProBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('PRO badge clicked');
  };

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMessageLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsMessageLoading(false);
      setMessageSuccess(true);
      onMessage?.(profile);
      
      // Reset success state and close modal after delay
      setTimeout(() => {
        setMessageSuccess(false);
        onClose();
      }, 1000);
    }, 800);
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (connectionStatus === 'accepted') {
      console.log('Already connected');
      return;
    }

    if (connectionStatus === 'pending') {
      console.log('Connection request already sent');
      return;
    }

    setIsConnectLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsConnectLoading(false);
      setConnectSuccess(true);
      onConnect?.(profile);
      
      // Reset success state after delay
      setTimeout(() => {
        setConnectSuccess(false);
      }, 2000);
    }, 1000);
  };

  const getConnectButtonText = () => {
    if (isConnectLoading) return 'Sending Request...';
    if (connectSuccess) return 'Request Sent!';
    if (connectionStatus === 'accepted') return 'Connected';
    if (connectionStatus === 'pending') return 'Pending';
    return 'Connect';
  };

  const getConnectButtonStyle = () => {
    if (connectionStatus === 'accepted') return 'bg-green-600 cursor-not-allowed';
    if (connectionStatus === 'pending') return 'bg-yellow-600 cursor-not-allowed';
    if (isConnectLoading) return 'bg-gray-600 cursor-not-allowed';
    if (connectSuccess) return 'bg-green-600';
    return 'bg-[#111111] hover:bg-[#316afd]';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content - Same design as ProfileCard */}
          <motion.div
            className="bg-black rounded-xl border border-[#333333] max-w-[390px] w-full mx-auto relative max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 hover:bg-[#111111] rounded-lg transition-colors text-[#999999] hover:text-white z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex justify-end mb-2 pt-2"></div>

            <div className="flex items-start gap-3 mb-3 p-5 pt-7">
              {/* Avatar - Square style */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#333333] flex items-center justify-center relative flex-shrink-0">
                {shouldShowAvatar ? (
                  <ImageWithFallback
                    src={profile.avatarUrl || ''}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={handleAvatarError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-white">
                    {profile.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 min-w-0 h-[64px] flex flex-col justify-start pt-0.5">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0">
                      <h3 className="text-[20px] leading-[1.2] font-bold text-white truncate">
                        {profile.name}
                      </h3>
                      {profile.isOnline && (
                        <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                      )}
                      {profile.isPro && (
                        <span 
                          className="text-[12px] text-white/90 font-semibold tracking-wide cursor-pointer hover:text-white transition-colors"
                          onClick={handleProBadgeClick}
                        >
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-[#999999] font-medium mb-0">
                      {profile.role}
                    </p>
                    <p className="text-[14px] text-[#666666] font-medium">
                      {profile.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <button
                      onClick={handleShareProfile}
                      className="text-[#0066ff] hover:opacity-80 transition-colors"
                      aria-label="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-5 pt-2">
              {/* Description */}
              <div className="mb-3">
                <p className="text-[14px] text-[#cccccc] leading-[1.5] break-words">
                  {profile.bio}
                </p>
              </div>

              {/* Focus */}
              {profile.focus && (
                <div className="mb-3">
                  <h4 className="text-[16px] font-bold text-white mb-2">Focus</h4>
                  <p className="text-[14px] text-[#cccccc] leading-[1.5] break-words">
                    {profile.focus}
                  </p>
                </div>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-[16px] font-bold text-white mb-2">Skills</h4>
                  <ul className="space-y-1">
                    {profile.skills.map((skill, index) => (
                      <li key={`skill-${index}`} className="text-[14px] text-[#cccccc] pl-4 relative break-words">
                        <span className="absolute left-0 top-0 text-[#666666]">•</span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Highlights */}
              {profile.highlights && profile.highlights.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-[16px] font-bold text-white mb-2">Highlights</h4>
                  <ul className="space-y-1">
                    {profile.highlights.map((item, index) => (
                      <li key={`highlight-${index}`} className="text-[14px] text-[#cccccc] pl-4 relative break-words">
                        <span className="absolute left-0 top-0 text-[#666666]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              {profile.links && profile.links.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-[16px] font-bold text-white mb-2">Links</h4>
                  <div className="space-y-1">
                    {profile.links.map((link, index) => (
                      <div key={`link-${index}`} className="overflow-hidden">
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="!text-[#cccccc] visited:!text-[#cccccc] hover:!text-[#0066ff] transition-colors text-[14px] leading-[1.4] break-words"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {link}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Looking For */}
              {profile.lookingFor && (
                <div className="mb-3">
                  <h4 className="text-[16px] font-bold text-white mb-2">Looking For</h4>
                  <p className="text-[14px] text-[#cccccc] leading-[1.5] break-words">
                    {profile.lookingFor}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-5 pt-3">
              <button 
                onClick={handleConnect}
                disabled={isConnectLoading || connectionStatus === 'accepted' || connectionStatus === 'pending'}
                className={`flex-1 flex justify-center items-center gap-2 border border-[#333333] text-white px-5 py-3 rounded-xl transition-all duration-200 font-bold text-[14px] ${getConnectButtonStyle()}`}
              >
                {isConnectLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Request...
                  </>
                ) : connectSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Request Sent!
                  </>
                ) : connectionStatus === 'accepted' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Connected
                  </>
                ) : connectionStatus === 'pending' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Pending
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
              <button 
                onClick={handleMessage}
                disabled={isMessageLoading}
                className={`flex-1 flex justify-center items-center gap-2 border border-[#333333] text-white px-5 py-3 rounded-xl transition-all duration-200 font-bold text-[14px] ${
                  isMessageLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : messageSuccess
                    ? 'bg-green-600'
                    : 'bg-[#111111] hover:bg-[#316afd]'
                }`}
              >
                {isMessageLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Opening Chat...
                  </>
                ) : messageSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Chat Opened!
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}