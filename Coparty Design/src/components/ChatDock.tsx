import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ChatPanel from './ChatPanel';
import { ImageWithFallback } from './figma/ImageWithFallback';

export type DockConversation = {
  id: string;
  chatId: string;
  participant: {
    id: string;
    name: string;
    avatarUrl?: string;
    isOnline?: boolean;
    title?: string;
    city?: string;
    country?: string;
    location?: string;
    isPro?: boolean;
  };
  messages: Array<{
    id: string;
    senderId: string;
    text: string;
    createdAt: Date | string | number;
    status?: 'sending' | 'sent' | 'error' | 'failed';
    read?: boolean;
  }>;
  typingUsers?: Array<{ userId: string; name?: string }>;
  failedMessages?: any[];
  unreadCount?: number;
};

type ChatDockProps = {
  currentUserId: string;
  initialConversations?: DockConversation[];
  onNewChat?: (participant: any) => void;
};

export default function ChatDock({ 
  currentUserId, 
  initialConversations = [],
  onNewChat 
}: ChatDockProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState<DockConversation[]>(initialConversations);
  const [openConversationIds, setOpenConversationIds] = useState<string[]>([]);
  const [minimizedConversationIds, setMinimizedConversationIds] = useState<string[]>([]);

  // Initialize with sample conversations for demo
  useEffect(() => {
    if (initialConversations.length === 0 && conversations.length === 0) {
      const sampleConversations: DockConversation[] = [
        {
          id: 'conv1',
          chatId: 'chat1',
          participant: {
            id: 'user1',
            name: 'Sarah Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
            isOnline: true,
            title: 'Senior Frontend Developer',
            location: 'San Francisco, CA',
            isPro: true
          },
          messages: [
            {
              id: 'msg1',
              senderId: 'user1',
              text: 'Hey! I saw your project and I\'m really interested in collaborating.',
              createdAt: new Date(Date.now() - 30 * 60 * 1000),
              status: 'sent',
              read: false
            },
            {
              id: 'msg2',
              senderId: currentUserId,
              text: 'That sounds great! Would love to discuss the details.',
              createdAt: new Date(Date.now() - 25 * 60 * 1000),
              status: 'sent',
              read: true
            }
          ],
          unreadCount: 1
        },
        {
          id: 'conv2',
          chatId: 'chat2',
          participant: {
            id: 'user2',
            name: 'Alex Chen',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
            isOnline: false,
            title: 'ML Engineer',
            location: 'New York, NY',
            isPro: false
          },
          messages: [
            {
              id: 'msg3',
              senderId: 'user2',
              text: 'Hi! I have some questions about the AI integration you mentioned.',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              status: 'sent',
              read: true
            }
          ],
          unreadCount: 0
        },
        {
          id: 'conv3',
          chatId: 'chat3',
          participant: {
            id: 'user3',
            name: 'Maria Garcia',
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
            isOnline: true,
            title: 'UI/UX Designer',
            location: 'Austin, TX',
            isPro: true
          },
          messages: [],
          unreadCount: 0
        }
      ];
      setConversations(sampleConversations);
    }
  }, [initialConversations.length]);

  function formatTime(dateLike: Date | string | number | undefined) {
    if (!dateLike) return '';
    const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const openConversation = useCallback((id: string) => {
    setIsDrawerOpen(false);
    
    // Remove from minimized if it's there
    setMinimizedConversationIds(prev => prev.filter(convId => convId !== id));
    
    // Add to open conversations if not already open
    setOpenConversationIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  }, []);

  const closeConversation = useCallback((id: string) => {
    setOpenConversationIds(prev => prev.filter(convId => convId !== id));
    setMinimizedConversationIds(prev => prev.filter(convId => convId !== id));
  }, []);

  const minimizeConversation = useCallback((id: string) => {
    setOpenConversationIds(prev => prev.filter(convId => convId !== id));
    setMinimizedConversationIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      text: text.trim(),
      createdAt: new Date(),
      status: 'sent' as const,
      read: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));
  }, [currentUserId]);

  const retryFailedMessages = useCallback((conversationId: string) => {
    console.log('Retry failed messages for:', conversationId);
  }, []);

  // Calculate positions for stacked windows
  const opened = openConversationIds
    .map((id) => conversations.find((c) => c.id === id))
    .filter(Boolean) as DockConversation[];

  const COLLAPSED_BAR_HEIGHT = 40;
  const OPEN_DRAWER_HEIGHT = 420;
  const COLLAPSED_BAR_WIDTH = 240;
  const OPEN_DRAWER_WIDTH = 360;
  const PANEL_STACK_GAP = 4;
  const PANEL_STACK_STEP = 360 + PANEL_STACK_GAP;
  const bottomOffset = 0;
  const chipsMarginBottom = (isDrawerOpen ? OPEN_DRAWER_HEIGHT : COLLAPSED_BAR_HEIGHT) + 8;
  const baseRightOffset = (isDrawerOpen ? OPEN_DRAWER_WIDTH : COLLAPSED_BAR_WIDTH) + 2;

  const totalUnreadCount = conversations.reduce((total, c) => total + (c.unreadCount || 0), 0);

  return (
    <div className="fixed right-0 bottom-4 z-[60]">
      {/* Minimized chips */}
      {minimizedConversationIds.length > 0 && (
        <div className="flex items-center justify-end gap-2 mb-2" style={{ marginBottom: chipsMarginBottom }}>
          {minimizedConversationIds.map((id, index) => {
            const c = conversations.find((x) => x.id === id);
            if (!c) return null;
            
            return (
              <button
                key={`minimized-${id}-${index}`}
                onClick={() => openConversation(id)}
                className="flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-full pl-1 pr-3 py-1 hover:bg-[#161616] relative transition-colors"
              >
                {c.participant.avatarUrl ? (
                  <ImageWithFallback 
                    src={c.participant.avatarUrl} 
                    alt={c.participant.name} 
                    className="w-7 h-7 rounded-lg object-cover" 
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#222222]" />
                )}
                <span className="text-white text-sm">{c.participant.name}</span>
                {!!(c.unreadCount && c.unreadCount > 0) && (
                  <span className="absolute -top-1 -right-1 bg-[#316afd] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {c.unreadCount > 9 ? '9+' : c.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Opened chat panels */}
      {opened.map((c, index) => (
        <ChatPanel
          key={`opened-${c.id}-${index}`}
          isOpen
          onClose={() => closeConversation(c.id)}
          onMinimize={() => minimizeConversation(c.id)}
          currentUserId={currentUserId}
          participant={c.participant}
          initialMessages={c.messages}
          typingUsers={c.typingUsers || []}
          failedMessages={c.failedMessages || []}
          onSendMessage={(text: string) => sendMessage(c.id, text)}
          onRetryFailedMessages={() => retryFailedMessages(c.id)}
          position={{ right: baseRightOffset + index * PANEL_STACK_STEP, bottom: bottomOffset }}
          zIndex={60 + index}
          title="Message"
        />
      ))}

      {/* Drawer */}
      <div className="fixed right-0 bottom-0">
        <AnimatePresence>
          {isDrawerOpen ? (
            <motion.div 
              className="bg-[#0b0b0b] border border-[#333333] rounded-t-xl shadow-2xl w-[250px] md:w-[360px]" 
              style={{ height: OPEN_DRAWER_HEIGHT }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span className="text-white font-medium hidden md:inline">Messages</span>
                </div>
                <button 
                  className="p-2 text-[#cccccc] hover:text-white rounded-md hover:bg-[#111111] transition-colors" 
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto" style={{ height: OPEN_DRAWER_HEIGHT - 48 }}>
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-[#888888] text-sm">
                    No conversations yet. Start chatting with someone!
                  </div>
                ) : (
                  conversations.map((c, index) => {
                    const lastMsg = c.messages[c.messages.length - 1];
                    
                    return (
                      <button
                        key={`conversation-${c.id}-${index}`}
                        onClick={() => openConversation(c.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#111111] text-left relative transition-colors"
                      >
                        {/* Avatar with online dot */}
                        <div className="relative">
                          {c.participant.avatarUrl ? (
                            <ImageWithFallback 
                              src={c.participant.avatarUrl} 
                              alt={c.participant.name} 
                              className="w-9 h-9 rounded-lg object-cover" 
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-[#222222]" />
                          )}
                          {!!(c.unreadCount && c.unreadCount > 0) && (
                            <span className="absolute -top-1 -right-1 bg-[#316afd] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {c.unreadCount > 9 ? '9+' : c.unreadCount}
                            </span>
                          )}
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1 h-9 flex flex-col justify-between">
                          {/* Top row: name, title */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-white text-sm font-medium truncate">{c.participant.name}</span>
                            {c.participant.isOnline && <span className="w-2 h-2 rounded-full bg-[#00ff00]" />}
                            {c.participant.title && (
                              <span className="text-[11px] text-[#aaaaaa] truncate">{c.participant.title}</span>
                            )}
                          </div>
                          {/* Bottom row: last message and time */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-[#999999] truncate flex-1">
                              {lastMsg?.text || 'New conversation'}
                            </span>
                            <span className="text-[11px] text-[#666666] whitespace-nowrap">
                              {formatTime(lastMsg?.createdAt)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setIsDrawerOpen(true)}
              className="w-12 md:w-[240px] h-10 bg-[#111111] border border-[#333333] rounded-t-xl shadow-xl text-white flex items-center gap-2 justify-center hover:bg-[#161616] relative transition-colors"
              aria-label="Open messages drawer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:inline">Messages</span>
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-[#316afd] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}