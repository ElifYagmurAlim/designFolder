import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import ProfileSetupPage from './components/ProfileSetupPage';
import ProjectSetupPage from './components/ProjectSetupPage';
import ProjectCard from './components/ProjectCard';
import ProfileCard from './components/ProfileCard';
import ProfileModal from './components/ProfileModal';
import ProfileSetupModal from './components/ProfileSetupModal';
import AuthModal from './components/AuthModal';
import ConfirmModal from './components/ConfirmModal';
import DetailModal from './components/DetailModal';
import SettingsModal from './components/SettingsModal';
import ProfileEditModal from './components/ProfileEditModal';
import FriendsModal from './components/FriendsModal';
import SavedModal from './components/SavedModal';
import Layout from './components/Layout';
import LayoutDemo from './components/LayoutDemo';
import HomePage from './components/HomePage';
import ChatDock from './components/ChatDock';
import MeetingModal from './components/MeetingModal';
import VideoCallModal from './components/VideoCallModal';
import AdminPanelModal from './components/AdminPanelModal';
import HelpModal from './components/HelpModal';
import NotificationModal from './components/NotificationModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import ProUpgradeModal from './components/ProUpgradeModal';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Layout, CreditCard, Square, Users, MessageSquare, Settings, AlertTriangle, User, UserPlus, FolderPlus, Bookmark } from 'lucide-react';

// Sample project data for demonstration
const sampleProject = {
  id: '1',
  title: 'E-commerce Mobile App',
  description: 'Looking to build a modern e-commerce mobile application with React Native. The app should include user authentication, product catalog, shopping cart, and payment integration.',
  lookingFor: 'React Native Developer, UI/UX Designer, Backend Developer',
  requirements: [
    'Experience with React Native and TypeScript',
    'Knowledge of REST APIs and state management',
    'Familiarity with payment gateway integration',
    'Experience with Firebase or similar backend services'
  ],
  links: [
    'https://github.com/example/project',
    'https://figma.com/design-mockup'
  ],
  ownerId: 'user123',
  ownerName: 'Sarah Johnson',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
  role: 'Product Manager',
  location: 'San Francisco, CA',
  isOnline: true,
  isPro: true,
  savedByUser: false,
  appliedByUser: false
};

// Sample profile data for demonstration
const sampleProfiles = [
  {
    id: 'prof1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating scalable web applications and mentoring junior developers.',
    focus: 'Building modern web applications with React and TypeScript. Currently exploring serverless architecture and microservices.',
    skills: [
      'React & TypeScript',
      'Node.js & Express',
      'AWS & Cloud Architecture',
      'GraphQL & REST APIs',
      'Team Leadership & Mentoring'
    ],
    highlights: [
      'Led development of 3 major web applications serving 100K+ users',
      'Mentored 15+ junior developers throughout career',
      'Speaker at React conferences and tech meetups',
      'Contributor to popular open-source projects'
    ],
    links: [
      'https://github.com/sarahjohnson',
      'https://sarahjohnson.dev',
      'https://linkedin.com/in/sarahjohnson'
    ],
    lookingFor: 'Excited to collaborate on innovative web projects, especially those involving React, TypeScript, and modern cloud architectures. Open to both technical leadership and hands-on development roles.',
    aiInsight: 'Sarah is highly experienced in modern web development stack and would be excellent for frontend architecture decisions. Her focus on mentoring suggests strong leadership potential.',
    location: 'San Francisco, CA',
    role: 'Senior Frontend Developer',
    isOnline: true,
    isPro: true
  },
  {
    id: 'prof2',
    name: 'Alex Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    bio: 'Data scientist and ML engineer specializing in natural language processing and computer vision. Love turning complex problems into elegant solutions.',
    focus: 'Machine learning applications in healthcare and fintech. Working on improving model interpretability and ethical AI practices.',
    skills: [
      'Python & TensorFlow',
      'Natural Language Processing',
      'Computer Vision',
      'Statistical Analysis',
      'MLOps & Model Deployment'
    ],
    highlights: [
      'Published 12 research papers in top ML conferences',
      'Built ML models processing 1M+ daily transactions',
      'PhD in Computer Science from Stanford',
      'Former Google AI research intern'
    ],
    links: [
      'https://github.com/alexchen',
      'https://alexchen.ml'
    ],
    lookingFor: 'Looking for challenging ML projects in healthcare, fintech, or ethical AI. Interested in both research and production-ready implementations.',
    aiInsight: 'Alex brings strong analytical skills and cutting-edge ML expertise. His focus on ethical AI shows thoughtful approach to technology implementation.',
    location: 'New York, NY',
    role: 'ML Engineer',
    isOnline: false,
    isPro: false
  },
  {
    id: 'prof3',
    name: 'Maria Garcia',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    bio: 'UI/UX designer with a passion for creating beautiful, accessible interfaces. I believe great design should be both functional and delightful.',
    focus: 'Designing inclusive user experiences for web and mobile applications. Currently exploring voice UI and emerging interaction patterns.',
    skills: [
      'User Experience Design',
      'Interface Design',
      'Design Systems',
      'User Research',
      'Accessibility (WCAG)'
    ],
    highlights: [
      'Designed apps used by 500K+ people worldwide',
      'WCAG 2.1 AA accessibility certification',
      'Winner of UX Design Awards 2023',
      '8 years experience in design leadership'
    ],
    links: [
      'https://mariagarcia.design',
      'https://dribbble.com/mariagarcia'
    ],
    lookingFor: 'Seeking opportunities to create impactful, accessible designs for products that make a difference. Especially interested in healthcare, education, and social impact projects.',
    location: 'Austin, TX',
    role: 'UI/UX Designer',
    isOnline: true,
    isPro: true
  }
];

const designSections = [
  { id: 'homepage', name: 'Home Page', icon: <Layout className="w-5 h-5" /> },
  { id: 'layout', name: 'Layout & Sidebar', icon: <Layout className="w-5 h-5" /> },
  { id: 'cards', name: 'Project Cards', icon: <Square className="w-5 h-5" /> },
  { id: 'profiles', name: 'Profile Cards', icon: <User className="w-5 h-5" /> },
  { id: 'profile-setup', name: 'Profile Setup', icon: <UserPlus className="w-5 h-5" /> },
  { id: 'project-setup', name: 'Project Setup', icon: <FolderPlus className="w-5 h-5" /> },
  { id: 'friends-saved', name: 'Friends & Saved', icon: <Bookmark className="w-5 h-5" /> },
  { id: 'chat', name: 'Chat System', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'meetings', name: 'Meetings & Video Calls', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'admin-modals', name: 'Admin & Utility Modals', icon: <Settings className="w-5 h-5" /> },
  { id: 'auth', name: 'Auth Modals', icon: <Users className="w-5 h-5" /> },
  { id: 'confirm', name: 'Confirm Modals', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'detail', name: 'Detail Modals', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'settings', name: 'Settings Modals', icon: <Settings className="w-5 h-5" /> },
];

export default function App() {
  const [showTestPage, setShowTestPage] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showProjectSetup, setShowProjectSetup] = useState(false);
  const [showLayoutDemo, setShowLayoutDemo] = useState(false);
  const [showHomePage, setShowHomePage] = useState(false);
  const [homePageLoggedIn, setHomePageLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('homepage');
  const [expandedStates, setExpandedStates] = useState<{[key: string]: boolean}>({
    'normal': true,
    'owner': true,
    'applied-saved': true,
    'edge-cases': false,
    'grid-layouts': false
  });

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileSetupModalOpen, setIsProfileSetupModalOpen] = useState(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [isAdminPanelModalOpen, setIsAdminPanelModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isProUpgradeModalOpen, setIsProUpgradeModalOpen] = useState(false);

  const toggleExpanded = (key: string) => {
    setExpandedStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleShowDetail = (project: any) => {
    console.log('Show detail for:', project.title);
  };

  const handleEdit = (project: any) => {
    console.log('Edit project:', project.title);
  };

  const handleDelete = (project: any) => {
    console.log('Delete project:', project.title);
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
  };

  const handleSave = (project: any) => {
    console.log('Save project:', project.title);
  };

  const handleApply = (project: any) => {
    console.log('Apply to project:', project.title);
  };

  // Profile card handlers
  const handleConnect = (profile: any) => {
    console.log('Connect with:', profile.name);
  };

  const handleMessageProfile = (profile: any) => {
    console.log('Message profile:', profile.name);
  };

  const handleShare = (profile: any) => {
    console.log('Share profile:', profile.name);
  };

  const handleOpenProfile = (profile: any) => {
    console.log('Open profile:', profile.name);
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedProfile(null);
  };

  const handleEditProfile = (profile: any) => {
    console.log('Edit profile:', profile.name);
    setSelectedProfile(profile);
    setIsProfileEditModalOpen(true);
  };

  const handleCloseProfileEditModal = () => {
    setIsProfileEditModalOpen(false);
    setSelectedProfile(null);
  };

  const handleSaveProfile = (profileData: any) => {
    console.log('Profile saved:', profileData);
    // Update the selected profile with new data
    if (selectedProfile) {
      const updatedProfile = { ...selectedProfile, ...profileData };
      setSelectedProfile(updatedProfile);
    }
  };

  const handleProfileSetupComplete = (profileData: any) => {
    console.log('Profile setup completed:', profileData);
    setShowProfileSetup(false);
  };

  const handleProjectSetupComplete = (projectData: any) => {
    console.log('Project setup completed:', projectData);
    setShowProjectSetup(false);
  };

  // Friends Modal handlers
  const handleMessageFriend = (friendId: string) => {
    console.log('Message friend:', friendId);
  };

  const handleRemoveFriend = (friendId: string) => {
    console.log('Remove friend:', friendId);
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accept request:', requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    console.log('Decline request:', requestId);
  };

  // Saved Modal handlers
  const handleViewProject = (projectId: string) => {
    console.log('View project:', projectId);
  };

  const handleRemoveProject = (projectId: string) => {
    console.log('Remove project:', projectId);
  };

  // Layout handlers
  const handleLayoutAuthModal = () => {
    console.log('Open auth modal from layout');
    setIsAuthModalOpen(true);
  };

  const handleLayoutProfileSetup = () => {
    console.log('Open profile setup from layout');
    setIsProfileSetupModalOpen(true);
  };

  const handleLayoutNotifications = () => {
    console.log('Open notifications from layout');
  };

  const handleLayoutSignOut = () => {
    console.log('Sign out from layout');
  };

  const handleSidebarNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handleSidebarModal = (modalType: string) => {
    console.log('Open modal:', modalType);
    switch (modalType) {
      case 'friends':
        setIsFriendsModalOpen(true);
        break;
      case 'saved':
        setIsSavedModalOpen(true);
        break;
      case 'profile-edit':
        setIsProfileEditModalOpen(true);
        break;
      case 'settings':
        setIsSettingsModalOpen(true);
        break;
      case 'pro-upgrade':
        console.log('Open Pro upgrade modal');
        break;
      case 'meetings':
        console.log('Open meetings modal');
        break;
      case 'help':
        console.log('Open help modal');
        break;
    }
  };

  // Mock user data for layout demo
  const mockUser = {
    uid: 'user123',
    displayName: 'John Doe',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    email: 'john.doe@example.com'
  };

  const renderProjectCards = () => (
    <div className="space-y-8">
      {/* Normal Cards Section */}
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded('normal')}
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Normal User Cards
            {expandedStates['normal'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </h2>
        </div>
        <AnimatePresence>
          {expandedStates['normal'] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ProjectCard
                projectPost={sampleProject}
                onShowDetail={handleShowDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMessage={handleMessage}
                onSave={handleSave}
                onApply={handleApply}
                isOwner={false}
              />
              <ProjectCard
                projectPost={{
                  ...sampleProject,
                  id: '2',
                  title: 'AI-Powered Analytics Dashboard',
                  description: 'Building an analytics dashboard that uses machine learning to provide insights.',
                  lookingFor: 'Frontend Developer, Data Visualization Expert',
                  ownerName: 'Alex Chen',
                  role: 'Data Scientist',
                  location: 'New York, NY',
                  isOnline: false,
                  isPro: false
                }}
                onShowDetail={handleShowDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMessage={handleMessage}
                onSave={handleSave}
                onApply={handleApply}
                isOwner={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Owner Cards Section */}
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded('owner')}
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Owner Cards
            {expandedStates['owner'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </h2>
        </div>
        <AnimatePresence>
          {expandedStates['owner'] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ProjectCard
                projectPost={sampleProject}
                onShowDetail={handleShowDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMessage={handleMessage}
                onSave={handleSave}
                onApply={handleApply}
                isOwner={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Applied/Saved Cards Section */}
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded('applied-saved')}
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Applied & Saved Cards
            {expandedStates['applied-saved'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </h2>
        </div>
        <AnimatePresence>
          {expandedStates['applied-saved'] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ProjectCard
                projectPost={{
                  ...sampleProject,
                  id: '3',
                  title: 'Social Media Platform',
                  description: 'Creating a new social media platform focused on creative professionals.',
                  appliedByUser: true,
                  savedByUser: false,
                  ownerName: 'Maria Garcia',
                  role: 'Startup Founder',
                  location: 'Austin, TX'
                }}
                onShowDetail={handleShowDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMessage={handleMessage}
                onSave={handleSave}
                onApply={handleApply}
                isOwner={false}
              />
              <ProjectCard
                projectPost={{
                  ...sampleProject,
                  id: '4',
                  title: 'Blockchain Voting System',
                  description: 'Developing a secure blockchain-based voting platform for elections.',
                  appliedByUser: false,
                  savedByUser: true,
                  ownerName: 'David Kim',
                  role: 'Blockchain Developer',
                  location: 'Seattle, WA'
                }}
                onShowDetail={handleShowDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMessage={handleMessage}
                onSave={handleSave}
                onApply={handleApply}
                isOwner={false}
              />
              <ProjectCard
                projectPost={{
                  ...sampleProject,
                  id: '5',
                  title: 'Healthcare Management App',
                  description: 'Building a comprehensive healthcare management system for hospitals.',
                  appliedByUser: true,
                  savedByUser: true,
                  ownerName: 'Dr. Emma Wilson',
                  role: 'Healthcare CTO',
                  location: 'Boston, MA'
                }}
                onShowDetail={handleShowDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMessage={handleMessage}
                onSave={handleSave}
                onApply={handleApply}
                isOwner={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderProfileCards = () => (
    <div className="space-y-8">
      {/* Normal Profile Cards Section */}
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded('normal')}
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Profile Cards - Different States
            {expandedStates['normal'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </h2>
        </div>
        <AnimatePresence>
          {expandedStates['normal'] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProfileCard
                  profile={sampleProfiles[0]}
                  onConnect={handleConnect}
                  onMessage={handleMessageProfile}
                  onShare={handleShare}
                  onOpenProfile={handleOpenProfile}
                  connectionStatus="none"
                />
                <ProfileCard
                  profile={sampleProfiles[1]}
                  onConnect={handleConnect}
                  onMessage={handleMessageProfile}
                  onShare={handleShare}
                  onOpenProfile={handleOpenProfile}
                  connectionStatus="pending"
                />
                <ProfileCard
                  profile={sampleProfiles[2]}
                  onConnect={handleConnect}
                  onMessage={handleMessageProfile}
                  onShare={handleShare}
                  onOpenProfile={handleOpenProfile}
                  connectionStatus="accepted"
                />
              </div>
              
              {/* Profile Modal Test Buttons */}
              <div className="pt-4 border-t border-[#333333] space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Profile View Modal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleOpenProfile(sampleProfiles[0])}
                      className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
                    >
                      View Sarah's Profile
                    </button>
                    <button
                      onClick={() => handleOpenProfile(sampleProfiles[1])}
                      className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
                    >
                      View Alex's Profile
                    </button>
                    <button
                      onClick={() => handleOpenProfile(sampleProfiles[2])}
                      className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
                    >
                      View Maria's Profile
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Profile Edit Modal ✨</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleEditProfile(sampleProfiles[0])}
                      className="bg-[#316afd]/10 hover:bg-[#316afd] border border-[#316afd]/30 hover:border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
                    >
                      Edit Sarah's Profile
                    </button>
                    <button
                      onClick={() => handleEditProfile(sampleProfiles[1])}
                      className="bg-[#316afd]/10 hover:bg-[#316afd] border border-[#316afd]/30 hover:border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
                    >
                      Edit Alex's Profile
                    </button>
                    <button
                      onClick={() => handleEditProfile(sampleProfiles[2])}
                      className="bg-[#316afd]/10 hover:bg-[#316afd] border border-[#316afd]/30 hover:border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
                    >
                      Edit Maria's Profile
                    </button>
                  </div>
                  <div className="mt-3 p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
                    <ul className="text-[#cccccc] space-y-1 text-sm">
                      <li>• Full-screen split-screen design</li>
                      <li>• 3-step guided editing process</li>
                      <li>• Live profile card preview</li>
                      <li>• Progress bar and step validation</li>
                      <li>• Avatar upload with preview</li>
                      <li>• Dynamic skills, highlights, and links management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={selectedProfile}
        onClose={handleCloseProfileModal}
        onConnect={handleConnect}
        onMessage={handleMessageProfile}
        onShare={handleShare}
        connectionStatus={selectedProfile?.id === 'prof1' ? 'none' : selectedProfile?.id === 'prof2' ? 'pending' : 'accepted'}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileEditModalOpen}
        profile={selectedProfile}
        onClose={handleCloseProfileEditModal}
        onSave={handleSaveProfile}
      />
    </div>
  );

  const renderProfileSetupModal = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setIsProfileSetupModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Profile Setup Modal
        </button>
        <button
          onClick={() => setShowProfileSetup(true)}
          className="bg-[#316afd] hover:bg-[#3a76ff] border border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Profile Setup Page
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-[#111111] rounded-lg border border-[#333333]">
          <h3 className="text-lg font-bold text-white mb-2">Profile Setup Modal</h3>
          <ul className="text-[#cccccc] space-y-1 text-sm">
            <li>• Classic modal overlay</li>
            <li>• Single scrollable form</li>
            <li>• Profile card preview at bottom</li>
            <li>• Basic form validation</li>
          </ul>
        </div>
        <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
          <h3 className="text-lg font-bold text-white mb-2">Profile Setup Page ✨</h3>
          <ul className="text-[#cccccc] space-y-1 text-sm">
            <li>• Full-page split-screen design</li>
            <li>• 3-step guided setup process</li>
            <li>• Live profile card preview</li>
            <li>• Progress bar and step validation</li>
            <li>• Smooth animations between steps</li>
          </ul>
        </div>
      </div>
      <ProfileSetupModal 
        isOpen={isProfileSetupModalOpen} 
        onClose={() => setIsProfileSetupModalOpen(false)}
        onComplete={handleProfileSetupComplete}
      />
    </div>
  );

  const renderProjectSetupPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setShowProjectSetup(true)}
          className="bg-[#316afd] hover:bg-[#3a76ff] border border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Project Setup Page
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
          <h3 className="text-lg font-bold text-white mb-2">Project Setup Page ✨</h3>
          <ul className="text-[#cccccc] space-y-1 text-sm">
            <li>• Full-page split-screen design</li>
            <li>• 2-step streamlined project creation process</li>
            <li>• Live project card preview</li>
            <li>• Progress bar and step validation</li>
            <li>• Dynamic requirements and links management</li>
            <li>• Smooth animations between steps</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAdminAndUtilityModals = () => (
    <div className="space-y-6">
      <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
        <h3 className="text-lg font-bold text-white mb-2">🔧 Admin & Utility Modals</h3>
        <ul className="text-[#cccccc] space-y-1 text-sm">
          <li>• <strong>Admin Panel</strong> - User management, analytics, and system administration</li>
          <li>• <strong>Help & Support</strong> - FAQ, guides, and contact information</li>
          <li>• <strong>Notifications</strong> - Real-time notification management</li>
          <li>• <strong>Privacy Policy</strong> - GDPR compliant privacy information</li>
          <li>• <strong>Pro Upgrade</strong> - Subscription and payment flow</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setIsAdminPanelModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Admin Panel
        </button>
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Help Modal
        </button>
        <button
          onClick={() => setIsNotificationModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Notifications
        </button>
        <button
          onClick={() => setIsPrivacyPolicyModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Privacy Policy
        </button>
        <button
          onClick={() => setIsProUpgradeModalOpen(true)}
          className="bg-[#316afd] hover:bg-[#3a76ff] border border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Pro Upgrade
        </button>
      </div>
      
      <div className="text-center py-4">
        <div className="text-[#888888] text-sm mb-2">
          Test all administrative and utility modals!
        </div>
        <div className="text-xs text-[#666666]">
          • Admin panel with user management and analytics<br/>
          • Help system with FAQ and guides<br/>
          • Notification center with real-time updates<br/>
          • Privacy policy with GDPR compliance<br/>
          • Pro upgrade flow with subscription options
        </div>
      </div>
      
      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelModalOpen}
        onClose={() => setIsAdminPanelModalOpen(false)}
      />
      
      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
      
      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={() => setIsPrivacyPolicyModalOpen(false)}
        onAccept={() => console.log('Privacy policy accepted')}
        onDecline={() => console.log('Privacy policy declined')}
      />
      
      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isOpen={isProUpgradeModalOpen}
        onClose={() => setIsProUpgradeModalOpen(false)}
      />
    </div>
  );

  const renderAuthModals = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Login Modal
        </button>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );

  const renderConfirmModals = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="bg-[#111111] hover:bg-red-600 border border-red-700 text-red-400 px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Delete Confirmation
        </button>
      </div>
      <ConfirmModal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          console.log('Confirmed!');
          setIsConfirmModalOpen(false);
        }}
      />
    </div>
  );

  const renderDetailModals = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setIsDetailModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Project Details
        </button>
      </div>
      <DetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        project={sampleProject}
      />
    </div>
  );

  const renderSettingsModals = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Settings Modal
        </button>
      </div>
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );

  const renderLayoutAndSidebar = () => (
    <div className="space-y-8">
      {/* Layout Demo Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Layout with Header & Sidebar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setShowLayoutDemo(true)}
            className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
          >
            View Full Layout Demo
          </button>
        </div>
        <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
          <h3 className="text-lg font-bold text-white mb-2">Layout & Sidebar Features</h3>
          <ul className="text-[#cccccc] space-y-1 text-sm">
            <li>• Responsive header with logo, navigation, and user actions</li>
            <li>• <strong>Integrated search bar</strong> with filter dropdown</li>
            <li>• Project count badge and notification indicators</li>
            <li>• Collapsible sidebar with organized navigation</li>
            <li>• Social section: Profiles, Projects, Friends, Saved, Meetings</li>
            <li>• Map & Events navigation</li>
            <li>• Settings: Edit Profile, Settings</li>
            <li>• Animated PRO upgrade CTA button</li>
            <li>• <strong>Full interactive demo</strong> with search & filtering</li>
            <li>• Smooth animations and backdrop blur effects</li>
          </ul>
        </div>
      </div>

      {/* Friends Modal Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Friends Modal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setIsFriendsModalOpen(true)}
            className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
          >
            Open Friends Modal
          </button>
        </div>
        <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
          <h3 className="text-lg font-bold text-white mb-2">Friends Modal Features</h3>
          <ul className="text-[#cccccc] space-y-1 text-sm">
            <li>• Friends list with online status indicators</li>
            <li>• Connection requests management</li>
            <li>• Accept/decline request actions</li>
            <li>• Message and remove friend actions</li>
            <li>• Profile click integration</li>
            <li>• Loading states and mock data</li>
          </ul>
        </div>
      </div>

      {/* Saved Modal Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Saved Projects Modal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setIsSavedModalOpen(true)}
            className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
          >
            Open Saved Projects Modal
          </button>
        </div>
        <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
          <h3 className="text-lg font-bold text-white mb-2">Saved Projects Modal Features</h3>
          <ul className="text-[#cccccc] space-y-1 text-sm">
            <li>• Saved projects with rich project info</li>
            <li>• Project owner details and status</li>
            <li>• View project and remove actions</li>
            <li>• Date formatting (Today, Yesterday, X days ago)</li>
            <li>• Profile click integration</li>
            <li>• Loading and empty states</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <FriendsModal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        onMessageFriend={handleMessageFriend}
        onRemoveFriend={handleRemoveFriend}
        onAcceptRequest={handleAcceptRequest}
        onDeclineRequest={handleDeclineRequest}
        onOpenProfile={handleOpenProfile}
      />

      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onViewProject={handleViewProject}
        onRemoveProject={handleRemoveProject}
        onOpenProfile={handleOpenProfile}
      />
    </div>
  );

  const renderHomePage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => {
            setHomePageLoggedIn(false);
            setShowHomePage(true);
          }}
          className="bg-[#316afd] hover:bg-[#3a76ff] border border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Home Page - Not Logged In
        </button>
        <button
          onClick={() => {
            setHomePageLoggedIn(true);
            setShowHomePage(true);
          }}
          className="bg-[#28a745] hover:bg-[#218838] border border-[#28a745] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Home Page - Logged In
        </button>
      </div>
      <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
        <h3 className="text-lg font-bold text-white mb-2">🏠 Complete Home Page Experience</h3>
        <ul className="text-[#cccccc] space-y-1 text-sm">
          <li>• <strong>Two user states:</strong> Not logged in (simple) and Logged in (with sidebar + notifications)</li>
          <li>• <strong>Full layout integration</strong> with header, sidebar, and search</li>
          <li>• <strong>Advanced search</strong> with real-time filtering and history</li>
          <li>• <strong>View mode switching</strong> between Profiles and Projects</li>
          <li>• <strong>Content discovery</strong> with Pro user prioritization</li>
          <li>• <strong>Responsive design</strong> optimized for all screen sizes</li>
          <li>• <strong>Interactive elements</strong> with smooth animations</li>
          <li>• <strong>Search history</strong> with quick access to recent searches</li>
          <li>• <strong>Filter system</strong> by category, location, and skills</li>
          <li>• <strong>Loading states</strong> and empty result handling</li>
          <li>• <strong>Modern UI</strong> with blur effects and backdrop styling</li>
        </ul>
      </div>
    </div>
  );

  const renderChatSystem = () => (
    <div className="space-y-6">
      <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
        <h3 className="text-lg font-bold text-white mb-2">💬 Chat System Features</h3>
        <ul className="text-[#cccccc] space-y-1 text-sm">
          <li>• <strong>Real-time messaging</strong> with typing indicators</li>
          <li>• <strong>Conversation management</strong> with minimizable chat panels</li>
          <li>• <strong>Meeting scheduling</strong> with calendar integration</li>
          <li>• <strong>File and image attachments</strong> (UI ready)</li>
          <li>• <strong>Online status indicators</strong> and user presence</li>
          <li>• <strong>Message status tracking</strong> (sending, sent, error)</li>
          <li>• <strong>Failed message retry</strong> functionality</li>
          <li>• <strong>Responsive design</strong> with mobile-optimized layout</li>
          <li>• <strong>Profile integration</strong> with user details</li>
          <li>• <strong>Unread message counters</strong> and notifications</li>
        </ul>
      </div>
      
      <div className="text-center py-8">
        <div className="text-[#888888] text-sm mb-4">
          Check the bottom-right corner of the screen for the ChatDock component!
        </div>
        <div className="text-xs text-[#666666]">
          • Click "Messages" to open the drawer<br/>
          • Click on any conversation to start chatting<br/>
          • Try the "Plan Call" feature in chat panels<br/>
          • Messages can be minimized and reopened
        </div>
      </div>
      
      <ChatDock 
        currentUserId="user123"
      />
    </div>
  );

  const renderMeetingsAndVideoCalls = () => (
    <div className="space-y-6">
      <div className="p-4 bg-[#316afd]/10 rounded-lg border border-[#316afd]/30">
        <h3 className="text-lg font-bold text-white mb-2">📅 Meetings & Video Calls Features</h3>
        <ul className="text-[#cccccc] space-y-1 text-sm">
          <li>• <strong>Meeting scheduling</strong> with timezone support</li>
          <li>• <strong>Calendar integration</strong> with Google Calendar export</li>
          <li>• <strong>Meeting requests</strong> with approval workflow</li>
          <li>• <strong>Video calls</strong> with camera, microphone, and screen sharing</li>
          <li>• <strong>Connection status</strong> and network quality indicators</li>
          <li>• <strong>Fullscreen mode</strong> with auto-hide controls</li>
          <li>• <strong>Call duration tracking</strong> with formatted timer</li>
          <li>• <strong>Participant management</strong> and user presence</li>
          <li>• <strong>Error handling</strong> with retry functionality</li>
          <li>• <strong>Responsive design</strong> optimized for all screen sizes</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setIsMeetingModalOpen(true)}
          className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Open Meeting Modal
        </button>
        <button
          onClick={() => setIsVideoCallModalOpen(true)}
          className="bg-[#316afd] hover:bg-[#3a76ff] border border-[#316afd] text-white px-6 py-4 rounded-xl transition-colors font-bold"
        >
          Start Video Call
        </button>
      </div>
      
      <div className="text-center py-4">
        <div className="text-[#888888] text-sm mb-2">
          Test the complete meeting and video call experience!
        </div>
        <div className="text-xs text-[#666666]">
          • Schedule meetings with timezone support<br/>
          • Join video calls with full media controls<br/>
          • Experience fullscreen mode and screen sharing<br/>
          • See connection status and call duration tracking
        </div>
      </div>
      
      {/* Meeting Modal */}
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        currentUserId="user123"
        participant={{
          id: 'user1',
          name: 'Sarah Johnson',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
        }}
        onScheduled={(meeting) => {
          console.log('Meeting scheduled:', meeting);
        }}
        onJoinCall={(roomId) => {
          setIsVideoCallModalOpen(true);
          setIsMeetingModalOpen(false);
        }}
      />
      
      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallModalOpen}
        onClose={() => setIsVideoCallModalOpen(false)}
        roomId="test-room-123"
        currentUserId="user123"
        participantName="Sarah Johnson"
        participantAvatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
      />
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'homepage':
        return renderHomePage();
      case 'layout':
        return renderLayoutAndSidebar();
      case 'cards':
        return renderProjectCards();
      case 'profiles':
        return renderProfileCards();
      case 'profile-setup':
        return renderProfileSetupModal();
      case 'project-setup':
        return renderProjectSetupPage();
      case 'friends-saved':
        return renderLayoutAndSidebar();
      case 'chat':
        return renderChatSystem();
      case 'meetings':
        return renderMeetingsAndVideoCalls();
      case 'admin-modals':
        return renderAdminAndUtilityModals();
      case 'auth':
        return renderAuthModals();
      case 'confirm':
        return renderConfirmModals();
      case 'detail':
        return renderDetailModals();
      case 'settings':
        return renderSettingsModals();
      default:
        return renderHomePage();
    }
  };

  // If showing profile setup, show ProfileSetupPage
  if (showProfileSetup) {
    return (
      <div className="min-h-screen dark">
        <ProfileSetupPage 
          onBack={() => setShowProfileSetup(false)} 
          onComplete={handleProfileSetupComplete}
        />
      </div>
    );
  }

  // If showing project setup, show ProjectSetupPage
  if (showProjectSetup) {
    return (
      <div className="min-h-screen dark">
        <ProjectSetupPage 
          onBack={() => setShowProjectSetup(false)} 
          onComplete={handleProjectSetupComplete}
        />
      </div>
    );
  }

  // If showing layout demo, show LayoutDemo
  if (showLayoutDemo) {
    return (
      <div className="min-h-screen dark">
        <LayoutDemo onBack={() => setShowLayoutDemo(false)} />
      </div>
    );
  }

  // If showing home page, show HomePage
  if (showHomePage) {
    return (
      <div className="min-h-screen dark">
        <HomePage 
          user={homePageLoggedIn ? mockUser : null}
          onBack={() => setShowHomePage(false)} 
        />
      </div>
    );
  }

  // If not showing test page, show AuthPage
  if (!showTestPage) {
    return (
      <div className="min-h-screen dark">
        <AuthPage onBack={() => setShowTestPage(true)} />
        {/* Test Page Toggle Button */}
        <button
          onClick={() => setShowTestPage(true)}
          className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          View Test Components
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold">
              Component Design System
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTestPage(false)}
                className="bg-[#316afd] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Back to Auth Page
              </button>
              <div className="text-sm text-gray-400">
                Active: <span className="font-medium text-white">
                  {designSections.find(s => s.id === activeSection)?.name || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-[#111111] rounded-xl border border-[#333333]">
          {designSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-[#316afd] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-[#222222]'
              }`}
            >
              {section.icon}
              <span className="hidden sm:inline">{section.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveSection()}
        </motion.div>
      </div>
    </div>
  );
}