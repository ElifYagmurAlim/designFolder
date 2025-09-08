import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Timezone utility functions
function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function formatMeetingTime(utcTime: string, userTimezone: string): string {
  try {
    return new Date(utcTime).toLocaleString('en-US', {
      timeZone: userTimezone,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return new Date(utcTime).toLocaleString();
  }
}

function formatMeetingTimeRange(startTime: string, endTime: string, userTimezone: string): string {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const dateStr = start.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      month: 'short',
      day: 'numeric'
    });
    
    const startTimeStr = start.toLocaleTimeString('en-US', {
      timeZone: userTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const endTimeStr = end.toLocaleTimeString('en-US', {
      timeZone: userTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr}, ${startTimeStr} – ${endTimeStr}`;
  } catch {
    return `${formatMeetingTime(startTime, userTimezone)} - ${formatMeetingTime(endTime, userTimezone)}`;
  }
}

function formatRequestStatus(status: string, createdBy: string, currentUserId: string): { text: string; color: string } {
  switch (status) {
    case 'awaiting_recipient':
      return {
        text: createdBy === currentUserId ? 'Waiting for response' : 'You need to respond',
        color: createdBy === currentUserId ? 'text-[#ffa500]' : 'text-[#ff6b6b]'
      };
    case 'awaiting_creator':
      return {
        text: createdBy === currentUserId ? 'You need to respond' : 'Waiting for response',
        color: createdBy === currentUserId ? 'text-[#ff6b6b]' : 'text-[#ffa500]'
      };
    case 'confirmed':
      return {
        text: 'Meeting confirmed',
        color: 'text-[#00d084]'
      };
    case 'cancelled':
      return {
        text: 'Meeting cancelled',
        color: 'text-[#ff6b6b]'
      };
    default:
      return {
        text: status,
        color: 'text-[#999999]'
      };
  }
}

type MeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  participant: { id: string; name: string; avatarUrl?: string };
  onScheduled?: (meeting: any) => void;
  onJoinCall?: (roomId: string) => void;
  listOnly?: boolean;
};

export default function MeetingModal({ 
  isOpen, 
  onClose, 
  currentUserId, 
  participant, 
  onScheduled,
  onJoinCall,
  listOnly = false
}: MeetingModalProps) {
  const [userTimezone] = useState<string>(getUserTimezone());
  const [error, setError] = useState<string | null>(null);
  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{date: Date, time: string}[]>([]);
  const [respondStep, setRespondStep] = useState<'dates' | 'times'>('dates');

  // Sample confirmed meetings
  const [confirmedMeetings] = useState([
    {
      id: 'meeting1',
      startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      endAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      roomId: 'room123',
      otherUser: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
        role: 'Product Manager',
        isOnline: true,
        isPro: true
      }
    },
    {
      id: 'meeting2',
      startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      roomId: 'room456',
      otherUser: {
        id: 'user2',
        name: 'Alex Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
        role: 'ML Engineer',
        isOnline: false,
        isPro: false
      }
    }
  ]);

  // Sample pending requests
  const [pendingRequests] = useState([
    {
      id: 'request1',
      status: 'awaiting_recipient',
      createdBy: 'user3',
      recipientId: currentUserId,
      otherUser: {
        id: 'user3',
        name: 'Mia Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
        role: 'Music Producer',
        isOnline: true,
        isPro: true
      },
      slotsCreator: [
        {
          startAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          endAt: new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString()
        },
        {
          startAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          endAt: new Date(Date.now() + 73 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ]);

  function toGCalDate(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    const mm = pad(d.getUTCMonth() + 1);
    const dd = pad(d.getUTCDate());
    const hh = pad(d.getUTCHours());
    const min = pad(d.getUTCMinutes());
    const ss = pad(d.getUTCSeconds());
    return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
  }

  function buildGoogleCalendarUrl(m: any) {
    const start = toGCalDate(m.startAt);
    const end = toGCalDate(m.endAt);
    const text = encodeURIComponent('Video Call');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}%2F${end}`;
  }

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setRespondingRequestId(null);
      setSelectedDates([]);
      setSelectedTimeSlots([]);
      setRespondStep('dates');
    }
  }, [isOpen]);

  const handleRespondOpen = (requestId: string, request: any) => {
    setRespondingRequestId(requestId);
    setRespondStep('dates');

    // Preselect creator's proposed days
    if (request?.slotsCreator) {
      const uniqueDays = Array.from(
        new Map(
          request.slotsCreator.map((s: any) => {
            const d = new Date(s.startAt);
            const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
            return [key, new Date(d.getFullYear(), d.getMonth(), d.getDate())] as const;
          })
        ).values()
      ) as Date[];
      setSelectedDates(uniqueDays);
    }
  };

  const handleRespondClose = () => {
    setRespondingRequestId(null);
    setRespondStep('dates');
    setSelectedDates([]);
    setSelectedTimeSlots([]);
  };

  const toggleDateSelection = (date: Date) => {
    const dateStr = date.toDateString();
    const isSelected = selectedDates.some(d => d.toDateString() === dateStr);
    
    if (isSelected) {
      setSelectedDates(prev => prev.filter(d => d.toDateString() !== dateStr));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  };

  // Available time slots for scheduling
  const availableTimeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  const toggleTimeSlot = (date: Date, time: string) => {
    const exists = selectedTimeSlots.some(slot => 
      slot.date.toDateString() === date.toDateString() && slot.time === time
    );
    
    if (exists) {
      // Remove the selected slot for this date
      setSelectedTimeSlots(prev => prev.filter(slot => 
        !(slot.date.toDateString() === date.toDateString() && slot.time === time)
      ));
    } else {
      // Replace any existing slot for this date with the new one (one slot per day)
      setSelectedTimeSlots(prev => [
        ...prev.filter(slot => slot.date.toDateString() !== date.toDateString()),
        { date, time }
      ]);
    }
  };

  const getEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSendResponse = async () => {
    try {
      // Simulate response sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Response sent with slots:', selectedTimeSlots);
      handleRespondClose();
    } catch (error) {
      console.error('Failed to send response:', error);
      setError('Failed to send response');
    }
  };

  if (!isOpen) return null;

  const activeRequest = pendingRequests.find(r => r.id === respondingRequestId);

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
          className="relative bg-[#0b0b0b] border border-[#333333] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 text-[#cccccc] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors z-10" 
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 border-b border-[#333333] mb-0">
            <h2 className="text-xl font-semibold text-white">Meetings</h2>
            <p className="text-[#aaaaaa] text-sm">Your confirmed meetings and requests.</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 mx-6 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
            <section>
              <h3 className="text-[#aaaaaa] text-[12px] uppercase tracking-wide mb-2">Meetings</h3>
              {confirmedMeetings.length === 0 ? (
                <div className="text-center py-8 text-[#888888]">No confirmed meetings.</div>
              ) : (
                <ul className="space-y-4">
                  {confirmedMeetings.map((m) => (
                    <li key={m.id} className="bg-[#111111] border border-[#333333] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {m.otherUser?.avatarUrl ? (
                              <ImageWithFallback
                                src={m.otherUser.avatarUrl}
                                alt={m.otherUser.name || 'User'}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-[#333333] rounded-lg flex items-center justify-center text-white font-semibold">
                                {m.otherUser?.name?.charAt(0) || '?'}
                              </div>
                            )}
                            {/* Online dot */}
                            {m.otherUser?.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00ff00] border-2 border-black rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-semibold">
                                {m.otherUser?.name || 'Unknown User'}
                              </h4>
                              {m.otherUser?.isPro && (
                                <span className="bg-gradient-to-r from-[#316afd] to-[#4a90ff] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                  PRO
                                </span>
                              )}
                            </div>
                            <p className="text-[#999999] text-sm mb-1">
                              {m.otherUser?.role}
                            </p>
                            <p className="text-[#999999] text-sm">
                              {formatMeetingTimeRange(m.startAt, m.endAt, userTimezone)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onJoinCall?.(m.roomId)}
                            className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            Join
                          </button>
                          <a
                            href={buildGoogleCalendarUrl(m)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#333333] hover:bg-[#444444] text-white px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            Add to Calendar
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="text-[#aaaaaa] text-[12px] uppercase tracking-wide mb-2">Requests</h3>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-[#888888]">No requests.</div>
              ) : (
                <ul className="space-y-4">
                  {pendingRequests.map((r) => {
                    const otherId = r.createdBy === currentUserId ? r.recipientId : r.createdBy;
                    const other = r.otherUser;
                    const status = formatRequestStatus(r.status, r.createdBy, currentUserId);
                    
                    return (
                      <li key={r.id} className="py-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#222222] border border-[#333333] flex items-center justify-center relative flex-shrink-0">
                          {other?.avatarUrl ? (
                            <ImageWithFallback 
                              src={other.avatarUrl} 
                              alt={other?.name || 'User'} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-white">
                              {(other?.name || '?')?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          {/* Online dot */}
                          {other?.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00ff00] border-2 border-black rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-white font-bold leading-tight truncate">
                              {other?.name || 'Participant'}
                            </p>
                            {other?.isPro && (
                              <span className="bg-gradient-to-r from-[#316afd] to-[#4a90ff] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#999999] font-medium truncate">
                            {other?.role} • Status: <span className={`font-semibold ${status.color}`}>{status.text}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.status !== 'confirmed' && r.createdBy !== currentUserId && (
                            <button 
                              onClick={() => handleRespondOpen(r.id, r)}
                              className="px-3 py-2 rounded-md bg-[#111111] hover:bg-[#00ff00] text-white border border-[#333333] transition-colors text-sm"
                            >
                              Respond
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Response Flow */}
            {respondingRequestId && activeRequest && (
              <section className="border border-[#333333] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Respond to meeting request</h4>
                  <button 
                    onClick={handleRespondClose}
                    className="text-[#888888] hover:text-white p-1 rounded hover:bg-[#1a1a1a] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Step 1: Select Dates */}
                {respondStep === 'dates' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        selectedDates.length > 0 ? 'bg-[#316afd] text-white' : 'bg-[#333333] text-[#888888]'
                      }`}>1</div>
                      <span className={`text-sm font-medium ${selectedDates.length > 0 ? 'text-white' : 'text-[#888888]'}`}>
                        Select days ({selectedDates.length} selected)
                      </span>
                      {selectedDates.length > 0 && <Check className="w-4 h-4 text-[#00ff00]" />}
                    </div>

                    {/* Creator's proposed days */}
                    {activeRequest.slotsCreator && activeRequest.slotsCreator.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs text-[#999999]">Creator's proposed days</div>
                        <div className="grid grid-cols-1 gap-2">
                          {Array.from(new Map(activeRequest.slotsCreator.map((s: any) => {
                            const d = new Date(s.startAt);
                            const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                            return [day.toDateString(), day] as const;
                          })).values()).map((date, i) => {
                            const dateObj = date as Date;
                            const isSelected = selectedDates.some(d => d.toDateString() === dateObj.toDateString());
                            return (
                              <label key={i} className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                                isSelected ? 'border-[#316afd] bg-[#11151f]' : 'border-[#333333] bg-[#0f0f0f] hover:border-[#555]'
                              }`}>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleDateSelection(dateObj)}
                                    className="w-4 h-4 text-[#316afd] bg-[#333333] border-[#333333] rounded focus:ring-[#316afd]"
                                  />
                                  <span className="text-sm text-white">
                                    {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Selected dates display */}
                    {selectedDates.length > 0 && (
                      <div className="p-2 bg-[#1a1a1a] rounded text-sm">
                        <div className="text-white font-medium mb-1">Selected dates:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedDates
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((date, index) => (
                              <div key={index} className="px-2 py-1 bg-[#333333] rounded text-xs text-white">
                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Next button */}
                    <div className="flex justify-end">
                      <button
                        disabled={selectedDates.length === 0}
                        onClick={() => setRespondStep('times')}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next: Set Time Ranges
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Time Slots */}
                {respondStep === 'times' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        selectedTimeSlots.length > 0 ? 'bg-[#316afd] text-white' : 'bg-[#333333] text-[#888888]'
                      }`}>2</div>
                      <span className={`text-sm font-medium ${selectedTimeSlots.length > 0 ? 'text-white' : 'text-[#888888]'}`}>
                        Select available time slots
                      </span>
                      {selectedTimeSlots.length > 0 && <Check className="w-4 h-4 text-[#00ff00]" />}
                    </div>

                    {/* Time slot grid for each date */}
                    <div className="space-y-6">
                      {selectedDates
                        .slice()
                        .sort((a, b) => a.getTime() - b.getTime())
                        .map((date, index) => {
                          const selectedSlot = selectedTimeSlots.find(slot => 
                            slot.date.toDateString() === date.toDateString()
                          );
                          
                          return (
                            <div key={index} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="text-white font-medium capitalize">
                                  {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'long' })}
                                </div>
                              </div>
                              
                              {/* Time slots grid */}
                              <div className="grid grid-cols-4 gap-2">
                                {availableTimeSlots.map((time) => {
                                  const isSelected = selectedSlot?.time === time;
                                  
                                  return (
                                    <button
                                      key={time}
                                      onClick={() => toggleTimeSlot(date, time)}
                                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isSelected 
                                          ? 'bg-[#316afd] text-white border border-[#316afd] shadow-lg' 
                                          : 'bg-[#111111] text-[#cccccc] border border-[#333333] hover:border-[#555555] hover:bg-[#1a1a1a]'
                                      }`}
                                    >
                                      {time}
                                    </button>
                                  );
                                })}
                              </div>
                              
                              {/* Selected time display */}
                              {selectedSlot && (
                                <div className="text-sm text-[#00ff00] font-medium">
                                  Selected: {selectedSlot.time} - {getEndTime(selectedSlot.time)} (one slot per day)
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Generated slots summary */}
                    {selectedTimeSlots.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-[#00ff00] text-black">✓</div>
                          <span className="text-sm font-medium text-white">Generated slots ({selectedTimeSlots.length})</span>
                        </div>
                        <div className="max-h-32 overflow-y-auto border border-[#333333] rounded p-2 space-y-1">
                          {selectedTimeSlots
                            .sort((a, b) => {
                              const dateCompare = a.date.getTime() - b.date.getTime();
                              if (dateCompare !== 0) return dateCompare;
                              return a.time.localeCompare(b.time);
                            })
                            .map((slot, i) => (
                            <div key={i} className="flex items-center justify-between text-sm bg-[#1a1a1a] rounded px-2 py-1">
                              <span className="text-xs text-white">
                                {slot.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} • {slot.time}-{getEndTime(slot.time)}
                              </span>
                              <button 
                                onClick={() => toggleTimeSlot(slot.date, slot.time)} 
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
                    <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#333333]">
                      <button 
                        onClick={() => setRespondStep('dates')} 
                        className="px-6 py-2 text-sm text-[#cccccc] hover:text-white rounded-md hover:bg-[#161616] transition-colors"
                      >
                        Back
                      </button>
                      <button
                        disabled={selectedTimeSlots.length === 0}
                        onClick={handleSendResponse}
                        className="px-6 py-2 text-sm font-medium rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Send Response
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}