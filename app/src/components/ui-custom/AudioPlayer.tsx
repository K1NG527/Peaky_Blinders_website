import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Music, ChevronDown } from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';
import { toast } from 'sonner';

interface AudioPlayerProps {
  audioUrl: string;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const { theme } = useCharacter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        toast.error("Playback blocked. Please interact with the page first.");
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Visualizer bars
  const [visualizerBars] = useState(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    duration: 0.5 + Math.random() * 0.5
  })));

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card p-4 rounded-2xl w-72 mb-2 relative overflow-hidden shadow-2xl"
            style={{ border: `1px solid rgba(${theme.accentRgb}, 0.2)` }}
          >
            {/* Background Accent Blur */}
            <div
              className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-20"
              style={{ background: theme.accent }}
            />

            <div className="flex flex-col gap-4">
              {/* Header: Song Info & Visualizer */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-cinzel text-xs tracking-widest uppercase truncate" style={{ color: theme.accent }}>
                    Red Right Hand
                  </h4>
                  <p className="text-[10px] text-paper/40 truncate">Nick Cave & The Bad Seeds</p>
                </div>

                {/* Micro Visualizer */}
                <div className="flex items-end gap-[2px] h-4">
                  {visualizerBars.map((bar) => (
                    <motion.div
                      key={bar.id}
                      className="w-[2px] rounded-full"
                      style={{ background: theme.accent }}
                      animate={{
                        height: isPlaying ? [4, 12, 6, 16, 4][bar.id % 5] : 2
                      }}
                      transition={{
                        duration: bar.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[8px] tracking-tighter opacity-50 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-current"
                  style={{ accentColor: theme.accent }}
                />
              </div>

              {/* Controls Wrapper */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
                    style={{ background: `rgba(${theme.accentRgb}, 0.1)`, border: `1px solid rgba(${theme.accentRgb}, 0.2)` }}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" style={{ color: theme.accent }} />
                    ) : (
                      <Play className="w-4 h-4 translate-x-0.5" style={{ color: theme.accent }} />
                    )}
                  </button>

                  <div className="flex flex-col">
                    <button
                      onClick={toggleMute}
                      className="p-1 hover:bg-white/5 rounded transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5 opacity-40" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Volume Slider */}
                <div className="flex-1 flex items-center gap-2 px-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="flex-1 h-0.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: theme.accent }}
                  />
                </div>

                <button
                  onClick={() => setExpanded(false)}
                  className="p-1 hover:bg-white/5 rounded transition-colors"
                >
                  <ChevronDown className="w-4 h-4 opacity-30" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Gramophone Button */}
      <motion.button
        layout
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Vinyl Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity"
          style={{ background: theme.accent }}
        />

        <div
          className="glass-card w-14 h-14 rounded-full flex items-center justify-center relative z-10 overflow-hidden"
          style={{
            borderColor: isPlaying ? theme.accent : `rgba(${theme.accentRgb}, 0.2)`,
            boxShadow: isPlaying ? `0 0 20px rgba(${theme.accentRgb}, 0.2)` : 'none'
          }}
        >
          {/* Vinyl Disc */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border border-white/5 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #1a1a1a 30%, #0a0a0a 100%)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }}
          >
            {/* Vinyl Ridges */}
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <div className="absolute inset-4 rounded-full border border-white/5" />

            {/* Center Label */}
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: theme.accent }}
            />
          </motion.div>

          {/* Gramophone Needle / Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              {showControls || !isPlaying ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="z-20 pointer-events-auto"
                >
                  {isPlaying ? (
                    <Pause
                      className="w-5 h-5 drop-shadow-lg"
                      style={{ color: '#fff' }}
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    />
                  ) : (
                    <Play
                      className="w-5 h-5 ml-1 drop-shadow-lg"
                      style={{ color: theme.accent }}
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="needle"
                  initial={{ rotate: -40, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -40, opacity: 0 }}
                  className="absolute top-1 right-1 origin-top-right w-6 h-1 bg-white/80 rounded-full"
                  style={{
                    // Simple needle visualization
                    boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Note Indicator */}
        {isPlaying && (
          <motion.div
            animate={{
              y: [-10, -30],
              x: [0, 10],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute -top-2 -left-2"
          >
            <Music className="w-3 h-3" style={{ color: theme.accent }} />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
