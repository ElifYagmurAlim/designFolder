import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Camera, User, Save, Check } from 'lucide-react';
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
  lookingFor: string;
  email: string;
  avatarUrl: string;
  avatarPreviewUrl: string;
}

interface ProfileSetupPageProps {
  onBack?: () => void;
  onComplete?: (profileData: ProfileFormState) => void;
}

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Experience & Skills', description: 'Share your expertise' },
  { id: 3, title: 'Portfolio & Goals', description: 'Show your work & goals' }
];

export default function ProfileSetupPage({ onBack, onComplete }: ProfileSetupPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
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
    lookingFor: '',
    email: '',
    avatarUrl: '',
    avatarPreviewUrl: ''
  });
  
  // Array field management states
  const [newSkill, setNewSkill] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newLink, setNewLink] = useState('');

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

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Profile created:', profileData);
      onComplete?.(profileData);
    }, 2000);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return profileData.name.trim() && profileData.location.trim() && profileData.bio.trim();
      case 2:
        return profileData.role.trim() && profileData.focus.trim() && profileData.skills.length > 0;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const isCurrentStepValid = () => isStepValid(currentStep);

  const getProgress = () => (currentStep / 3) * 100;

  // Mock AI insight for preview
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
    lookingFor: profileData.lookingFor,
    aiInsight: mockInsight
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="w-32 h-32 rounded-xl bg-[#333333] border-2 border-white/20 flex items-center justify-center overflow-hidden">
                  {profileData.avatarPreviewUrl ? (
                    <ImageWithFallback 
                      src={profileData.avatarPreviewUrl} 
                      alt="Profile photo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#666666]" />
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
              <h2 className="text-2xl font-bold text-white mb-2">Let's get to know you</h2>
              <p className="text-[#999999]">Tell us about yourself to get started</p>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
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
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="Ex: Istanbul, Turkey"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">About Me *</label>
                <textarea
                  value={profileData.bio}
                  onChange={e => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                  placeholder="Introduce yourself in 2-3 sentences..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Your Experience & Skills</h2>
              <p className="text-[#999999]">Show off your expertise and what you're working on</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Professional Title/Role *</label>
                <input
                  value={profileData.role}
                  onChange={e => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="Ex: Frontend Developer, Product Designer"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Current Focus *</label>
                <input
                  value={profileData.focus}
                  onChange={e => handleInputChange('focus', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="Ex: Developing mobile apps with React Native"
                  required
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Skills *</label>
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
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Highlights (Optional)</label>
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
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {profileData.highlights.map((highlight, index) => (
                    <div key={`highlight-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <span className="text-white text-sm">{highlight}</span>
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
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Portfolio & Goals</h2>
              <p className="text-[#999999]">Share your work and what you're looking for</p>
            </div>

            <div className="space-y-4">
              {/* Portfolio Links */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Portfolio Links (Optional)</label>
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
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#316afd] hover:underline truncate text-sm">
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

              {/* Looking For */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">What are you looking for? (Optional)</label>
                <textarea
                  value={profileData.lookingFor}
                  onChange={e => handleInputChange('lookingFor', e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                  placeholder="Describe the type of collaborations, projects, or opportunities you're interested in..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Setup Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#999999] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-[#999999] text-sm">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">{STEPS[currentStep - 1].title}</span>
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
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#111111] hover:bg-[#316afd] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Complete Profile
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-[400px] bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-l border-[#333333] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Preview</h3>
            <p className="text-sm text-[#999999]">See how your profile will look</p>
          </div>
          <ProfileCard 
            profile={previewProfileCard}
            onConnect={() => {}}
            onMessage={() => {}}
            onShare={() => {}}
            onOpenProfile={() => {}}
            connectionStatus="none"
          />
        </div>
      </div>
    </div>
  );
}