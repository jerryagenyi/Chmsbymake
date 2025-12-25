import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Pause, Play, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface VoiceInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  language?: string;
  continuous?: boolean;
  autoSend?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  placeholder = 'Click to speak...',
  language = 'en-US',
  continuous = true,
  autoSend = false,
  onStart,
  onStop,
  onError,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<any>(null);
  const volumeIntervalRef = useRef<number | null>(null);

  // Check if browser supports speech recognition
  const isSpeechRecognitionSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      setError('Speech recognition is not supported in your browser');
      onError?.('Speech recognition not supported');
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      onStart?.();
      
      // Simulate volume animation
      volumeIntervalRef.current = window.setInterval(() => {
        setVolume(Math.random() * 100);
      }, 100);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterim('');
      onStop?.();
      
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        setVolume(0);
      }
    };

    recognition.onerror = (event: any) => {
      const errorMessage = `Speech recognition error: ${event.error}`;
      setError(errorMessage);
      setIsListening(false);
      onError?.(errorMessage);
      
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        setVolume(0);
      }
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setInterim(interimTranscript);

      if (finalTranscript) {
        const newText = value + finalTranscript;
        onChange(newText);
        
        if (autoSend && !continuous) {
          recognition.stop();
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    };
  }, [isSpeechRecognitionSupported, language, continuous, autoSend, value, onChange, onStart, onStop, onError]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError('Failed to start speech recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearText = () => {
    onChange('');
    setInterim('');
  };

  if (!isSpeechRecognitionSupported) {
    return (
      <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6 text-center ${className}`}>
        <MicOff className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">
          Voice input is not supported in your browser.
          <br />
          Try using Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-[#1A1A20] border-2 ${isListening ? 'border-[#1CE479]' : 'border-[#2A2A30]'} rounded-xl p-6 transition-all ${className}`}>
      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isListening ? (
            <>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Listening...</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-gray-500 rounded-full" />
              <span className="text-sm text-gray-400">Ready</span>
            </>
          )}
        </div>

        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearText}
            className="text-gray-400 hover:text-white hover:bg-[#2A2A30]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Volume Indicator */}
      {isListening && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#1CE479]" />
            <Progress value={volume} className="h-1 flex-1 bg-[#2A2A30]" />
          </div>
        </div>
      )}

      {/* Transcript Area */}
      <div className="min-h-[100px] max-h-[200px] overflow-y-auto mb-4 p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
        {value || interim ? (
          <div className="text-white space-y-1">
            {value && <div>{value}</div>}
            {interim && (
              <div className="text-gray-500 italic">
                {interim}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            {placeholder}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={toggleListening}
          className={`
            flex-1 h-12
            ${isListening
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-[#1CE479] hover:bg-[#1CE479]/90 text-[#0A0A0F]'
            }
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Click the microphone button and speak clearly
      </p>
    </div>
  );
};

// Compact Voice Button (for inline use)
export const VoiceButton: React.FC<{
  onTranscript: (text: string) => void;
  language?: string;
  className?: string;
}> = ({ onTranscript, language = 'en-US', className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechRecognitionSupported, language, onTranscript]);

  const handleClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!isSpeechRecognitionSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`
        ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-[#1CE479]'}
        ${className}
      `}
      title="Voice input"
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  );
};

// Voice Note Recorder (for recording audio messages)
export const VoiceNoteRecorder: React.FC<{
  onSave: (transcript: string, duration: number) => void;
  maxDuration?: number; // in seconds
  className?: string;
}> = ({ onSave, maxDuration = 120, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            handleStop();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, maxDuration]);

  const handleStart = () => {
    setIsRecording(true);
    setDuration(0);
    setTranscript('');
  };

  const handleStop = () => {
    setIsRecording(false);
  };

  const handleSave = () => {
    if (transcript) {
      onSave(transcript, duration);
      setTranscript('');
      setDuration(0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Record Button */}
        <Button
          onClick={isRecording ? handleStop : handleStart}
          size="icon"
          className={`
            rounded-full w-12 h-12
            ${isRecording
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-[#1CE479] hover:bg-[#1CE479]/90'
            }
          `}
        >
          {isRecording ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-[#0A0A0F]" />
          )}
        </Button>

        {/* Duration */}
        <div className="flex-1">
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono">{formatDuration(duration)}</span>
              <Progress 
                value={(duration / maxDuration) * 100} 
                className="h-1 flex-1 bg-[#2A2A30]"
              />
            </div>
          )}
          
          {!isRecording && duration > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">
                Recorded {formatDuration(duration)}
              </span>
            </div>
          )}

          {!isRecording && duration === 0 && (
            <span className="text-gray-500 text-sm">
              Click to record a voice note
            </span>
          )}
        </div>

        {/* Save/Delete */}
        {!isRecording && duration > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setDuration(0);
                setTranscript('');
              }}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Voice Input for Transcript */}
      {isRecording && (
        <div className="mt-3">
          <VoiceInput
            value={transcript}
            onChange={setTranscript}
            continuous={true}
            placeholder="Speaking..."
            className="!p-3 !border-0"
          />
        </div>
      )}
    </div>
  );
};
