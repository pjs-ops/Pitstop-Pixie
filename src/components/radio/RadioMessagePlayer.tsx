import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
import { RadioMessage } from '../../types/radio';

interface RadioMessagePlayerProps {
  message: RadioMessage;
  onPlaybackComplete?: () => void;
}

export const RadioMessagePlayer: React.FC<RadioMessagePlayerProps> = ({
  message,
  onPlaybackComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // Check speech synthesis support
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup on unmount or message change
  useEffect(() => {
    stopPlayback();
    setProgressPercent(0);
  }, [message.id]);

  const stopPlayback = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    setIsPlaying(true);
    setProgressPercent(0);

    const duration = (message.audioDurationSeconds || 5) * 1000;
    const intervalStep = 100;
    let elapsed = 0;

    intervalRef.current = window.setInterval(() => {
      elapsed += intervalStep;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgressPercent(pct);

      if (elapsed >= duration) {
        stopPlayback();
        setProgressPercent(100);
        if (onPlaybackComplete) onPlaybackComplete();
      }
    }, intervalStep);

    // Genuine Browser Web Speech Synthesis fallback with realistic motorsport pitch/rate
    if (!audioMuted && speechSupported && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // reset prior utterances
      const cleanPhrase = message.phrase.replace(/["']/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanPhrase);
      utterance.rate = 1.05; // slightly urgent tempo
      utterance.pitch = message.speakerRole === 'driver' ? 1.15 : 0.95;

      // Select an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      if (engVoice) utterance.voice = engVoice;

      utterance.onend = () => {
        // let the timer finish to complete the wave animation
      };

      utterance.onerror = () => {
        // gracefully continue without speech
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis playback error:', err);
      }
    }
  };

  const handleReplay = () => {
    stopPlayback();
    setTimeout(() => {
      handlePlayToggle();
    }, 100);
  };

  const roleLabels: Record<string, string> = {
    race_engineer: 'Race Engineer 🎧',
    driver: 'Driver 🏎️',
    team_principal: 'Team Principal 👔',
    race_director: 'FIA Race Director 🏁',
  };

  return (
    <div className="bg-plum text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-blush/20 relative overflow-hidden">
      {/* Background Radio Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#F3C8D8_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

      {/* Top Transmission Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-racing flex items-center justify-center text-white text-xs shadow-md shadow-racing/30 animate-pulse">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {message.speakerName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-cosmic-100 uppercase tracking-wider">
                {roleLabels[message.speakerRole] || message.speakerRole}
              </span>
            </div>
            <div className="text-[11px] text-cosmic-200/70">
              {message.teamName} • {message.circuitName} ({message.lapContext})
            </div>
          </div>
        </div>

        {/* Audio Mute / Voice Toggle */}
        {speechSupported && (
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cosmic-200 hover:text-white transition-colors text-xs flex items-center space-x-1"
            title={audioMuted ? 'Unmute voice audio' : 'Mute voice audio'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-racing" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="text-[10px] font-mono hidden sm:inline">
              {audioMuted ? 'Muted' : 'Voice ON'}
            </span>
          </button>
        )}
      </div>

      {/* Main Radio Transcript */}
      <div className="mb-5 relative z-10">
        <div className="text-[10px] font-bold tracking-widest uppercase text-racing flex items-center space-x-1.5 mb-1.5">
          <Sparkles className="w-3 h-3" />
          <span>Radio Transmission Transcript</span>
        </div>
        <p className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white leading-snug tracking-tight italic bg-white/5 p-4 rounded-2xl border border-white/10">
          {message.phrase}
        </p>
      </div>

      {/* Interactive Player Controls & Soundwave Visualization */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 pt-1">
        {/* Play / Replay Controls */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handlePlayToggle}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-2xl font-bold font-display text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-plum-dark'
                : 'bg-racing hover:bg-racing-dark text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Radio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Transmission</span>
              </>
            )}
          </button>

          <button
            onClick={handleReplay}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Sound-wave Frequency Bars */}
        <div className="flex items-center space-x-1.5 h-8 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 w-full sm:w-auto justify-center">
          {[12, 22, 16, 28, 14, 26, 18, 30, 20, 15, 24, 12].map((height, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-gradient-to-t from-racing to-blush' : 'bg-white/20'
              }`}
              style={{
                height: isPlaying ? `${Math.max(6, (height * (progressPercent % (i + 3) + 2)) / 5)}px` : '4px',
                animationDuration: `${0.4 + (i % 4) * 0.15}s`,
              }}
            />
          ))}
          <span className="text-[11px] font-mono text-cosmic-200/80 ml-2">
            {isPlaying ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-racing via-blush to-white h-full rounded-full transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
