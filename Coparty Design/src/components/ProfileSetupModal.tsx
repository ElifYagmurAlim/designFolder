import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, User, Save } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ProfileCard from './ProfileCard';

interface ProfileFormState {
  name: string;
  location: string;
  bio: string;
  role: string;
  focus: string;
  skills: string[];
  highlights: string[];
  links: string[];
  email: string;
  avatarUrl: string;
  avatarPreviewUrl: string;
}

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (profileData: ProfileFormState) => void;
}

export default function ProfileSetupModal({ isOpen, onClose, onComplete }: ProfileSetupModalProps) {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormState>({
    name: '',
    location: '',
    bio: '',
    role: '',
    focus: '',
    skills: [],
    highlights: [],
    links: [],
    email: '',
    avatarUrl: '',
    avatarPreviewUrl: ''
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // New array field management states
  const [newSkill, setNewSkill] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newLink, setNewLink] = useState('');

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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormErrors([]);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof ProfileFormState, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ 
        ...prev,
        avatarPreviewUrl: previewUrl
      }));
    }
  };

  // Array field management functions
  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setProfileData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setProfileData(prev => ({
        ...prev,
        links: [...prev.links, newLink.trim()]
      }));
      setNewLink('');
    }
  };

  const removeLink = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors([]);

    // Basic validation
    const errors: string[] = [];
    if (!profileData.name.trim()) errors.push('Name is required');
    if (!profileData.location.trim()) errors.push('Location is required');
    if (!profileData.bio.trim()) errors.push('Bio is required');
    if (!profileData.focus.trim()) errors.push('Focus is required');
    if (profileData.skills.length === 0) errors.push('At least one skill is required');

    if (errors.length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Profile created:', profileData);
      onComplete?.(profileData);
      onClose();
    }, 2000);
  };

  // Form validation
  const isFormValid = () => {
    return profileData.name.trim() && 
           profileData.location.trim() && 
           profileData.bio.trim() && 
           profileData.focus.trim() && 
           profileData.skills.length > 0;
  };

  // Generic AI insight for setup modal
  const mockInsight = "AI will generate personalized insights based on your profile and search context. 🌟 This helps others understand your expertise and collaboration potential.";

  const previewProfileCard = {
    id: 'preview',
    name: profileData.name || 'Your Name',
    avatarUrl: profileData.avatarPreviewUrl || '',
    role: profileData.role || (profileData.skills[0] || 'Creator'),
    location: profileData.location || 'Your City, Country',
    isOnline: false,
    isPro: false,
    bio: profileData.bio || 'Introduce yourself... This short bio will appear on your card.',
    focus: profileData.focus || '',
    skills: profileData.skills,
    highlights: profileData.highlights,
    links: profileData.links,
    lookingFor: '',
    aiInsight: mockInsight
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-black border border-[#333333] rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333]">
              <h2 className="text-lg font-semibold text-white">Create Your Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#111111] rounded-lg transition-colors text-[#999999] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-6" noValidate>
              {/* Error messages */}
              {formErrors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
                  <ul className="list-disc pl-5">
                    {formErrors.map((err, i) => <li key={`error-${i}`}>{err}</li>)}
                  </ul>
                </div>
              )}

              {/* Avatar Section */}
              <div className="bg-[#111111] rounded-lg p-4 border border-[#333333]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#333333] border-2 border-white/20 flex items-center justify-center overflow-hidden">
                      {profileData.avatarPreviewUrl ? (
                        <ImageWithFallback 
                          src={profileData.avatarPreviewUrl} 
                          alt="Profile photo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-[#666666]" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#316afd] p-1.5 rounded-full cursor-pointer hover:bg-[#3a76ff] transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Profile Photo</h3>
                    <p className="text-sm text-[#999999]">
                      JPG, PNG or GIF format, maximum 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-[#111111] rounded-lg p-4 border border-[#333333] space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location *</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="Ex: Istanbul, Turkey"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">About Me *</label>
                  <textarea
                    value={profileData.bio}
                    onChange={e => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd] resize-none"
                    placeholder="Introduce yourself in 2-3 sentences..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Experience & Focus Section */}
              <div className="bg-[#111111] rounded-lg p-4 border border-[#333333] space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Experience & Focus</h3>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Professional Title/Role *</label>
                  <input
                    value={profileData.role}
                    onChange={e => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="Ex: Frontend Developer, Product Designer, UX Researcher"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">My Current Focus *</label>
                  <input
                    value={profileData.focus}
                    onChange={e => handleInputChange('focus', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="Ex: Developing mobile apps with React Native"
                    required
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-[#111111] rounded-lg p-4 border border-[#333333]">
                <label className="block text-sm font-medium text-white mb-2">Skills *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="Add new skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-2 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {profileData.skills.map((skill, index) => (
                    <div key={`skill-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <span className="text-white">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-[#999999] hover:text-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-[#111111] rounded-lg p-4 border border-[#333333]">
                <label className="block text-sm font-medium text-white mb-2">Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={e => setNewHighlight(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="Add new highlight"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-3 py-2 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {profileData.highlights.map((highlight, index) => (
                    <div key={`highlight-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <span className="text-white">{highlight}</span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="text-[#999999] hover:text-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Links */}
              <div className="bg-[#111111] rounded-lg p-4 border border-[#333333]">
                <label className="block text-sm font-medium text-white mb-2">Portfolio Links</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLink}
                    onChange={e => setNewLink(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addLink())}
                    className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd]"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="px-3 py-2 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {profileData.links.map((link, index) => (
                    <div key={`link-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#316afd] hover:underline truncate">
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-[#999999] hover:text-red-500 transition-colors ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="pt-4 border-t border-[#333333]">
                <h4 className="text-base font-semibold text-white mb-3">Preview</h4>
                <div className="max-w-sm mx-auto">
                  <ProfileCard profile={previewProfileCard} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg text-white hover:bg-[#111111] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="flex-1 px-4 py-2 bg-[#111111] text-white rounded-lg border border-[#333333] hover:bg-[#316afd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {loading ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}