import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Save, Plus, X } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectSetupPageProps {
  onBack: () => void;
  onComplete: (projectData: any) => void;
}

interface ProjectData {
  title: string;
  description: string;
  lookingFor: string;
  requirements: string[];
  links: string[];
}

const STEPS = [
  { title: 'Basic Information', description: 'Project details and requirements' },
  { title: 'Requirements & Links', description: 'Team requirements and project links' }
];

export default function ProjectSetupPage({ onBack, onComplete }: ProjectSetupPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    lookingFor: '',
    requirements: [],
    links: []
  });

  // New field states for adding items
  const [newRequirement, setNewRequirement] = useState('');
  const [newLink, setNewLink] = useState('');

  const getProgress = () => {
    return (currentStep / STEPS.length) * 100;
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return projectData.title.trim() !== '' && projectData.description.trim() !== '' && projectData.lookingFor.trim() !== '';
      case 2:
        return projectData.requirements.length > 0; // At least one requirement needed
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setProjectData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setProjectData(prev => ({
        ...prev,
        links: [...prev.links, newLink.trim()]
      }));
      setNewLink('');
    }
  };

  const removeLink = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onComplete(projectData);
    }, 2000);
  };

  // Create preview project data for ProjectCard
  const previewProject = {
    id: 'preview',
    title: projectData.title || 'Your Project Title',
    description: projectData.description || 'Your project description will appear here. Provide details about what you\'re building and what makes it interesting.',
    lookingFor: projectData.lookingFor || 'Describe what kind of collaborators you\'re looking for.',
    requirements: projectData.requirements.length > 0 ? projectData.requirements : ['Add your requirements to see them here'],
    links: projectData.links.length > 0 ? projectData.links : [],
    ownerId: 'preview-user',
    ownerName: 'Your Name',
    avatarUrl: '',
    role: 'Project Creator',
    location: 'Your Location',
    isOnline: true,
    isPro: false,
    savedByUser: false,
    appliedByUser: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
              <p className="text-[#999999]">Tell us about your project</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Project Title *</label>
                <input
                  type="text"
                  value={projectData.title}
                  onChange={e => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                  placeholder="Enter your project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Project Description *</label>
                <textarea
                  value={projectData.description}
                  onChange={e => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                  placeholder="Describe your project in detail. What are you building? What's the goal? What technologies will you use?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">What are you looking for? *</label>
                <textarea
                  value={projectData.lookingFor}
                  onChange={e => setProjectData(prev => ({ ...prev, lookingFor: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                  placeholder="Describe the roles, skills, or type of collaborators you need..."
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Requirements & Links</h2>
              <p className="text-[#999999]">Add requirements and project links</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Requirements *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={e => setNewRequirement(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    className="flex-1 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-white focus:outline-none focus:border-[#316afd] transition-colors"
                    placeholder="Add a requirement"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-3 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-xl transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {projectData.requirements.map((requirement, index) => (
                    <div key={`requirement-${index}`} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg">
                      <span className="text-white">{requirement}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-[#999999] hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Project Links (Optional)</label>
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
                  {projectData.links.map((link, index) => (
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
            {currentStep < 2 ? (
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
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Project
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
            <p className="text-sm text-[#999999]">See how your project will look</p>
          </div>
          <ProjectCard 
            projectPost={previewProject}
            onShowDetail={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            onMessage={() => {}}
            onSave={() => {}}
            onApply={() => {}}
            onRequireAuth={() => {}}
            isOwner={true}
          />
        </div>
      </div>
    </div>
  );
}