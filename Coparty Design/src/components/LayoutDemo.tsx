import React, { useState } from 'react';
import Layout from './Layout';
import ProjectCard from './ProjectCard';
import ProfileCard from './ProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';

interface LayoutDemoProps {
  onBack: () => void;
}

const LayoutDemo: React.FC<LayoutDemoProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'profiles' | 'projects'>('profiles');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock user data
  const mockUser = {
    uid: 'user123',
    displayName: 'John Doe',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    email: 'john.doe@example.com'
  };

  // Sample data
  const sampleProfiles = [
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
    }
  ];

  const sampleProjects = [
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
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (currentView === 'profiles') {
      const filtered = sampleProfiles.filter(profile => 
        profile.name.toLowerCase().includes(query.toLowerCase()) ||
        profile.bio.toLowerCase().includes(query.toLowerCase()) ||
        profile.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      const filtered = sampleProjects.filter(project => 
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.lookingFor.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filter changed:', filters);
    // Implement filter logic here
  };

  const handleViewModeChange = (view: string) => {
    setCurrentView(view as 'profiles' | 'projects');
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCardAction = (action: string, item: any) => {
    console.log(`${action} action on:`, item);
  };

  const displayData = searchQuery ? searchResults : (currentView === 'profiles' ? sampleProfiles : sampleProjects);

  return (
    <Layout
      user={mockUser}
      onAuthModalOpen={() => console.log('Auth modal')}
      onProfileSetupOpen={() => console.log('Profile setup')}
      onNotificationsOpen={() => console.log('Notifications')}
      onSignOut={() => console.log('Sign out')}
      onNavigate={(path) => console.log('Navigate to:', path)}
      onOpenModal={(modal) => console.log('Open modal:', modal)}
      projectCount={3}
      hasUnreadNotifications={true}
      showSearch={true}
      searchPlaceholder={currentView === 'profiles' ? 'Search profiles...' : 'Search projects...'}
      viewMode={currentView}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
    >
      <div className="flex-1 bg-[#0a0a0a] min-h-screen">
        {/* Back Button */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#333333] py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <button
              onClick={onBack}
              className="bg-[#111111] hover:bg-[#316afd] border border-[#333333] text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              ← Back to Test Page
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* View Mode Tabs */}
          <Tabs value={currentView} onValueChange={handleViewModeChange} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-[#111111] border border-[#333333]">
              <TabsTrigger 
                value="profiles" 
                className="data-[state=active]:bg-[#316afd] data-[state=active]:text-white text-[#cccccc]"
              >
                Profiles ({sampleProfiles.length})
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-[#316afd] data-[state=active]:text-white text-[#cccccc]"
              >
                Projects ({sampleProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profiles" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {searchQuery && (
                  <div className="mb-6 p-4 bg-[#111111] rounded-lg border border-[#333333]">
                    <p className="text-[#cccccc]">
                      Search results for "<span className="text-white font-medium">{searchQuery}</span>": {displayData.length} profiles found
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayData.map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProfileCard
                        profile={profile}
                        onConnect={() => handleCardAction('connect', profile)}
                        onMessage={() => handleCardAction('message', profile)}
                        onShare={() => handleCardAction('share', profile)}
                        onOpenProfile={() => handleCardAction('openProfile', profile)}
                        connectionStatus={index % 3 === 0 ? 'none' : index % 3 === 1 ? 'pending' : 'accepted'}
                      />
                    </motion.div>
                  ))}
                </div>

                {displayData.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <p className="text-[#666666] text-lg">No profiles found matching your search.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="projects" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {searchQuery && (
                  <div className="mb-6 p-4 bg-[#111111] rounded-lg border border-[#333333]">
                    <p className="text-[#cccccc]">
                      Search results for "<span className="text-white font-medium">{searchQuery}</span>": {displayData.length} projects found
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayData.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProjectCard
                        projectPost={project}
                        onShowDetail={() => handleCardAction('showDetail', project)}
                        onEdit={() => handleCardAction('edit', project)}
                        onDelete={() => handleCardAction('delete', project)}
                        onMessage={() => handleCardAction('message', project)}
                        onSave={() => handleCardAction('save', project)}
                        onApply={() => handleCardAction('apply', project)}
                        isOwner={project.ownerId === mockUser.uid}
                      />
                    </motion.div>
                  ))}
                </div>

                {displayData.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <p className="text-[#666666] text-lg">No projects found matching your search.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Demo Instructions */}
          <div className="mt-12 p-6 bg-[#316afd]/10 rounded-xl border border-[#316afd]/30">
            <h3 className="text-xl font-bold text-white mb-4">🚀 Layout Demo Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Header & Navigation</h4>
                <ul className="text-[#cccccc] space-y-1 text-sm">
                  <li>• Responsive header with logo and user actions</li>
                  <li>• Mobile menu sidebar with navigation sections</li>
                  <li>• Project count badge and notification indicators</li>
                  <li>• User avatar with dropdown ready functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Search & Filtering</h4>
                <ul className="text-[#cccccc] space-y-1 text-sm">
                  <li>• Integrated search bar with real-time filtering</li>
                  <li>• Category and location filter options</li>
                  <li>• View mode switching (Profiles/Projects)</li>
                  <li>• Search results highlighting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Sidebar Navigation</h4>
                <ul className="text-[#cccccc] space-y-1 text-sm">
                  <li>• Social section: Profiles, Projects, Friends, Saved</li>
                  <li>• Map & Events navigation</li>
                  <li>• Settings and profile editing</li>
                  <li>• Animated PRO upgrade CTA</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Interactive Elements</h4>
                <ul className="text-[#cccccc] space-y-1 text-sm">
                  <li>• Click sidebar menu to test navigation</li>
                  <li>• Try searching for "React", "Sarah", or "Analytics"</li>
                  <li>• Test filter dropdown in search bar</li>
                  <li>• Switch between Profiles and Projects tabs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LayoutDemo;