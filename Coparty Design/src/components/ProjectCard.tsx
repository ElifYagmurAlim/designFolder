import React from 'react';
import { motion } from 'motion/react';
import { Share2, MessageSquare, Bookmark, Star, Clipboard } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectPost {
  id: string;
  title: string;
  description: string;
  lookingFor: string;
  requirements?: string[];
  links?: string[];
  ownerId: string;
  ownerName: string;
  avatarUrl?: string;
  role?: string;
  location?: string;
  isOnline?: boolean;
  isPro?: boolean;
  savedByUser?: boolean;
  appliedByUser?: boolean;
}

interface Props {
  projectPost: ProjectPost;
  onShowDetail?: (projectPost: ProjectPost) => void;
  onEdit?: (projectPost: ProjectPost) => void;
  onDelete?: (projectPost: ProjectPost) => void;
  onMessage?: (userId: string) => void;
  onSave?: (projectPost: ProjectPost) => void;
  onApply?: (projectPost: ProjectPost) => void;
  isOwner?: boolean;
}

const ProjectCard: React.FC<Props> = ({ 
  projectPost, 
  onShowDetail, 
  onEdit, 
  onDelete, 
  onMessage, 
  onSave, 
  onApply, 
  isOwner = false 
}) => {
  const handleClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation();
    callback?.();
  };

  const getUserRole = (post: ProjectPost) => {
    return post.role || 'Developer';
  };

  return (
    <motion.div
      className="bg-black border border-[#333333] rounded-xl p-5 max-w-[390px] mx-auto shadow-lg flex flex-col min-h-[600px] transition-all duration-200 hover:bg-[#111111]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex justify-end mb-2"></div>

      {/* Header - Avatar, Name, Role, Location, PRO badge, Online status, Share */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-16 h-16 rounded-xl overflow-hidden bg-[#333333] border border-[#333333] flex items-center justify-center cursor-pointer shadow flex-shrink-0"
          onClick={(e) => handleClick(e)}
        >
          {projectPost.avatarUrl && projectPost.avatarUrl.startsWith('http') ? (
            <ImageWithFallback 
              src={projectPost.avatarUrl || ''} 
              alt={projectPost.ownerName || 'User'} 
              width={64} 
              height={64} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-2xl font-semibold text-white">
              {(projectPost.ownerName || 'User')?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>
        <div
          className="flex-1 min-w-0 h-[64px] flex flex-col justify-start pt-0.5 cursor-pointer"
          onClick={(e) => handleClick(e)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0">
                <h3 
                  className="font-bold text-white text-[20px] leading-[1.2] truncate cursor-pointer hover:underline"
                  onClick={(e) => handleClick(e)}
                >
                  {projectPost.ownerName}
                </h3>
                {projectPost.isOnline && (
                  <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                )}
                {projectPost.isPro && (
                  <span 
                    className="text-[12px] text-white/90 font-semibold tracking-wide cursor-pointer hover:text-white transition-colors"
                    onClick={(e) => handleClick(e)}
                  >
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[14px] text-[#999999] font-medium mb-0">
                {getUserRole(projectPost)}
              </p>
              <p className="text-[14px] text-[#666666] font-medium">
                {projectPost.location}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-2">
              <button
                onClick={(e) => handleClick(e)}
                className="text-[#0066ff] hover:opacity-80 transition-colors"
                aria-label="Share project"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mb-6">
        {/* Main Title */}
        <div className="mb-2">
          <h3 className="text-[20px] leading-[1.2] font-semibold text-white mb-1 break-words">
            {projectPost.title}
          </h3>
          <p className="text-[14px] text-[#cccccc] leading-[1.5] break-words">
            {projectPost.description}
          </p>
        </div>

        {/* Looking For Section */}
        <div className="mb-2">
          <h3 className="text-[16px] font-bold text-white mb-1">Looking For</h3>
          <p className="text-[14px] text-[#cccccc] leading-[1.5] break-words">
            {projectPost.lookingFor}
          </p>
        </div>

        {/* Requirements Section */}
        {projectPost.requirements && projectPost.requirements.length > 0 && (
          <div className="mb-3">
            <h3 className="text-[16px] font-bold text-white mb-2">Requirements</h3>
            <ul className="space-y-1">
              {projectPost.requirements.map((requirement, index) => (
                <li key={`requirement-${index}`} className="text-[14px] text-[#cccccc] pl-3 relative break-words">
                  <span className="absolute left-0 top-0 text-white">•</span>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links Section */}
        {projectPost.links && projectPost.links.length > 0 && (
          <div className="mb-3">
            <h3 className="text-[18px] font-semibold text-white mb-2">Links</h3>
            <div className="space-y-1">
              {projectPost.links.map((link, index) => (
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        {!isOwner && (
          <>
            <button
              onClick={(e) => handleClick(e, () => onSave?.(projectPost))}
              disabled={projectPost.savedByUser}
              className={`flex-1 flex justify-center items-center gap-2 px-5 py-3 rounded-xl transition-colors font-bold text-[14px] ${
                projectPost.savedByUser 
                  ? 'bg-gray-500 text-white cursor-not-allowed' 
                  : 'bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {projectPost.savedByUser ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={(e) => handleClick(e, () => onApply?.(projectPost))}
              disabled={projectPost.appliedByUser}
              className={`flex-1 flex justify-center items-center gap-2 px-5 py-3 rounded-xl transition-colors font-bold text-[14px] ${
                projectPost.appliedByUser 
                  ? 'bg-green-500 text-white cursor-not-allowed' 
                  : 'bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white'
              }`}
            >
              <Clipboard className="w-4 h-4" />
              {projectPost.appliedByUser ? 'Applied' : 'Apply'}
            </button>
          </>
        )}
        {isOwner && (
          <>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-5 py-3 rounded-xl transition-colors font-bold text-[14px]"
              onClick={(e) => handleClick(e, () => onEdit?.(projectPost))}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#222222] border border-red-700 text-red-400 px-5 py-3 rounded-xl transition-colors font-bold text-[14px]"
              onClick={(e) => handleClick(e, () => onDelete?.(projectPost))}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;