import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Bell, Shield, Palette, Globe, Mail, Phone, Camera, Save, Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'account';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isLoading, setSaving] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Product Manager passionate about building innovative mobile applications.',
    location: 'San Francisco, CA',
    website: 'https://sarahjohnson.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: true,
    projectUpdates: true,
    messages: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'America/Los_Angeles'
  });

  // Account settings
  const [account, setAccount] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    showPassword: false
  });

  const handleClose = () => {
    if (unsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
        setUnsavedChanges(false);
      }
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setUnsavedChanges(false);
    console.log('Settings saved');
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateNotifications = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updatePrivacy = (field: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateAppearance = (field: string, value: string) => {
    setAppearance(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateAccount = (field: string, value: string | boolean) => {
    setAccount(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <Globe className="w-4 h-4" /> },
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
            className="bg-[#111111] border border-[#333333] rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] relative mx-4 flex"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar */}
            <div className="w-64 border-r border-[#333333] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-[#316afd] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#222222]'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                      
                      {/* Avatar */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#333333] border border-[#333333] flex items-center justify-center">
                          <ImageWithFallback 
                            src={profile.avatar} 
                            alt={profile.name} 
                            width={80} 
                            height={80} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <button className="flex items-center gap-2 bg-[#222222] hover:bg-[#333333] border border-[#444444] text-white px-4 py-2 rounded-lg transition-colors">
                            <Camera className="w-4 h-4" />
                            Change Avatar
                          </button>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF (max 2MB)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => updateProfile('name', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => updateProfile('email', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => updateProfile('phone', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => updateProfile('location', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                          <input
                            type="url"
                            value={profile.website}
                            onChange={(e) => updateProfile('website', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                          <textarea
                            value={profile.bio}
                            onChange={(e) => updateProfile('bio', e.target.value)}
                            rows={4}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-[#222222] rounded-lg">
                            <div>
                              <p className="text-white font-medium">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-400">
                                {key === 'emailUpdates' && 'Receive email notifications for important updates'}
                                {key === 'pushNotifications' && 'Get push notifications on your device'}
                                {key === 'projectUpdates' && 'Notifications about projects you\'re involved in'}
                                {key === 'messages' && 'Direct messages from other users'}
                                {key === 'weeklyDigest' && 'Weekly summary of platform activity'}
                                {key === 'marketingEmails' && 'Product updates and promotional content'}
                              </p>
                            </div>
                            <button
                              onClick={() => updateNotifications(key, !value)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                value ? 'bg-[#316afd]' : 'bg-[#444444]'
                              }`}
                            >
                              <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  value ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        {Object.entries(privacy).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-[#222222] rounded-lg">
                            <div>
                              <p className="text-white font-medium">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-400">
                                {key === 'profilePublic' && 'Make your profile visible to other users'}
                                {key === 'showEmail' && 'Display your email address on your profile'}
                                {key === 'showPhone' && 'Display your phone number on your profile'}
                                {key === 'allowMessages' && 'Allow other users to send you messages'}
                                {key === 'showOnlineStatus' && 'Show when you\'re online to other users'}
                              </p>
                            </div>
                            <button
                              onClick={() => updatePrivacy(key, !value)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                value ? 'bg-[#316afd]' : 'bg-[#444444]'
                              }`}
                            >
                              <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  value ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Appearance & Language</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                          <select
                            value={appearance.theme}
                            onChange={(e) => updateAppearance('theme', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd]"
                          >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                          <select
                            value={appearance.language}
                            onChange={(e) => updateAppearance('language', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd]"
                          >
                            <option value="en">English</option>
                            <option value="tr">Türkçe</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                          <select
                            value={appearance.timezone}
                            onChange={(e) => updateAppearance('timezone', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd]"
                          >
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                            <option value="Europe/Istanbul">Turkey Time (TRT)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Account Security</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={account.showPassword ? 'text' : 'password'}
                              value={account.currentPassword}
                              onChange={(e) => updateAccount('currentPassword', e.target.value)}
                              className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => updateAccount('showPassword', !account.showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {account.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                          <input
                            type={account.showPassword ? 'text' : 'password'}
                            value={account.newPassword}
                            onChange={(e) => updateAccount('newPassword', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                          <input
                            type={account.showPassword ? 'text' : 'password'}
                            value={account.confirmPassword}
                            onChange={(e) => updateAccount('confirmPassword', e.target.value)}
                            className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#316afd] transition-colors"
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-[#222222] rounded-lg">
                          <div>
                            <p className="text-white font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                          </div>
                          <button
                            onClick={() => updateAccount('twoFactor', !account.twoFactor)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              account.twoFactor ? 'bg-[#316afd]' : 'bg-[#444444]'
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                account.twoFactor ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#333333] bg-[#0a0a0a]">
                <div className="flex items-center justify-between">
                  <div>
                    {unsavedChanges && (
                      <p className="text-sm text-yellow-400">You have unsaved changes</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!unsavedChanges || isLoading}
                      className="flex items-center gap-2 bg-[#316afd] hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;