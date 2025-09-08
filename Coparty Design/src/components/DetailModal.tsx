import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Copy, Calendar, MapPin, Users, Star, MessageSquare, Bookmark, Share2, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
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

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, project }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'team'>('overview');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(project.appliedByUser || false);
  const [saved, setSaved] = useState(project.savedByUser || false);

  const handleClose = () => {
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    setApplied(true);
    console.log('Applied to project:', project.id);
  };

  const handleSave = () => {
    setSaved(!saved);
    console.log(saved ? 'Removed from saved' : 'Saved project:', project.id);
  };

  const handleMessage = () => {
    console.log('Message owner:', project.ownerId);
  };

  const handleShare = () => {
    copyToClipboard(`Check out this project: ${project.title}`);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Star className="w-4 h-4" /> },
    { id: 'requirements', label: 'Requirements', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-[#111111] border border-[#333333] rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] relative mx-4 flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#333333]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#333333] border border-[#333333] flex items-center justify-center flex-shrink-0">
                  {project.avatarUrl && project.avatarUrl.startsWith('http') ? (
                    <ImageWithFallback 
                      src={project.avatarUrl} 
                      alt={project.ownerName} 
                      width={64} 
                      height={64} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-white">
                      {project.ownerName?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{project.title}</h1>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>by {project.ownerName}</span>
                    {project.isOnline && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {project.isPro && (
                      <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full font-semibold">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Posted 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#333333] px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#316afd] border-b-2 border-[#316afd]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Project Description</h3>
                    <p className="text-gray-300 leading-relaxed">{project.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Looking For</h3>
                    <p className="text-gray-300">{project.lookingFor}</p>
                  </div>

                  {project.links && project.links.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Project Links</h3>
                      <div className="space-y-2">
                        {project.links.map((link, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-[#222222] rounded-lg">
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#316afd] hover:text-blue-400 transition-colors flex-1 truncate"
                            >
                              {link}
                            </a>
                            <button
                              onClick={() => copyToClipboard(link)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requirements' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Requirements & Skills</h3>
                  {project.requirements && project.requirements.length > 0 ? (
                    <div className="space-y-3">
                      {project.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-[#222222] rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No specific requirements listed.</p>
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Project Owner</h3>
                  <div className="bg-[#222222] rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#333333] border border-[#333333] flex items-center justify-center">
                        {project.avatarUrl && project.avatarUrl.startsWith('http') ? (
                          <ImageWithFallback 
                            src={project.avatarUrl} 
                            alt={project.ownerName} 
                            width={80} 
                            height={80} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-3xl font-semibold text-white">
                            {project.ownerName?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white">{project.ownerName}</h4>
                        <p className="text-gray-400">{project.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">{project.location}</span>
                          {project.isOnline && (
                            <>
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span className="text-green-500 text-sm">Online</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleMessage}
                      className="w-full bg-[#316afd] hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[#333333] bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    saved
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-[#222222] hover:bg-[#333333] text-gray-300 border border-[#444444]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  {saved ? 'Saved' : 'Save'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-[#222222] hover:bg-[#333333] text-gray-300 border border-[#444444] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Share'}
                </button>

                <div className="flex-1" />

                <button
                  onClick={handleApply}
                  disabled={applied}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    applied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                      : 'bg-[#316afd] hover:bg-blue-600 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {applied ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;