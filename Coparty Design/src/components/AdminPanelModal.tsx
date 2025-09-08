import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, BarChart3, Settings, Shield, Activity, Database, AlertTriangle, CheckCircle, Clock, TrendingUp, UserCheck, UserX, Crown, Send, FileText } from 'lucide-react';

type AdminPanelModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [notificationTarget, setNotificationTarget] = useState('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Send },
    { id: 'logs', label: 'Admin Logs', icon: FileText },
    { id: 'system', label: 'System', icon: Settings },
  ];

  // Mock data
  const analytics = {
    users: { total: 1247, active: 892, pro: 156, suspended: 12, new: 34 },
    projects: { total: 2341, new: 127 },
    meetings: { total: 1843, new: 298 }
  };

  const users = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'user',
      status: 'active',
      isPro: true,
      joinDate: new Date('2024-01-15')
    },
    {
      id: '2', 
      name: 'Alex Chen',
      email: 'alex@example.com',
      role: 'user',
      status: 'active',
      isPro: false,
      joinDate: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'Maria Garcia',
      email: 'maria@example.com',
      role: 'admin',
      status: 'active',
      isPro: true,
      joinDate: new Date('2023-12-10')
    }
  ];

  const logs = [
    {
      id: '1',
      action: 'user_updated',
      targetId: 'user123',
      details: { field: 'role', value: 'pro' },
      timestamp: new Date()
    },
    {
      id: '2',
      action: 'notification_sent',
      targetId: 'all_users',
      details: { title: 'System Update', recipients: 1247 },
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ];

  const handleUserAction = async (userId: string, action: string) => {
    console.log(`Admin action: ${action} for user ${userId}`);
    // Implement user action logic
  };

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationBody) return;
    console.log('Sending notification:', { notificationTitle, notificationBody, notificationTarget });
    // Implement notification sending logic
    setNotificationTitle('');
    setNotificationBody('');
    setNotificationTarget('all');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative bg-[#0b0b0b] border border-[#333333] rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#333333] bg-[#111111]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#316afd] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
                <p className="text-[#aaaaaa] text-sm">System administration and monitoring</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-[#cccccc] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[700px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-[#333333] bg-[#111111]">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#316afd] text-white'
                          : 'text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#aaaaaa] text-sm">Total Users</p>
                          <p className="text-2xl font-bold text-white">
                            {analytics.users.total}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-[#316afd]" />
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#aaaaaa] text-sm">Active Users</p>
                          <p className="text-2xl font-bold text-white">
                            {analytics.users.active}
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-[#00ff00]" />
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#aaaaaa] text-sm">Pro Users</p>
                          <p className="text-2xl font-bold text-white">
                            {analytics.users.pro}
                          </p>
                        </div>
                        <Crown className="w-8 h-8 text-[#ffd700]" />
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#aaaaaa] text-sm">Total Projects</p>
                          <p className="text-2xl font-bold text-white">
                            {analytics.projects.total}
                          </p>
                        </div>
                        <Database className="w-8 h-8 text-[#8b5cf6]" />
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#aaaaaa] text-sm">Total Meetings</p>
                          <p className="text-2xl font-bold text-white">
                            {analytics.meetings.total}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-[#10b981]" />
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#aaaaaa] text-sm">New This Week</p>
                          <p className="text-2xl font-bold text-white">
                            {analytics.users.new}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-[#f59e0b]" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded">
                        <CheckCircle className="w-4 h-4 text-[#00ff00]" />
                        <span className="text-sm text-[#aaaaaa]">New user registered: Alice Brown</span>
                        <span className="text-xs text-[#666666] ml-auto">2 min ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded">
                        <AlertTriangle className="w-4 h-4 text-[#ff6b6b]" />
                        <span className="text-sm text-[#aaaaaa]">User suspended: Bob Johnson</span>
                        <span className="text-xs text-[#666666] ml-auto">15 min ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded">
                        <CheckCircle className="w-4 h-4 text-[#00ff00]" />
                        <span className="text-sm text-[#aaaaaa]">Pro subscription: John Doe</span>
                        <span className="text-xs text-[#666666] ml-auto">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">User Management</h3>
                    <button className="px-4 py-2 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-lg text-sm font-medium transition-colors">
                      Add User
                    </button>
                  </div>
                  
                  <div className="bg-[#111111] border border-[#333333] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#1a1a1a]">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Role</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Pro</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Joined</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333333]">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium text-white">{user.name}</p>
                                  <p className="text-xs text-[#aaaaaa]">{user.email}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  user.role === 'admin' 
                                    ? 'bg-[#ff6b6b] text-white' 
                                    : 'bg-[#333333] text-[#aaaaaa]'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  user.status === 'active' 
                                    ? 'bg-[#00ff00] text-black' 
                                    : 'bg-[#ff6b6b] text-white'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {user.isPro ? (
                                  <span className="text-[#ffd700]">✓</span>
                                ) : (
                                  <span className="text-[#666666]">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-[#aaaaaa]">
                                {user.joinDate.toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleUserAction(user.id, 'togglePro')}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                      user.isPro 
                                        ? 'bg-[#ff6b6b] hover:bg-[#ff5252] text-white' 
                                        : 'bg-[#ffd700] hover:bg-[#ffed4e] text-black'
                                    }`}
                                  >
                                    {user.isPro ? 'Remove Pro' : 'Make Pro'}
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(user.id, 'toggleStatus')}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                      user.status === 'active' 
                                        ? 'bg-[#ff6b6b] hover:bg-[#ff5252] text-white' 
                                        : 'bg-[#00ff00] hover:bg-[#00dd00] text-black'
                                    }`}
                                  >
                                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Analytics & Reports</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">User Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Total Users</span>
                          <span className="text-sm font-medium text-[#316afd]">{analytics.users.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Active Users</span>
                          <span className="text-sm font-medium text-[#00ff00]">{analytics.users.active}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Pro Users</span>
                          <span className="text-sm font-medium text-[#ffd700]">{analytics.users.pro}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Suspended</span>
                          <span className="text-sm font-medium text-[#ff6b6b]">{analytics.users.suspended}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Content Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Total Projects</span>
                          <span className="text-sm font-medium text-[#8b5cf6]">{analytics.projects.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">New Projects</span>
                          <span className="text-sm font-medium text-[#00ff00]">{analytics.projects.new}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Total Meetings</span>
                          <span className="text-sm font-medium text-[#10b981]">{analytics.meetings.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">New Meetings</span>
                          <span className="text-sm font-medium text-[#00ff00]">{analytics.meetings.new}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Send Bulk Notifications</h3>
                  
                  <div className="bg-[#111111] border border-[#333333] rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                          Notification Title
                        </label>
                        <input
                          type="text"
                          value={notificationTitle}
                          onChange={(e) => setNotificationTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd] transition-colors"
                          placeholder="Enter notification title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                          Notification Body
                        </label>
                        <textarea
                          value={notificationBody}
                          onChange={(e) => setNotificationBody(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd] transition-colors"
                          placeholder="Enter notification message"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                          Target Users
                        </label>
                        <select
                          value={notificationTarget}
                          onChange={(e) => setNotificationTarget(e.target.value)}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#316afd] transition-colors"
                        >
                          <option value="all">All Users</option>
                          <option value="pro">Pro Users Only</option>
                          <option value="active">Active Users Only</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleSendNotification}
                        disabled={!notificationTitle || !notificationBody}
                        className="w-full px-4 py-2 bg-[#316afd] hover:bg-[#3a76ff] disabled:bg-[#666666] text-white rounded-lg font-medium transition-colors"
                      >
                        Send Notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Admin Activity Logs</h3>
                  
                  <div className="bg-[#111111] border border-[#333333] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#1a1a1a]">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Action</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Target</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Details</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#aaaaaa]">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333333]">
                          {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-[#1a1a1a] transition-colors">
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-white capitalize">
                                  {log.action.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-[#aaaaaa]">
                                  {log.targetId || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-[#aaaaaa]">
                                  {JSON.stringify(log.details)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-[#aaaaaa]">
                                {log.timestamp.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">System Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Server Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">API Server</span>
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                            <span className="text-sm text-[#00ff00]">Online</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Database</span>
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                            <span className="text-sm text-[#00ff00]">Online</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">File Storage</span>
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                            <span className="text-sm text-[#00ff00]">Online</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">System Info</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Version</span>
                          <span className="text-sm text-white">v1.2.3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Last Update</span>
                          <span className="text-sm text-white">2024-01-15</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#aaaaaa]">Uptime</span>
                          <span className="text-sm text-white">99.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Maintenance</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Scheduled Maintenance</p>
                          <p className="text-xs text-[#aaaaaa]">Every Sunday at 2:00 AM UTC</p>
                        </div>
                        <button className="px-3 py-1 text-xs bg-[#316afd] hover:bg-[#3a76ff] text-white rounded transition-colors">
                          Configure
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Backup Schedule</p>
                          <p className="text-xs text-[#aaaaaa]">Daily at 3:00 AM UTC</p>
                        </div>
                        <button className="px-3 py-1 text-xs bg-[#316afd] hover:bg-[#3a76ff] text-white rounded transition-colors">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}