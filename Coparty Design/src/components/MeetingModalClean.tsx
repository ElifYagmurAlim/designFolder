'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Globe, Check, AlertTriangle, Loader2, Plus, Users, Video } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type MeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  participant: { id: string; name: string };
  onScheduled: (meeting: any) => void;
  listOnly?: boolean;
};

export default function MeetingModal({ 
  isOpen, 
  onClose, 
  currentUserId, 
  participant, 
  onScheduled, 
  listOnly = false 
}: MeetingModalProps) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [submitting, setSubmitting] = useState(false);
  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<{date: Date, start: string, end: string}[]>([]);
  const [respondStep, setRespondStep] = useState<'dates' | 'times'>('dates');

  // Mock data
  const confirmedMeetings = [
    {
      id: '1',
      participantName: 'Sarah Johnson',
      participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      roomId: 'room1'
    },
    {
      id: '2',
      participantName: 'Alex Chen',
      participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      startAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 48 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      roomId: 'room2'
    }
  ];

  const pendingRequests = [
    {
      id: 'req1',
      participantName: 'Maria Garcia',
      participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      status: 'awaiting_recipient',
      createdBy: 'user456',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      slotsCreator: [
        { startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), endAt: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString() },
        { startAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), endAt: new Date(Date.now() + 48 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString() }
      ]
    },
    {
      id: 'req2',
      participantName: 'David Kim',
      participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
      status: 'awaiting_creator',
      createdBy: currentUserId,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      slotsCreator: []
    }
  ];

  const timezones = [
    'UTC',
    'Europe/Istanbul', 
    'Europe/Berlin',
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo'
  ];

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const formatMeetingTimeRange = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const dateStr = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    const startTimeStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const endTimeStr = end.toLocaleTimeString('en-US', {
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr}, ${startTimeStr} – ${endTimeStr}`;
  };

  const formatRequestStatus = (status: string, createdBy: string) => {
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
        return { text: 'Meeting confirmed', color: 'text-[#00d084]' };
      case 'cancelled':
        return { text: 'Meeting cancelled', color: 'text-[#ff6b6b]' };
      default:
        return { text: status, color: 'text-[#999999]' };
    }
  };

  const canSubmit = startDate && startTime && endDate && endTime && !submitting;

  const handleCreateMeeting = async () => {
    if (!canSubmit) return;
    
    setSubmitting(true);
    try {
      // Simulate meeting creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const meeting = {
        id: Date.now().toString(),
        roomId: `room-${Date.now()}`,
        startAt: `${startDate}T${startTime}:00.000Z`,
        endAt: `${endDate}T${endTime}:00.000Z`,
        status: 'pending' as const
      };
      
      onScheduled(meeting);
      onClose();
    } catch (error) {
      console.error('Meeting creation failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespondOpen = (requestId: string) => {
    setRespondingRequestId(requestId);
    setRespondStep('dates');

    // Preselect creator's proposed days
    const request = pendingRequests.find(r => r.id === requestId);
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
    setTimeSlots([]);
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

  const handleSendResponse = async () => {
    try {
      // Simulate response sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Response sent with slots:', timeSlots);
      handleRespondClose();
    } catch (error) {
      console.error('Failed to send response:', error);
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
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#333333]">
            <div className="flex items-center gap-3">
              {!listOnly && participant && (
                <>
                  <div className="w-11 h-11 rounded-lg bg-[#333333] flex items-center justify-center text-white font-bold">
                    {participant.name?.[0] || '?'}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">{participant.name}</h2>
                    <p className="text-[#aaaaaa] text-sm">Schedule a meeting</p>
                  </div>
                </>
              )}
              {listOnly && (
                <div>
                  <h2 className="text-xl font-semibold text-white">Meetings</h2>
                  <p className="text-[#aaaaaa] text-sm">Your confirmed meetings and requests</p>
                </div>
              )}
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-[#cccccc] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
            {/* Confirmed Meetings */}
            <section>
              <h3 className="text-[#aaaaaa] text-[12px] uppercase tracking-wide mb-2">Meetings</h3>
              {confirmedMeetings.length === 0 ? (
                <div className="text-center py-8 text-[#aaaaaa]">No confirmed meetings.</div>
              ) : (
                <div className="space-y-4">
                  {confirmedMeetings.map((meeting) => (
                    <div key={meeting.id} className="bg-[#111111] border border-[#333333] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={meeting.participantAvatar}
                            alt={meeting.participantName}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="text-white font-semibold">{meeting.participantName}</h4>
                            <p className="text-[#999999] text-sm">
                              {formatMeetingTimeRange(meeting.startAt, meeting.endAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-[#316afd] hover:bg-[#3a76ff] text-white px-3 py-1 rounded-lg text-sm transition-colors">
                            Join Call
                          </button>
                          <button className="bg-[#333333] hover:bg-[#444444] text-white px-3 py-1 rounded-lg text-sm transition-colors">
                            Add to Calendar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Pending Requests */}
            <section>
              <h3 className="text-[#aaaaaa] text-[12px] uppercase tracking-wide mb-2">Requests</h3>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-[#aaaaaa]">No requests.</div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => {
                    const status = formatRequestStatus(request.status, request.createdBy);
                    
                    return (
                      <div key={request.id} className="bg-[#111111] border border-[#333333] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={request.participantAvatar}
                              alt={request.participantName}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <h4 className="text-white font-semibold">{request.participantName}</h4>
                              <p className={`text-sm font-medium ${status.color}`}>
                                Status: {status.text}
                              </p>
                              <p className="text-[#666666] text-xs">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.status !== 'confirmed' && request.createdBy !== currentUserId && (
                              <button
                                onClick={() => handleRespondOpen(request.id)}
                                className="px-3 py-2 rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white border border-[#333333] transition-colors text-sm font-medium"
                              >
                                Respond
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                        timeSlots.length > 0 ? 'bg-[#316afd] text-white' : 'bg-[#333333] text-[#888888]'
                      }`}>2</div>
                      <span className={`text-sm font-medium ${timeSlots.length > 0 ? 'text-white' : 'text-[#888888]'}`}>
                        Set time slots per selected date
                      </span>
                      {timeSlots.length > 0 && <Check className="w-4 h-4 text-[#00ff00]" />}
                    </div>

                    {/* Selected dates display */}
                    <div className="p-2 bg-[#1a1a1a] rounded text-sm text-white">
                      <div className="font-medium mb-1">Selected dates:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedDates
                          .sort((a, b) => a.getTime() - b.getTime())
                          .map((date, index) => (
                            <div key={index} className="px-2 py-1 bg-[#333333] rounded text-xs">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Time slot form for each date */}
                    <div className="space-y-3">
                      {selectedDates
                        .slice()
                        .sort((a, b) => a.getTime() - b.getTime())
                        .map((date, index) => {
                          const existingSlot = timeSlots.find(slot => slot.date.toDateString() === date.toDateString());
                          
                          return (
                            <div key={index} className="p-3 bg-[#1a1a1a] rounded-lg">
                              <div className="text-sm font-medium text-white capitalize mb-3">
                                {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'long' })}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-[#999999] mb-1">Start time</label>
                                  <input 
                                    type="time"
                                    value={existingSlot?.start || ''}
                                    onChange={(e) => {
                                      const newSlots = timeSlots.filter(slot => slot.date.toDateString() !== date.toDateString());
                                      if (e.target.value && existingSlot?.end) {
                                        newSlots.push({ date, start: e.target.value, end: existingSlot.end });
                                      }
                                      setTimeSlots(newSlots);
                                    }}
                                    className="w-full bg-[#333333] border border-[#555] rounded px-2 py-1.5 text-white text-sm outline-none focus:border-[#316afd] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-[#999999] mb-1">End time</label>
                                  <input 
                                    type="time"
                                    value={existingSlot?.end || ''}
                                    onChange={(e) => {
                                      const newSlots = timeSlots.filter(slot => slot.date.toDateString() !== date.toDateString());
                                      if (e.target.value && existingSlot?.start) {
                                        newSlots.push({ date, start: existingSlot.start, end: e.target.value });
                                      }
                                      setTimeSlots(newSlots);
                                    }}
                                    className="w-full bg-[#333333] border border-[#555] rounded px-2 py-1.5 text-white text-sm outline-none focus:border-[#316afd] transition-colors"
                                  />
                                </div>
                              </div>
                              
                              {existingSlot && (
                                <div className="mt-2 text-xs text-[#00ff00]">
                                  Selected: {existingSlot.start} - {existingSlot.end}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Generated slots summary */}
                    {timeSlots.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-[#00ff00] text-black">✓</div>
                          <span className="text-sm font-medium text-white">Available slots ({timeSlots.length})</span>
                        </div>
                        <div className="max-h-32 overflow-y-auto border border-[#333333] rounded p-2 space-y-1">
                          {timeSlots.map((slot, i) => (
                            <div key={i} className="flex items-center justify-between text-sm bg-[#1a1a1a] rounded px-2 py-1">
                              <span className="text-xs text-white">
                                {slot.date.toLocaleDateString()} • {slot.start}-{slot.end}
                              </span>
                              <button 
                                onClick={() => setTimeSlots(prev => prev.filter((_, idx) => idx !== i))} 
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
                    <div className="flex items-center gap-2 pt-2 border-t border-[#333333]">
                      <button 
                        onClick={() => setRespondStep('dates')} 
                        className="px-3 py-2 text-sm text-[#cccccc] hover:text-white rounded-md hover:bg-[#161616] transition-colors"
                      >
                        Back
                      </button>
                      <button
                        disabled={timeSlots.length === 0}
                        onClick={handleSendResponse}
                        className="flex-1 px-3 py-2 text-sm font-medium rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Send Response ({timeSlots.length} slot{timeSlots.length !== 1 ? 's' : ''})
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Meeting Creation Form */}
            {!listOnly && (
              <section>
                <h3 className="text-[#aaaaaa] text-[12px] uppercase tracking-wide mb-4">Schedule New Meeting</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#999999] mb-1">Start date</label>
                      <div className="flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-md px-2 py-1.5">
                        <Calendar className="w-4 h-4 text-[#888888]" />
                        <input 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => setStartDate(e.target.value)} 
                          className="bg-transparent text-white text-sm outline-none flex-1" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#999999] mb-1">Start time</label>
                      <div className="flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-md px-2 py-1.5">
                        <Clock className="w-4 h-4 text-[#888888]" />
                        <input 
                          type="time" 
                          value={startTime} 
                          onChange={(e) => setStartTime(e.target.value)} 
                          className="bg-transparent text-white text-sm outline-none flex-1" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#999999] mb-1">End date</label>
                      <div className="flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-md px-2 py-1.5">
                        <Calendar className="w-4 h-4 text-[#888888]" />
                        <input 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => setEndDate(e.target.value)} 
                          className="bg-transparent text-white text-sm outline-none flex-1" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#999999] mb-1">End time</label>
                      <div className="flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-md px-2 py-1.5">
                        <Clock className="w-4 h-4 text-[#888888]" />
                        <input 
                          type="time" 
                          value={endTime} 
                          onChange={(e) => setEndTime(e.target.value)} 
                          className="bg-transparent text-white text-sm outline-none flex-1" 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#999999] mb-1">Timezone</label>
                    <div className="flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-md px-2 py-1.5">
                      <Globe className="w-4 h-4 text-[#888888]" />
                      <select 
                        value={timezone} 
                        onChange={(e) => setTimezone(e.target.value)} 
                        className="bg-transparent text-white text-sm outline-none flex-1"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz} className="bg-[#0b0b0b]">{tz}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[10px] text-[#666666] mt-1">
                      Your timezone: {userTimezone} • Meeting times will be converted for storage
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button 
                      onClick={onClose} 
                      className="px-3 py-2 text-sm text-[#cccccc] hover:text-white rounded-md hover:bg-[#1a1a1a] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={!canSubmit} 
                      onClick={handleCreateMeeting} 
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[#316afd] hover:bg-[#3a76ff] text-white disabled:opacity-50 transition-colors"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Propose Meeting
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}