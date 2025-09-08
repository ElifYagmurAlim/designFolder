import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Video, Mic, MicOff, VideoOff, MonitorUp, MonitorOff, PhoneOff, 
  Wifi, AlertCircle, RefreshCw, Maximize2, Minimize2, User, Clock, Signal 
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type VideoCallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  currentUserId: string;
  participantName?: string;
  participantAvatar?: string;
};

type ConnectionStatus = 'initializing' | 'connecting' | 'connected' | 'disconnected' | 'error';

export default function VideoCallModal({ 
  isOpen, 
  onClose, 
  roomId, 
  currentUserId, 
  participantName = 'Participant', 
  participantAvatar 
}: VideoCallModalProps) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('initializing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [participantCount, setParticipantCount] = useState(1);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteConnected, setRemoteConnected] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Call duration timer
  useEffect(() => {
    if (callStartTime && connectionStatus === 'connected') {
      durationIntervalRef.current = setInterval(() => {
        const duration = Math.floor((Date.now() - callStartTime) / 1000);
        setCallDuration(duration);
      }, 1000);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [callStartTime, connectionStatus]);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [isFullscreen]);

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get connection status color
  const getConnectionStatusColor = (status: ConnectionStatus): string => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Get connection status icon
  const getConnectionStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return <Signal className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  const handleClose = useCallback(async () => {
    // Cleanup media stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    setCallStartTime(null);
    setConnectionStatus('initializing');
    setErrorMessage(null);
    setCallDuration(0);
    setParticipantCount(1);
    setRemoteConnected(false);
    onClose();
  }, [localStream, onClose]);

  const handleRetry = useCallback(async () => {
    setErrorMessage(null);
    setConnectionStatus('connecting');
    setIsConnecting(true);
    
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: camOn, 
        audio: micOn 
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setConnectionStatus('connected');
      setCallStartTime(Date.now());
      
      // Simulate remote participant joining after a delay
      setTimeout(() => {
        setRemoteConnected(true);
        setParticipantCount(2);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to initialize video call:', error);
      setConnectionStatus('error');
      setErrorMessage('Failed to access camera or microphone. Please check your permissions.');
    } finally {
      setIsConnecting(false);
    }
  }, [camOn, micOn]);

  // Initialize video call on mount
  useEffect(() => {
    if (!isOpen) return;

    const initializeVideoCall = async () => {
      try {
        setIsConnecting(true);
        setConnectionStatus('connecting');
        
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia is not supported in this browser');
        }
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: camOn, 
            audio: micOn 
          });
          
          setLocalStream(stream);
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          setConnectionStatus('connected');
          setCallStartTime(Date.now());
          
          // Simulate remote participant joining
          setTimeout(() => {
            setRemoteConnected(true);
            setParticipantCount(2);
          }, 2000);
        } catch (mediaError) {
          // Handle media access errors gracefully
          console.warn('Media access denied, continuing in demo mode:', mediaError);
          setConnectionStatus('connected');
          setCallStartTime(Date.now());
          
          // Continue without actual media stream for demo purposes
          setTimeout(() => {
            setRemoteConnected(true);
            setParticipantCount(2);
          }, 2000);
        }
        
      } catch (error) {
        console.error('Failed to initialize video call:', error);
        setConnectionStatus('error');
        
        let errorMessage = 'Failed to start video call. Continuing in demo mode - some features may be limited.';
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera/microphone access denied. Demo mode active - controls available but no actual media stream.';
          } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera/microphone found. Demo mode active - you can still test the interface.';
          } else if (error.name === 'NotReadableError') {
            errorMessage = 'Camera/microphone busy. Demo mode active - device may be in use by another app.';
          } else if (error.name === 'SecurityError') {
            errorMessage = 'Security error. Demo mode active - HTTPS may be required for media access.';
          }
        }
        
        setErrorMessage(errorMessage);
      } finally {
        setIsConnecting(false);
      }
    };

    initializeVideoCall();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, camOn, micOn]);

  // Toggle camera
  const toggleCamera = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !camOn;
      }
    }
    setCamOn(!camOn);
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
      }
    }
    setMicOn(!micOn);
  };

  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    try {
      if (!screenSharing) {
        // Check if getDisplayMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          console.warn('Screen sharing not supported in this browser');
          return;
        }
        
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
          setLocalStream(screenStream);
          setScreenSharing(true);
        }
        
        // Handle when user stops sharing via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          // Revert to camera (with fallback)
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: camOn, audio: micOn })
              .then(stream => {
                setLocalStream(stream);
                if (localVideoRef.current) {
                  localVideoRef.current.srcObject = stream;
                }
              })
              .catch(err => {
                console.warn('Could not revert to camera after screen sharing:', err);
                setLocalStream(null);
              });
          }
        };
      } else {
        // Stop screen sharing and revert to camera
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
        
        // Try to revert to camera with fallback
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: camOn, 
              audio: micOn 
            });
            
            setLocalStream(stream);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        } catch (mediaError) {
          console.warn('Could not access camera after stopping screen share:', mediaError);
          setLocalStream(null);
        }
        
        setScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen sharing:', error);
      // Don't change the screenSharing state if there was an error
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-[220] flex items-center justify-center ${isFullscreen ? 'bg-black' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {!isFullscreen && <div className="absolute inset-0 bg-black/80" onClick={handleClose} />}
        <motion.div
          className={`relative bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl shadow-2xl ${
            isFullscreen ? 'w-full h-full rounded-none border-0' : 'w-full max-w-6xl mx-4 p-4'
          }`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header Bar */}
          <div className={`flex items-center justify-between mb-4 ${isFullscreen ? 'p-4' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 ${getConnectionStatusColor(connectionStatus)}`}>
                  {getConnectionStatusIcon(connectionStatus)}
                  <span className="text-sm font-medium capitalize">{connectionStatus}</span>
                </div>
              </div>
              
              {callStartTime && (
                <div className="flex items-center gap-1 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono">{formatDuration(callDuration)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-white">
                <User className="w-4 h-4" />
                <span className="text-sm">{participantName}</span>
                {participantAvatar && (
                  <ImageWithFallback 
                    src={participantAvatar} 
                    alt={participantName} 
                    className="w-6 h-6 rounded-full object-cover" 
                  />
                )}
              </div>

              {/* Participant Count */}
              <div className="flex items-center gap-1 text-[#aaaaaa]">
                <span className="text-xs">Participants:</span>
                <span className="text-xs font-mono">{participantCount}/2</span>
              </div>

              {/* Network Quality Indicator */}
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  networkQuality === 'excellent' ? 'bg-green-400' :
                  networkQuality === 'good' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-xs text-[#aaaaaa] capitalize">{networkQuality}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {errorMessage && (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                  disabled={isConnecting}
                >
                  <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
                  Retry
                </button>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="p-2 text-[#cccccc] hover:text-white rounded-md hover:bg-[#121212] transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              
              {!isFullscreen && (
                <button
                  onClick={handleClose}
                  className="p-2 text-[#cccccc] hover:text-white rounded-md hover:bg-[#121212] transition-colors"
                  title="Close call"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            </motion.div>
          )}

          {/* Video Grid */}
          <div className={`grid gap-4 ${
            isFullscreen 
              ? 'grid-cols-1 md:grid-cols-2 h-[calc(100vh-200px)]' 
              : 'grid-cols-1 md:grid-cols-2 h-96'
          }`}>
            {/* Local Video */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video 
                ref={localVideoRef} 
                className="w-full h-full object-cover transform scale-x-[-1]" 
                autoPlay 
                playsInline 
                muted 
              />
              {!camOn && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                You {screenSharing && '(Screen)'}
              </div>
            </div>
            
            {/* Remote Video */}
            <div className="relative bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden">
              {remoteConnected ? (
                <div className="w-full h-full flex items-center justify-center">
                  {/* Simulate remote video with a placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-[#333333] to-[#111111] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2 mx-auto">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-sm">{participantName}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#777777]">
                  <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2">
                    <User className="w-8 h-8" />
                  </div>
                  <span className="text-sm">
                    {isConnecting ? 'Connecting...' : 'Waiting for other participant...'}
                  </span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {participantName}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className={`mt-4 flex items-center justify-center gap-3 ${isFullscreen ? 'absolute bottom-4 left-1/2 transform -translate-x-1/2' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <button 
                  onClick={toggleMicrophone} 
                  className={`p-3 border border-[#2a2a2a] text-white rounded-full transition-all duration-200 hover:scale-105 ${
                    micOn ? 'bg-[#111111] hover:bg-[#161616]' : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={isConnecting}
                  title={micOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                <button 
                  onClick={toggleCamera} 
                  className={`p-3 border border-[#2a2a2a] text-white rounded-full transition-all duration-200 hover:scale-105 ${
                    camOn ? 'bg-[#111111] hover:bg-[#161616]' : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={isConnecting}
                  title={camOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                
                <button 
                  onClick={toggleScreenSharing}
                  className={`p-3 border border-[#2a2a2a] text-white rounded-full transition-all duration-200 hover:scale-105 ${
                    screenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#111111] hover:bg-[#161616]'
                  }`}
                  disabled={isConnecting}
                  title={screenSharing ? 'Stop screen sharing' : 'Start screen sharing'}
                >
                  {screenSharing ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
                </button>
                
                <button 
                  onClick={handleClose}
                  className="p-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all duration-200 hover:scale-105"
                  disabled={isConnecting}
                  title="End call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}