import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Paperclip, Image as ImageIcon, Send, Plus, Video, ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import MeetingModal from './MeetingModal';
import VideoCallModal from './VideoCallModal';

type ChatParticipant = {
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

type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  createdAt: Date | string | number;
  status?: 'sending' | 'sent' | 'error' | 'failed';
  read?: boolean;
};

type ProposedSlot = {
  date: Date;
  start: string;
  end: string;
};

export type ChatPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  currentUserId: string;
  participant: ChatParticipant;
  initialMessages?: ChatMessage[];
  typingUsers?: Array<{ userId: string; name?: string }>;
  failedMessages?: any[];
  onSendMessage?: (text: string) => void;
  onRetryFailedMessages?: () => void;
  title?: string;
  position?: { right?: number; left?: number; bottom: number };
  zIndex?: number;
};

function formatTime(dateLike: Date | string | number) {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPanel({
  isOpen,
  onClose,
  onMinimize,
  currentUserId,
  participant,
  initialMessages = [],
  typingUsers = [],
  failedMessages = [],
  onSendMessage,
  onRetryFailedMessages,
  title,
  position,
  zIndex = 50,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [scheduleSlots, setScheduleSlots] = useState<ProposedSlot[]>([]);
  const [currentStep, setCurrentStep] = useState<'dates' | 'times'>('dates');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [perDateSchedule, setPerDateSchedule] = useState<Record<string, Array<{ start: string; end: string }>>>({});
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [videoCallRoomId, setVideoCallRoomId] = useState<string>('');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  function toLocalISODate(d: Date) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getMonthLabel(date: Date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  function addMonths(date: Date, months: number) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months, 1);
    return d;
  }

  function getCalendarGrid(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const dow = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - dow);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }
    return days;
  }

  function formatSlot(slot: ProposedSlot): string {
    const d = slot.date;
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${dateStr} • ${slot.start} - ${slot.end}`;
  }

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!draft) return;
    setIsTyping(true);
    const t = setTimeout(() => setIsTyping(false), 1200);
    return () => clearTimeout(t);
  }, [draft]);

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || isSending) return;
    
    setIsSending(true);
    
    try {
      if (onSendMessage) {
        onSendMessage(text);
        setDraft('');
      } else {
        // Fallback to local state
        const tempId = `temp-${Date.now()}`;
        const optimistic: ChatMessage = {
          id: tempId,
          senderId: currentUserId,
          text,
          createdAt: new Date(),
          status: 'sending',
        };
        setMessages((prev) => [...prev, optimistic]);
        setDraft('');

        // Simulate success
        setTimeout(() => {
          setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'sent' } : m)));
        }, 500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }, [draft, onSendMessage, currentUserId, isSending]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleScheduleClose = useCallback(() => {
    setScheduleOpen(false);
    setCurrentStep('dates');
    setScheduleSlots([]);
    setSelectedDates([]);
    setPerDateSchedule({});
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentStep === 'dates' && selectedDates.length > 0) {
      setCurrentStep('times');
    }
  }, [currentStep, selectedDates.length]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep === 'times') {
      setCurrentStep('dates');
    }
  }, [currentStep]);

  const toggleDateSelection = useCallback((date: Date) => {
    const dateStr = date.toDateString();
    const isSelected = selectedDates.some(d => d.toDateString() === dateStr);
    
    if (isSelected) {
      setSelectedDates(prev => prev.filter(d => d.toDateString() !== dateStr));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  }, [selectedDates]);

  const generateSlotsFromPerDateSchedule = useCallback(() => {
    const slots: ProposedSlot[] = [];
    selectedDates.forEach((date) => {
      const key = toLocalISODate(date);
      const daySlots = perDateSchedule[key] || [];
      daySlots.forEach((slot) => {
        if (!slot.start || !slot.end) return;
        if (slot.start >= slot.end) return;
        slots.push({ date, start: slot.start, end: slot.end });
      });
    });
    return slots;
  }, [selectedDates, perDateSchedule]);

  const handleScheduleProposal = useCallback(async () => {
    if (scheduleSlots.length === 0) {
      alert('Please select at least one time slot.');
      return;
    }

    setIsScheduling(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Meeting proposal sent with ${scheduleSlots.length} time slot${scheduleSlots.length > 1 ? 's' : ''}!`);
      handleScheduleClose();
    } catch (error) {
      console.error('Error proposing meeting:', error);
      alert('Could not send meeting proposal. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  }, [scheduleSlots.length, handleScheduleClose]);

  // Sync perDateSchedule with selectedDates
  useEffect(() => {
    if (currentStep !== 'times') return;
    setPerDateSchedule((prev) => {
      const next: Record<string, Array<{ start: string; end: string }>> = {};
      selectedDates.forEach((d) => {
        const k = toLocalISODate(d);
        next[k] = prev[k] ?? [];
      });
      return next;
    });
  }, [selectedDates, currentStep]);

  // Auto-generate slots when time ranges change
  useEffect(() => {
    if (currentStep === 'times' && selectedDates.length > 0) {
      const newSlots = generateSlotsFromPerDateSchedule();
      setScheduleSlots(newSlots);
    }
  }, [perDateSchedule, selectedDates, currentStep, generateSlotsFromPerDateSchedule]);

  if (!isOpen) return null;

  const headerTitle = participant.name;
  const getUserRole = (participant: ChatParticipant) => {
    if (participant.title) return participant.title;
    if (participant.location) return participant.location;
    return '';
  };

  return (
    <div
      className="fixed w-[360px] max-w-[90vw] shadow-2xl"
      style={{
        right: position?.right ?? 0,
        left: position?.left,
        bottom: position?.bottom ?? 0,
        zIndex,
      }}
    >
      {/* Header */}
      <div className="bg-[#111111] border border-[#333333] rounded-t-xl px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer hover:bg-[#1a1a1a] rounded-lg p-1 transition-colors">
          <div className="relative">
            {participant.avatarUrl ? (
              <ImageWithFallback
                src={participant.avatarUrl}
                alt={participant.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#222222]" />
            )}
          </div>
          <div className="flex flex-col min-w-0 justify-center h-8">
            <div className="flex items-center gap-2 min-w-0 leading-none">
              <span className="text-white font-medium truncate hover:underline">{headerTitle}</span>
              {participant.isOnline && <span className="w-2 h-2 rounded-full bg-[#00ff00]" />}
              {participant.isPro && (
                <span className="text-[12px] text-white/90 font-semibold tracking-wide cursor-pointer hover:text-white transition-colors">
                  PRO
                </span>
              )}
            </div>
            {participant.title && (
              <span className="text-xs text-[#aaaaaa] truncate hover:text-white transition-colors leading-none">
                {getUserRole(participant)}
              </span>
            )}
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setMeetingModalOpen(true)}
            disabled={isScheduling}
            aria-label="Plan a call"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Plan Call</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#cccccc] hover:text-white rounded-md hover:bg-[#1a1a1a] transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plan Call Modal */}
      {scheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 handleScheduleClose();
               }
             }}
        >
          <div className="bg-[#0b0b0b] border border-[#2a2a2a] rounded-lg p-4 shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto max-w-[95vw]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#316afd] rounded-full"></div>
                <span className="text-sm font-medium text-white">Plan a Call</span>
              </div>
              <button 
                onClick={handleScheduleClose}
                className="text-[#888888] hover:text-white p-1 rounded hover:bg-[#1a1a1a] transition-colors"
                aria-label="Close scheduling modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Date Selection */}
            {currentStep === 'dates' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    selectedDates.length > 0 ? 'bg-[#316afd] text-white' : 'bg-[#333333] text-[#888888]'
                  }`}>
                    1
                  </div>
                  <span className={`text-sm font-medium ${selectedDates.length > 0 ? 'text-white' : 'text-[#888888]'}`}>
                    Select multiple days ({selectedDates.length} selected)
                  </span>
                  {selectedDates.length > 0 && <Check className="w-4 h-4 text-[#00ff00]" />}
                </div>

                {/* Calendar */}
                <div className="border border-[#2a2a2a] rounded-md">
                  <div className="flex items-center justify-between px-2 py-1 border-b border-[#2a2a2a]">
                    <button 
                      onClick={() => setCalendarMonth((m) => addMonths(m, -1))} 
                      className="p-1 text-[#cccccc] hover:text-white rounded hover:bg-[#161616] transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-white text-sm font-medium">{getMonthLabel(calendarMonth)}</div>
                    <button 
                      onClick={() => setCalendarMonth((m) => addMonths(m, 1))} 
                      className="p-1 text-[#cccccc] hover:text-white rounded hover:bg-[#161616] transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 p-2 text-[11px] text-[#aaaaaa]">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                      <div key={d} className="text-center">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 p-2 pt-0">
                    {getCalendarGrid(calendarMonth).map((d, index) => {
                      const isCurrentMonth = d.getMonth() === calendarMonth.getMonth();
                      const isSelected = selectedDates.some(selected => selected.toDateString() === d.toDateString());
                      const isToday = d.toDateString() === new Date().toDateString();
                      return (
                        <button
                          key={`calendar-day-${index}-${d.getTime()}`}
                          onClick={() => toggleDateSelection(d)}
                          className={`h-8 rounded text-sm relative transition-colors flex items-center justify-center ${
                            isSelected 
                              ? 'bg-[#316afd] text-white' 
                              : isToday
                              ? 'bg-[#333333] text-white border border-[#316afd]'
                              : isCurrentMonth 
                              ? 'text-white hover:bg-[#161616]' 
                              : 'text-[#666666] hover:bg-[#161616]'
                          }`}
                          aria-label={`Select ${d.toLocaleDateString()}`}
                        >
                          {d.getDate()}
                          {isToday && !isSelected && (
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#316afd] rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected dates */}
                {selectedDates.length > 0 && (
                  <div className="mt-3 p-2 bg-[#1a1a1a] rounded text-sm">
                    <div className="text-white font-medium mb-1">Selected dates:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedDates
                        .sort((a, b) => a.getTime() - b.getTime())
                        .map((date, index) => (
                          <div key={`selected-date-${index}-${date.getTime()}`} className="px-2 py-1 bg-[#333333] rounded text-xs text-white">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Next button */}
                <div className="flex justify-end mt-4">
                  <button
                    disabled={selectedDates.length === 0}
                    onClick={handleNextStep}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next: Set Time Ranges
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Time Selection */}
            {currentStep === 'times' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    scheduleSlots.length > 0 ? 'bg-[#316afd] text-white' : 'bg-[#333333] text-[#888888]'
                  }`}>
                    2
                  </div>
                  <span className={`text-sm font-medium ${scheduleSlots.length > 0 ? 'text-white' : 'text-[#888888]'}`}>
                    Set time ranges per selected date
                  </span>
                  {scheduleSlots.length > 0 && <Check className="w-4 h-4 text-[#00ff00]" />}
                </div>

                {/* Selected dates display */}
                <div className="mb-3 p-2 bg-[#1a1a1a] rounded text-sm text-white">
                  <div className="font-medium mb-1">Selected dates:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date, index) => (
                        <div key={`time-selected-date-${index}-${date.getTime()}`} className="px-2 py-1 bg-[#333333] rounded text-xs text-white">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Per-date schedule form */}
                <div className="space-y-3">
                  {selectedDates
                    .slice()
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, index) => {
                      const key = toLocalISODate(date);
                      const daySlots = perDateSchedule[key] ?? [];
                      
                      const timeSlots = [];
                      for (let hour = 9; hour <= 20; hour++) {
                        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                        const isSelected = daySlots.some(slot => slot.start === timeStr);
                        timeSlots.push({ time: timeStr, isSelected });
                      }
                      
                      return (
                        <div key={`per-date-schedule-${index}-${key}`} className="p-3 bg-[#1a1a1a] rounded">
                          <div className="text-sm font-medium text-white capitalize mb-3">
                            {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'long' })}
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {timeSlots.map((slot, slotIndex) => (
                              <button
                                key={`time-slot-${slotIndex}-${slot.time}`}
                                onClick={() => setPerDateSchedule(prev => {
                                  const currentSlots = prev[key] ?? [];
                                  const newSlot = { 
                                    start: slot.time, 
                                    end: `${(parseInt(slot.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00` 
                                  };
                                  
                                  if (slot.isSelected) {
                                    return {
                                      ...prev,
                                      [key]: currentSlots.filter(s => s.start !== slot.time)
                                    };
                                  } else {
                                    return {
                                      ...prev,
                                      [key]: [...currentSlots, newSlot]
                                    };
                                  }
                                })}
                                className={`px-3 py-2 text-xs rounded border transition-colors ${
                                  slot.isSelected 
                                    ? 'bg-[#316afd] text-white border-[#316afd]' 
                                    : 'bg-[#111111] text-white border-[#333333] hover:border-[#316afd] hover:bg-[#1a1a1a]'
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                          {daySlots.length > 0 && (
                            <div className="mt-2 text-xs text-[#88ff88]">
                              Selected: {daySlots.map(slot => `${slot.start}-${slot.end}`).join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Generated slots */}
                {scheduleSlots.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-[#00ff00] text-black">
                        ✓
                      </div>
                      <span className="text-sm font-medium text-white">Generated slots ({scheduleSlots.length})</span>
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto border border-[#2a2a2a] rounded-md p-2 space-y-1">
                      {scheduleSlots.map((slot, idx) => (
                        <div key={`generated-slot-${idx}-${slot.date.getTime()}-${slot.start}`} className="flex items-center justify-between text-sm bg-[#1a1a1a] rounded px-2 py-1">
                          <span className="text-xs">{formatSlot(slot)}</span>
                          <button
                            onClick={() => {
                              setScheduleSlots((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="text-[#ff6b6b] hover:text-white px-1 py-0.5 rounded text-xs transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#2a2a2a]">
                  <button 
                    onClick={handlePreviousStep}
                    className="px-3 py-2 text-sm text-[#cccccc] hover:text-white rounded-md hover:bg-[#161616] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={scheduleSlots.length === 0 || isScheduling}
                    onClick={handleScheduleProposal}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isScheduling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      `Send Proposal (${scheduleSlots.length} slot${scheduleSlots.length !== 1 ? 's' : ''})`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="bg-black border-x border-[#333333] max-h-[420px] h-[420px] overflow-y-auto p-3" ref={scrollRef}>
        <div className="flex flex-col gap-2">
          {messages.map((m, index) => {
            const isMe = m.senderId === currentUserId;
            
            return (
              <div key={`message-${m.id}-${index}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  isMe ? 'bg-[#316afd] text-white rounded-br-md' : 'bg-[#161616] text-[#e6e6e6] rounded-bl-md'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className={`mt-1 text-[10px] ${isMe ? 'text-blue-100/80' : 'text-[#999999]'}`}>
                    {formatTime(m.createdAt)}
                    {isMe && (
                      <span className="ml-1">
                        {m.status === 'sending' ? '· Sending' : m.status === 'error' ? '· Error' : '· Sent'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-[#161616] text-[#e6e6e6] rounded-2xl rounded-bl-md px-3 py-2 text-sm inline-flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="inline-block w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce" />
                <span className="inline-block w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          )}

          {/* Failed Messages Retry */}
          {failedMessages.length > 0 && onRetryFailedMessages && (
            <div className="px-3 py-2 bg-red-500/10 border-l-4 border-red-500 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-500">
                    {failedMessages.length} messages failed to send
                  </span>
                </div>
                <button
                  onClick={onRetryFailedMessages}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#161616] text-[#e6e6e6] rounded-2xl rounded-bl-md px-3 py-2 text-sm inline-flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="inline-block w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce" />
                <span className="inline-block w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="bg-[#0b0b0b] border border-[#333333] border-t-0 rounded-b-xl p-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActions((v) => !v)}
              className="p-2 text-[#cccccc] hover:text-white rounded-md hover:bg-[#121212] transition-colors"
              aria-label="More actions"
            >
              <Plus className="w-4 h-4" />
            </button>

            {showActions && (
              <div className="absolute bottom-10 left-0 bg-[#101010] border border-[#2a2a2a] rounded-lg p-1 shadow-xl flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 text-[#cccccc] hover:text-white rounded-md hover:bg-[#161616] transition-colors"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-[#cccccc] hover:text-white rounded-md hover:bg-[#161616] transition-colors"
                  aria-label="Attach image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message..."
              className="w-full bg-[#111111] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm resize-none outline-none focus:border-[#316afd] placeholder-[#666666]"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || isSending}
            className="p-2 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Send message"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Meeting Modal */}
      <MeetingModal
        isOpen={meetingModalOpen}
        onClose={() => setMeetingModalOpen(false)}
        currentUserId={currentUserId}
        participant={participant}
        onScheduled={(meeting) => {
          console.log('Meeting scheduled:', meeting);
          setMeetingModalOpen(false);
        }}
        onJoinCall={(roomId) => {
          setVideoCallRoomId(roomId);
          setVideoCallModalOpen(true);
          setMeetingModalOpen(false);
        }}
      />
      
      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        roomId={videoCallRoomId}
        currentUserId={currentUserId}
        participantName={participant.name}
        participantAvatar={participant.avatarUrl}
      />
    </div>
  );
}