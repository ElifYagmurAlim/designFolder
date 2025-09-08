'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { User, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SearchBar from './SearchBar';
import ProfileCard from './ProfileCard';
import ProjectCard from './ProjectCard';
import Layout from './Layout';

interface FilterOptions {
  category?: string;
  location?: string;
  skills?: string[];
}

interface SearchResult {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
  focus?: string;
  skills?: string[];
  highlights?: string[];
  links?: string[];
  lookingFor?: string;
  username?: string;
  aiInsight?: string;
  isOnline?: boolean;
  isPro?: boolean;
  isConnectedWithViewer?: boolean;
  hasMessagedViewer?: boolean;
}

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

interface ProfileCardData {
  id: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  focus: string;
  skills: string[];
  highlights: string[];
  links: string[];
  lookingFor: string;
  aiInsight?: string;
  location: string;
  role: string;
  isOnline: boolean;
  isPro: boolean;
}

interface HomePageProps {
  user?: {
    uid: string;
    displayName?: string;
    photoURL?: string;
    email?: string;
  } | null;
  onBack?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user = null, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [projectSearchResults, setProjectSearchResults] = useState<ProjectPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'profiles' | 'projects'>('profiles');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [profiles, setProfiles] = useState<ProfileCardData[]>([]);
  const [projects, setProjects] = useState<ProjectPost[]>([]);

  // Sample data
  const sampleProfiles: ProfileCardData[] = [
    {
      id: 'prof1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.',
      focus: 'Building modern web applications with React and TypeScript.',
      skills: ['React & TypeScript', 'Node.js & Express', 'AWS & Cloud Architecture'],
      highlights: ['Led development of 3 major web applications', 'Mentored 15+ junior developers'],
      links: ['https://github.com/sarahjohnson', 'https://sarahjohnson.dev'],
      lookingFor: 'Excited to collaborate on innovative web projects.',
      aiInsight: 'Sarah is highly experienced in modern web development stack.',
      location: 'San Francisco, CA',
      role: 'Senior Frontend Developer',
      isOnline: true,
      isPro: true
    },
    {
      id: 'prof2',
      name: 'Alex Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      bio: 'Data scientist and ML engineer specializing in natural language processing.',
      focus: 'Machine learning applications in healthcare and fintech.',
      skills: ['Python & TensorFlow', 'Natural Language Processing', 'Computer Vision'],
      highlights: ['Published 12 research papers', 'Built ML models processing 1M+ daily transactions'],
      links: ['https://github.com/alexchen', 'https://alexchen.ml'],
      lookingFor: 'Looking for challenging ML projects in healthcare or fintech.',
      location: 'New York, NY',
      role: 'ML Engineer',
      isOnline: false,
      isPro: false
    },
    {
      id: 'prof3',
      name: 'Maria Garcia',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      bio: 'UI/UX designer with a passion for creating beautiful, accessible interfaces.',
      focus: 'Designing inclusive user experiences for web and mobile applications.',
      skills: ['User Experience Design', 'Interface Design', 'Design Systems'],
      highlights: ['Designed apps used by 500K+ people', 'WCAG 2.1 AA accessibility certification'],
      links: ['https://mariagarcia.design', 'https://dribbble.com/mariagarcia'],
      lookingFor: 'Seeking opportunities to create impactful, accessible designs.',
      location: 'Austin, TX',
      role: 'UI/UX Designer',
      isOnline: true,
      isPro: true
    },
    {
      id: 'prof4',
      name: 'David Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      bio: 'DevOps engineer and cloud architect with expertise in AWS and Kubernetes.',
      focus: 'Building scalable infrastructure and CI/CD pipelines.',
      skills: ['AWS & Azure', 'Kubernetes & Docker', 'Infrastructure as Code'],
      highlights: ['Reduced deployment time by 80%', 'Led cloud migration for 5 companies'],
      links: ['https://github.com/davidkim', 'https://davidkim.tech'],
      lookingFor: 'Interested in cloud-native projects and DevOps automation.',
      location: 'Seattle, WA',
      role: 'DevOps Engineer',
      isOnline: true,
      isPro: false
    },
    {
      id: 'prof5',
      name: 'Emily Rodriguez',
      avatarUrl: 'https://images.unsplash.com/photo-1488508872907-592763824245?w=64&h=64&fit=crop&crop=face',
      bio: 'Product manager with a focus on user-centered design and agile methodologies.',
      focus: 'Creating products that solve real user problems.',
      skills: ['Product Strategy', 'User Research', 'Agile Development'],
      highlights: ['Launched 3 successful products', 'Increased user retention by 40%'],
      links: ['https://emilyrodriguez.pm', 'https://linkedin.com/in/emilyrodriguez'],
      lookingFor: 'Looking for innovative product opportunities in tech.',
      location: 'Los Angeles, CA',
      role: 'Product Manager',
      isOnline: false,
      isPro: true
    },
    {
      id: 'prof6',
      name: 'James Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face',
      bio: 'Blockchain developer specializing in smart contracts and DeFi applications.',
      focus: 'Building decentralized applications on Ethereum and Solana.',
      skills: ['Solidity & Smart Contracts', 'Web3 Development', 'DeFi Protocols'],
      highlights: ['Built DeFi protocol with $10M+ TVL', 'Audited 20+ smart contracts'],
      links: ['https://github.com/jameswilson', 'https://jameswilson.web3'],
      lookingFor: 'Exploring cutting-edge blockchain and Web3 projects.',
      location: 'Miami, FL',
      role: 'Blockchain Developer',
      isOnline: true,
      isPro: false
    }
  ];

  const sampleProjects: ProjectPost[] = [
    {
      id: '1',
      title: 'E-commerce Mobile App',
      description: 'Looking to build a modern e-commerce mobile application with React Native.',
      lookingFor: 'React Native Developer, UI/UX Designer, Backend Developer',
      requirements: ['Experience with React Native and TypeScript', 'Knowledge of REST APIs'],
      links: ['https://github.com/example/project'],
      ownerId: 'user123',
      ownerName: 'Sarah Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      role: 'Product Manager',
      location: 'San Francisco, CA',
      isOnline: true,
      isPro: true,
      savedByUser: false,
      appliedByUser: false
    },
    {
      id: '2',
      title: 'AI-Powered Analytics Dashboard',
      description: 'Building an analytics dashboard that uses machine learning to provide insights.',
      lookingFor: 'Frontend Developer, Data Visualization Expert',
      requirements: ['React expertise', 'D3.js or similar visualization library experience'],
      links: ['https://github.com/example/analytics'],
      ownerId: 'user456',
      ownerName: 'Alex Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      role: 'Data Scientist',
      location: 'New York, NY',
      isOnline: false,
      isPro: false,
      savedByUser: true,
      appliedByUser: false
    },
    {
      id: '3',
      title: 'Social Media Platform',
      description: 'Creating a new social media platform focused on creative professionals.',
      lookingFor: 'Full-stack Developer, UI/UX Designer',
      requirements: ['MERN stack experience', 'Social media platform knowledge'],
      links: ['https://github.com/example/social'],
      ownerId: 'user789',
      ownerName: 'Maria Garcia',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      role: 'Startup Founder',
      location: 'Austin, TX',
      isOnline: true,
      isPro: true,
      savedByUser: false,
      appliedByUser: true
    },
    {
      id: '4',
      title: 'DevOps Automation Platform',
      description: 'Building a comprehensive DevOps platform for CI/CD automation.',
      lookingFor: 'DevOps Engineer, Backend Developer',
      requirements: ['Kubernetes experience', 'AWS/Azure knowledge'],
      links: ['https://github.com/example/devops'],
      ownerId: 'user101',
      ownerName: 'David Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      role: 'DevOps Engineer',
      location: 'Seattle, WA',
      isOnline: true,
      isPro: false,
      savedByUser: true,
      appliedByUser: false
    }
  ];

  // Initialize data
  useEffect(() => {
    setProfiles(sampleProfiles);
    setProjects(sampleProjects);
    
    // Load search history
    const savedHistory = localStorage.getItem('coparty_search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchQuery(query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      if (viewMode === 'profiles') {
        await handleProfileSearch(query);
      } else {
        await handleProjectSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    
    // Update search history
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('coparty_search_history', JSON.stringify(newHistory));
    setIsSearching(false);
  };

  const handleProfileSearch = async (query: string) => {
    const filtered = profiles.filter(profile => 
      profile.name.toLowerCase().includes(query.toLowerCase()) ||
      profile.bio.toLowerCase().includes(query.toLowerCase()) ||
      profile.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
      profile.location.toLowerCase().includes(query.toLowerCase()) ||
      profile.role.toLowerCase().includes(query.toLowerCase())
    );
    
    // Apply filters
    let results = filtered;
    if (activeFilters.category) {
      results = results.filter(profile => 
        profile.skills.some(skill => 
          skill.toLowerCase().includes(activeFilters.category!.toLowerCase())
        )
      );
    }
    if (activeFilters.location) {
      results = results.filter(profile => 
        profile.location.toLowerCase().includes(activeFilters.location!.toLowerCase())
      );
    }
    
    // Convert to SearchResult format
    const searchResults: SearchResult[] = results.map(profile => ({
      id: profile.id,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      focus: profile.focus,
      skills: profile.skills,
      highlights: profile.highlights,
      links: profile.links,
      lookingFor: profile.lookingFor,
      aiInsight: profile.aiInsight,
      location: profile.location,
      isOnline: profile.isOnline,
      isPro: profile.isPro,
      isConnectedWithViewer: false,
      hasMessagedViewer: false
    }));
    
    setSearchResults(searchResults);
  };

  const handleProjectSearch = async (query: string) => {
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.lookingFor.toLowerCase().includes(query.toLowerCase()) ||
      project.ownerName.toLowerCase().includes(query.toLowerCase())
    );
    
    // Apply filters
    let results = filtered;
    if (activeFilters.location) {
      results = results.filter(project => 
        project.location?.toLowerCase().includes(activeFilters.location!.toLowerCase())
      );
    }
    
    setProjectSearchResults(results);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
    
    // If there's an active search query, re-search with new filters
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const handleViewModeChange = (view: string) => {
    setViewMode(view as 'profiles' | 'projects');
    setSearchQuery('');
    setSearchResults([]);
    setProjectSearchResults([]);
    setActiveFilters({});
  };

  const handleProfileClick = (profile: SearchResult) => {
    console.log('Profile clicked:', profile);
  };

  const handleMessage = (profileId: string) => {
    console.log('Message profile:', profileId);
  };

  const handleShare = (profile: SearchResult) => {
    console.log('Share profile:', profile);
  };

  const handleCardAction = (action: string, item: any) => {
    console.log(`${action} action on:`, item);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('coparty_search_history');
  };

  const displayProfiles = searchQuery ? searchResults : profiles;
  const displayProjects = searchQuery ? projectSearchResults : projects;

  return (
    <Layout
      user={user}
      onAuthModalOpen={() => console.log('Auth modal')}
      onProfileSetupOpen={() => console.log('Profile setup')}
      onNotificationsOpen={() => console.log('Notifications')}
      onSignOut={() => console.log('Sign out')}
      onNavigate={(path) => console.log('Navigate to:', path)}
      onOpenModal={(modal) => console.log('Open modal:', modal)}
      projectCount={user ? projects.length : 0}
      hasUnreadNotifications={user ? true : false}
      showSearch={false}
    >
      <div className="flex-1 bg-black min-h-screen pt-16">
        {/* Back Button - Only show if onBack is provided */}
        {onBack && (
          <div className="sticky top-16 z-30 bg-black/95 backdrop-blur-sm border-b border-[#333333] py-4">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <button
                onClick={onBack}
                className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                ← Back to Test Page
              </button>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto p-4 pt-12">
          {/* View Mode Switch */}
          <div className="mb-8 flex justify-center">
            <div className="bg-black border border-[#333333] rounded-xl p-1.5 flex relative">
              {/* Slide Highlight */}
              <div 
                className={`absolute top-1.5 bottom-1.5 rounded-lg bg-[#316afd] transition-all duration-300 ease-out w-[calc(50%-6px)] ${
                  viewMode === 'profiles' 
                    ? 'left-1.5' 
                    : 'left-[calc(50%+3px)]'
                }`}
              />
              
              <button
                onClick={() => handleViewModeChange('profiles')}
                className={`relative px-12 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 z-10 ${
                  viewMode === 'profiles'
                    ? 'text-white'
                    : 'text-[#999999] hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                Profiles
              </button>
              <button
                onClick={() => handleViewModeChange('projects')}
                className={`relative px-12 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 z-10 ${
                  viewMode === 'projects'
                    ? 'text-white'
                    : 'text-[#999999] hover:text-white'
                }`}
              >
                <Laptop className="w-4 h-4" />
                Projects
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBar 
                onSearch={handleSearch}
                isLoading={isSearching}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                key={viewMode}
              />
            </div>
          </div>

          {/* Search History */}
          {!searchQuery && searchHistory.length > 0 && (
            <div className="mb-8">
              <div className="bg-[#111111] border border-[#333333] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">Recent Searches</h3>
                  <button
                    onClick={handleClearHistory}
                    className="text-[#666666] hover:text-white text-sm transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 6).map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(query)}
                      className="px-3 py-1 bg-[#222222] hover:bg-[#316afd] text-[#cccccc] hover:text-white rounded-lg text-sm transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSearching ? 'Searching...' : `Found ${viewMode === 'profiles' ? displayProfiles.length : displayProjects.length} ${viewMode} for "${searchQuery}"`}
                </h2>
                {!isSearching && (
                  <p className="text-[#cccccc]">
                    Click on the cards to see details and connect.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="space-y-8">
            {viewMode === 'profiles' ? (
              <div>
                {!searchQuery && (
                  <h2 className="text-2xl font-bold text-white mb-8 text-center">Discover Makers</h2>
                )}
                
                {isSearching ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-[#111111] border border-[#333333] rounded-xl p-5 h-96 animate-pulse">
                        <div className="bg-[#333333] rounded-lg w-16 h-16 mb-4"></div>
                        <div className="bg-[#333333] rounded h-4 mb-2"></div>
                        <div className="bg-[#333333] rounded h-3 mb-4"></div>
                        <div className="bg-[#333333] rounded h-3 mb-2"></div>
                        <div className="bg-[#333333] rounded h-3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayProfiles
                      .sort((a, b) => {
                        const aIsPro = a.isPro || false;
                        const bIsPro = b.isPro || false;
                        if (aIsPro && !bIsPro) return -1;
                        if (!aIsPro && bIsPro) return 1;
                        return 0;
                      })
                      .map((profile, index) => (
                        <motion.div
                          key={profile.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: index * 0.1,
                            duration: profile.isPro ? 0.2 : 0.3
                          }}
                        >
                          <ProfileCard
                            profile={profile}
                            onConnect={() => handleCardAction('connect', profile)}
                            onMessage={() => handleMessage(profile.id)}
                            onShare={() => handleShare(profile)}
                            onOpenProfile={() => handleProfileClick(profile)}
                            connectionStatus={index % 3 === 0 ? 'none' : index % 3 === 1 ? 'pending' : 'accepted'}
                          />
                        </motion.div>
                      ))}
                  </div>
                )}

                {displayProfiles.length === 0 && searchQuery && !isSearching && (
                  <div className="text-center py-12">
                    <p className="text-[#666666] text-lg">No profiles found matching your search.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {!searchQuery && (
                  <h2 className="text-2xl font-bold text-white mb-8 text-center">Discover Projects</h2>
                )}

                {isSearching ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-[#111111] border border-[#333333] rounded-xl p-5 h-96 animate-pulse">
                        <div className="bg-[#333333] rounded-lg w-16 h-16 mb-4"></div>
                        <div className="bg-[#333333] rounded h-4 mb-2"></div>
                        <div className="bg-[#333333] rounded h-3 mb-4"></div>
                        <div className="bg-[#333333] rounded h-3 mb-2"></div>
                        <div className="bg-[#333333] rounded h-3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayProjects
                      .sort((a, b) => {
                        const aIsPro = a.isPro || false;
                        const bIsPro = b.isPro || false;
                        if (aIsPro && !bIsPro) return -1;
                        if (!aIsPro && bIsPro) return 1;
                        return 0;
                      })
                      .map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: index * 0.1,
                            duration: project.isPro ? 0.2 : 0.3
                          }}
                        >
                          <ProjectCard
                            projectPost={project}
                            onShowDetail={() => handleCardAction('showDetail', project)}
                            onEdit={() => handleCardAction('edit', project)}
                            onDelete={() => handleCardAction('delete', project)}
                            onMessage={() => handleCardAction('message', project)}
                            onSave={() => handleCardAction('save', project)}
                            onApply={() => handleCardAction('apply', project)}
                            isOwner={false}
                          />
                        </motion.div>
                      ))}
                  </div>
                )}

                {displayProjects.length === 0 && searchQuery && !isSearching && (
                  <div className="text-center py-12">
                    <p className="text-[#666666] text-lg">No projects found matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;