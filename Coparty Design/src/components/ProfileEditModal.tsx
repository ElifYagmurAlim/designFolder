import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Save, ArrowLeft, User, MapPin, FileText, Tag, Award, Link2, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ProfileCard from './ProfileCard';

interface ProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  location: string;
  bio: string;
  role: string;
  focus: string;
  skills: string[];
  highlights: string[];
  links: string[];
  lookingFor: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: any;
  onClose: () => void;
  onSave?: (profileData: ProfileData) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ 
  isOpen, 
  profile, 
  onClose, 
  onSave 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    avatarUrl: '',
    location: '',
    bio: '',
    role: '',
    focus: '',
    skills: [],
    highlights: [],
    links: [],
    lookingFor: ''
  });

  // Temporary input states for adding new items
  const [newSkill, setNewSkill] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newLink, setNewLink] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        avatarUrl: profile.avatarUrl || '',
        location: profile.location || '',
        bio: profile.bio || '',
        role: profile.role || '',
        focus: profile.focus || '',
        skills: profile.skills || [],
        highlights: profile.highlights || [],
        links: profile.links || [],
        lookingFor: profile.lookingFor || ''
      });
      setAvatarPreview(profile.avatarUrl || '');
      setCurrentStep(1);
    }
  }, [isOpen, profile]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setProfileData(prev => ({
        ...prev,
        avatarUrl: previewUrl
      }));
    }
  };

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

  const getProgress = () => {
    return ((currentStep - 1) / 2) * 100;
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.name.trim() !== '' && 
               profileData.bio.trim() !== '' && 
               profileData.role.trim() !== '' &&
               profileData.location.trim() !== '';
      case 2:
        return profileData.focus.trim() !== '';
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isCurrentStepValid() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate save operation
    setTimeout(() => {
      setLoading(false);
      onSave?.(profileData);
      onClose();
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
              <p className="text-[#999999]">Update your profile details</p>
            </div>

            {/* Avatar Section */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#333333]">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-[#333333] border-2 border-[#333333]">
                    {avatarPreview ? (
                      <ImageWithFallback
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-white">
                        {profileData.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#316afd] p-2 rounded-full cursor-pointer hover:bg-[#3a76ff] transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Profile Photo</h3>
                  <p className="text-sm text-[#999999]">
                    JPG, PNG or GIF format, maximum 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Location *</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">About Me *</label>
                <textarea
                  value={profileData.bio}
                  onChange={e => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                  placeholder="Tell us about yourself in a few sentences..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Professional Role *</label>
                <input
                  type="text"
                  value={profileData.role}
                  onChange={e => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="e.g., Frontend Developer, Product Designer"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Focus & Skills</h2>
              <p className="text-[#999999]">What's your current focus and expertise?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Current Focus *</label>
                <textarea
                  value={profileData.focus}
                  onChange={e => handleInputChange('focus', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                  placeholder="What are you currently focused on? What projects or technologies interest you most?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Looking For</label>
                <textarea
                  value={profileData.lookingFor}
                  onChange={e => handleInputChange('lookingFor', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                  placeholder="What kind of collaboration opportunities are you looking for?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-xl transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profileData.skills.map((skill, index) => (
                    <div key={`skill-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <span className="text-white">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-[#999999] hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Portfolio & Highlights</h2>
              <p className="text-[#999999]">Showcase your achievements and portfolio</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Career Highlights</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={e => setNewHighlight(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    className="flex-1 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                    placeholder="Add a career highlight"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-3 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-xl transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profileData.highlights.map((highlight, index) => (
                    <div key={`highlight-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <span className="text-white">{highlight}</span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="text-[#999999] hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Portfolio Links</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newLink}
                    onChange={e => setNewLink(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addLink())}
                    className="flex-1 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="px-4 py-3 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-xl transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {profileData.links.map((link, index) => (
                    <div key={`link-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <span className="text-[#316afd] text-sm truncate">{link}</span>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-[#999999] hover:text-red-500 transition-colors ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Create preview profile data
  const previewProfile = {
    id: profile?.id || 'preview',
    name: profileData.name || 'Your Name',
    avatarUrl: avatarPreview || profileData.avatarUrl || '',
    location: profileData.location || 'Your Location',
    bio: profileData.bio || 'Your bio will appear here...',
    role: profileData.role || 'Your Role',
    focus: profileData.focus || 'Your focus will appear here...',
    skills: profileData.skills,
    highlights: profileData.highlights,
    links: profileData.links,
    lookingFor: profileData.lookingFor || 'What you\'re looking for...',
    isOnline: true,
    isPro: profile?.isPro || false,
    aiInsight: 'AI will generate personalized insights based on your profile updates.'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Split Screen Layout */}
        <div className="h-full flex">
          {/* Left Panel - Form */}
          <div className="w-1/2 flex flex-col border-r border-[#333333]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333]">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#111111] rounded-lg transition-colors text-[#999999] hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-white">Edit Profile</h1>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Step {currentStep} of 3</span>
                <span className="text-sm text-[#999999]">{Math.round(getProgress())}%</span>
              </div>
              <div className="w-full bg-[#333333] rounded-full h-1">
                <div 
                  className="bg-[#316afd] h-1 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-md mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6">
              <div className="max-w-md mx-auto flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="flex-1 px-4 py-3 text-white hover:bg-[#111111] rounded-xl transition-colors font-medium text-center"
                  >
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#111111] hover:bg-[#316afd] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#111111] hover:bg-[#316afd] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-[#0a0a0a] flex flex-col">
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-[#333333]">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#999999]" />
                <h2 className="text-lg font-bold text-white">Live Preview</h2>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 flex items-center justify-center min-h-full">
                <div className="w-full max-w-sm">
                  <ProfileCard
                    profile={previewProfile}
                    onConnect={() => {}}
                    onMessage={() => {}}
                    onShare={() => {}}
                    onOpenProfile={() => {}}
                    connectionStatus="none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileEditModal;