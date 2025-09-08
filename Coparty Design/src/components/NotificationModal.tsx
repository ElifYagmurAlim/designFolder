import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X, Bell, User, Users, Calendar, MessageSquare, Clock } from 'lucide-react';

const NOTIFICATION_TYPES = {
  FRIEND_REQUEST: 'friend_request',
  FRIEND_ACCEPTED: 'friend_accepted',
  PROFILE_VISIT: 'profile_visit',
  MEETING: 'meeting',
  MEETING_REQUEST: 'meeting_request',
  MEETING_CONFIRMED: 'meeting_confirmed',
  MEETING_CANCELLED: 'meeting_cancelled',
  MEETING_REMINDER: 'meeting_reminder',
  MESSAGE: 'message',
};

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  sentAt: Date;
  read: boolean;
  isMock?: boolean;
  type: string;
  data?: any;
};

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [initializing, setInitializing] = useState(true);

  const mockNotifications = useMemo<NotificationItem[]>(() => ([
    {
      id: 'mock-1',
      title: 'New Friend Request',
      body: 'Ahmet Yılmaz sent you a friend request.',
      sentAt: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      isMock: true,
      type: NOTIFICATION_TYPES.FRIEND_REQUEST,
    },
    {
      id: 'mock-2',
      title: 'Profile Viewed',
      body: 'Ayşe Demir viewed your profile.',
      sentAt: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      isMock: true,
      type: NOTIFICATION_TYPES.PROFILE_VISIT,
    },
    {
      id: 'mock-3',
      title: 'Upcoming Meeting',
      body: 'Project Planning meeting starts in 30 minutes.',
      sentAt: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      isMock: true,
      type: NOTIFICATION_TYPES.MEETING,
    },
    {
      id: 'mock-4',
      title: 'New Meeting Request',
      body: 'Mehmet Kaya sent you a meeting request.',
      sentAt: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      isMock: true,
      type: NOTIFICATION_TYPES.MEETING_REQUEST,
    },
    {
      id: 'mock-5',
      title: 'Friend Request Accepted',
      body: 'Fatma Özkan accepted your friend request.',
      sentAt: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
      isMock: true,
      type: NOTIFICATION_TYPES.FRIEND_ACCEPTED,
    },
    {
      id: 'mock-6',
      title: 'Meeting Confirmed',
      body: 'Your meeting with Zeynep Arslan has been confirmed.',
      sentAt: new Date(Date.now() - 1000 * 60 * 180),
      read: false,
      isMock: true,
      type: NOTIFICATION_TYPES.MEETING_CONFIRMED,
    },
    {
      id: 'mock-7',
      title: 'New Message',
      body: 'Can Yıldız sent you a new message.',
      sentAt: new Date(Date.now() - 1000 * 60 * 240),
      read: false,
      isMock: true,
      type: NOTIFICATION_TYPES.MESSAGE,
    },
    {
      id: 'mock-8',
      title: 'Meeting Reminder',
      body: 'Sprint Planning meeting tomorrow at 14:00.',
      sentAt: new Date(Date.now() - 1000 * 60 * 300),
      read: true,
      isMock: true,
      type: NOTIFICATION_TYPES.MEETING_REMINDER,
    },
  ]), []);

  // Subscribe when modal opens
  useEffect(() => {
    if (!isOpen) {
      setInitializing(true);
      return;
    }
    setInitializing(true);

    // For demo purposes, use mock data
    setNotifications(mockNotifications);
    setTimeout(() => {
      setInitializing(false);
    }, 1000);
  }, [isOpen, mockNotifications]);

  if (typeof document === 'undefined') return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.FRIEND_REQUEST:
      case NOTIFICATION_TYPES.FRIEND_ACCEPTED:
        return <Users className="w-5 h-5 text-white" />;
      case NOTIFICATION_TYPES.PROFILE_VISIT:
        return <User className="w-5 h-5 text-white" />;
      case NOTIFICATION_TYPES.MEETING:
      case NOTIFICATION_TYPES.MEETING_REQUEST:
      case NOTIFICATION_TYPES.MEETING_CONFIRMED:
      case NOTIFICATION_TYPES.MEETING_CANCELLED:
      case NOTIFICATION_TYPES.MEETING_REMINDER:
        return <Calendar className="w-5 h-5 text-white" />;
      case NOTIFICATION_TYPES.MESSAGE:
        return <MessageSquare className="w-5 h-5 text-white" />;
      default:
        return <Bell className="w-5 h-5 text-white" />;
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    console.log('Notification clicked:', notification);
    // Handle notification click based on type
  };

  const node = (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[1000]">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Dropdown Panel */}
          <motion.div
            className="absolute bg-[#0b0b0b]/95 backdrop-blur-sm border border-[#333333] rounded-b-2xl rounded-t-none shadow-2xl overflow-hidden will-change-transform"
            style={{
              top: 64, // Below header
              right: 0,
              width: '32rem',
              maxWidth: '90vw'
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#333333]">
              <h3 className="text-white font-semibold">Notifications</h3>
              <button
                onClick={onClose}
                className="p-1 text-[#cccccc] hover:text-white rounded hover:bg-[#1a1a1a] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="h-80 overflow-auto">
              {initializing ? (
                <div className="p-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#333333] mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-[#333333] rounded w-1/3 mb-2" />
                          <div className="h-3 bg-[#333333]/80 rounded w-2/3 mb-1" />
                          <div className="h-3 bg-[#333333]/60 rounded w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-[#666666] mx-auto mb-2" />
                  <div className="text-sm text-[#aaaaaa]">No notifications yet</div>
                </div>
              ) : (
                notifications.map((n) => {
                  const sentAtDate = n.sentAt;
                  
                  return (
                    <div 
                      key={n.id}
                      className="p-4 hover:bg-[#111111]/50 transition-colors cursor-pointer"
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${n.read !== true ? 'bg-red-500' : 'bg-transparent'}`} />
                        </div>
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white mb-1">{n.title || 'Notification'}</div>
                            {n.body && (
                              <div className="text-sm text-[#aaaaaa] mb-2 leading-relaxed">
                                {n.body}
                              </div>
                            )}
                            {sentAtDate && (
                              <div className="text-xs text-[#666666]">
                                {sentAtDate.toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit'
                                })} {sentAtDate.toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}