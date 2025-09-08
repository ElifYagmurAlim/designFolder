import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, MessageSquare, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileCardData {
  id: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  focus?: string;
  links?: string[];
  aiInsight?: string;
  location: string;
  role: string;
  isOnline: boolean;
  isPro: boolean;
}

interface ProfileCardProps {
  profile: ProfileCardData;
  onConnect?: (profile: ProfileCardData) => void;
  onMessage?: (profile: ProfileCardData) => void;
  onShare?: (profile: ProfileCardData) => void;
  onOpenProfile?: (profile: ProfileCardData) => void;
  connectionStatus?: 'none' | 'pending' | 'accepted';
}

export default function ProfileCard({ 
  profile, 
  onConnect,
  onMessage,
  onShare,
  onOpenProfile,
  connectionStatus = 'none'
}: ProfileCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [isConnectLoading, setIsConnectLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  
  const shouldShowAvatar = profile.avatarUrl && profile.avatarUrl.startsWith('http') && !avatarError;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenProfile?.(profile);
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConnectLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsConnectLoading(false);
      onConnect?.(profile);
    }, 1000);
  };

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMessageLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsMessageLoading(false);
      onMessage?.(profile);
    }, 800);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(profile);
  };

  const getConnectButtonText = () => {
    if (isConnectLoading) return 'Sending...';
    if (connectionStatus === 'accepted') return 'Connected';
    if (connectionStatus === 'pending') return 'Pending';
    return 'Connect';
  };

  const getConnectButtonStyle = () => {
    if (connectionStatus === 'accepted') return 'bg-green-600 cursor-not-allowed';
    if (connectionStatus === 'pending') return 'bg-yellow-600 cursor-not-allowed';
    if (isConnectLoading) return 'bg-gray-600 cursor-not-allowed';
    return 'bg-[#111111] hover:bg-[#316afd]';
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="group bg-black rounded-xl border border-[#333333] p-5 cursor-pointer transition-all duration-200 hover:bg-[#111111] flex flex-col min-h-[600px] max-w-[390px] mx-auto"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex justify-end mb-2"></div>

      <div className="flex items-start gap-3 mb-3">
        {/* Avatar - Square style */}
        <div 
          className="w-16 h-16 rounded-xl overflow-hidden bg-[#333333] border border-[#333333] flex items-center justify-center relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => { e.stopPropagation(); handleCardClick(e); }}
        >
          {shouldShowAvatar ? (
            <ImageWithFallback
              src={profile.avatarUrl || ''}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-white">
              {profile.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div 
          className="flex-1 min-w-0 h-[64px] flex flex-col justify-start pt-0.5 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); handleCardClick(e); }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0">
                <h3 
                  className="text-[20px] leading-[1.2] font-bold text-white truncate cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); handleCardClick(e); }}
                >
                  {profile.name}
                </h3>
                {profile.isOnline && (
                  <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                )}
                {profile.isPro && (
                  <span 
                    className="text-[12px] text-white/90 font-semibold tracking-wide cursor-pointer hover:text-white transition-colors"
                  >
                    PRO
                  </span>
                )}
              </div>
              <p 
                className="text-[14px] text-[#999999] font-medium mb-0 cursor-pointer hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); handleCardClick(e); }}
              >
                {profile.role}
              </p>
              <p 
                className="text-[14px] text-[#666666] font-medium cursor-pointer hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); handleCardClick(e); }}
              >
                {profile.location}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-2">
              <button
                onClick={handleShare}
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
      <div className="flex-1 mb-6">
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

        {/* AI Insight Section */}
        {profile.aiInsight && (
          <div className="mb-3">
            <h4 className="text-[16px] font-bold text-white mb-2">AI Insight</h4>
            <div className="border border-[#333333] rounded-xl p-4 bg-black">
              <p className="text-[14px] text-[#cccccc] leading-[1.5]">
                {profile.aiInsight}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <button 
          onClick={handleConnect}
          disabled={isConnectLoading || connectionStatus === 'accepted' || connectionStatus === 'pending'}
          className={`flex-1 flex justify-center items-center gap-2 border border-[#333333] text-white px-5 py-3 rounded-xl transition-colors font-bold text-[14px] ${getConnectButtonStyle()}`}
        >
          {isConnectLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              {getConnectButtonText()}
            </>
          )}
        </button>
        <button 
          onClick={handleMessage}
          disabled={isMessageLoading}
          className={`flex-1 flex justify-center items-center gap-2 border border-[#333333] text-white px-5 py-3 rounded-xl transition-colors font-bold text-[14px] ${
            isMessageLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-[#111111] hover:bg-[#316afd]'
          }`}
        >
          {isMessageLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Opening...
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
  );
}