import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward } from 'lucide-react';

interface VideoIntroProps {
  onComplete: () => void;
  skipIntro: boolean;
}

// SVG "S" monogram path for Shelby
const SHELBY_S_PATH = "M60 10 C30 10, 10 30, 10 50 C10 70, 30 80, 50 80 C70 80, 90 90, 90 110 C90 130, 70 150, 40 150";

export function VideoIntro({ onComplete, skipIntro }: VideoIntroProps) {
  const [stage, setStage] = useState(0);
  // Stages: 0=black+pulse, 1=logo draw, 2=text reveal, 3=smoke dissipate & exit

  useEffect(() => {
    if (skipIntro) {
      onComplete();
      return;
    }

    // Stage 0 → 1 (heartbeat → logo)
    const t1 = setTimeout(() => setStage(1), 1500);
    // Stage 1 → 2 (logo → text)
    const t2 = setTimeout(() => setStage(2), 4500);
    // Stage 2 → 3 (text → exit)
    const t3 = setTimeout(() => setStage(3), 7500);
    // Complete
    const t4 = setTimeout(() => onComplete(), 9000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [skipIntro, onComplete]);

  const handleSkip = useCallback(() => {
    setStage(3);
    setTimeout(() => onComplete(), 400);
  }, [onComplete]);

  // Smoke particles for smoke-dissipation effect
  const [smokeParticles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 200 + Math.random() * 400,
      delay: Math.random() * 0.5,
    }))
  );

  if (skipIntro) return null;

  return (
    <AnimatePresence mode="wait">
      {stage < 3 ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Video Background (subtle) */}
          <video
            autoPlay
            muted
            playsInline
            loop
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: stage >= 1 ? 0.15 : 0, transition: 'opacity 2s ease' }}
          >
            <source src="/intro_video.mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

          {/* Stage 0: Heartbeat Pulse Rings */}
          <AnimatePresence>
            {stage === 0 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="absolute w-24 h-24 rounded-full border border-brass/40"
                    style={{
                      animation: `ringPulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  />
                ))}
                <div
                  className="w-4 h-4 rounded-full bg-brass/60"
                  style={{ animation: 'heartbeatPulse 2s ease-in-out infinite' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 1: SVG Logo Draw */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  {/* Outer ring */}
                  <motion.div
                    className="w-40 h-40 rounded-full border border-brass/30 flex items-center justify-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {/* Inner ring */}
                    <motion.div
                      className="w-32 h-32 rounded-full border border-brass/20 flex items-center justify-center"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* S Monogram SVG */}
                      <svg
                        viewBox="0 0 100 160"
                        className="w-16 h-24"
                        fill="none"
                      >
                        <path
                          d={SHELBY_S_PATH}
                          className="svg-draw"
                          stroke="#c9a86c"
                          strokeWidth="6"
                          strokeLinecap="round"
                          fill="#c9a86c"
                          fillOpacity="0"
                          style={{
                            animationDuration: '2.5s',
                          }}
                        />
                      </svg>
                    </motion.div>
                  </motion.div>

                  {/* Decorative corner lines */}
                  {[
                    { top: -20, left: -20, borderTop: true, borderLeft: true },
                    { top: -20, right: -20, borderTop: true, borderRight: true },
                    { bottom: -20, left: -20, borderBottom: true, borderLeft: true },
                    { bottom: -20, right: -20, borderBottom: true, borderRight: true },
                  ].map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-8"
                      style={{
                        ...(pos.top !== undefined ? { top: pos.top } : {}),
                        ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
                        ...(pos.left !== undefined ? { left: pos.left } : {}),
                        ...(pos.right !== undefined ? { right: pos.right } : {}),
                        borderTop: pos.borderTop ? '1px solid rgba(201,168,108,0.3)' : 'none',
                        borderBottom: pos.borderBottom ? '1px solid rgba(201,168,108,0.3)' : 'none',
                        borderLeft: pos.borderLeft ? '1px solid rgba(201,168,108,0.3)' : 'none',
                        borderRight: pos.borderRight ? '1px solid rgba(201,168,108,0.3)' : 'none',
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 2: Text Wipe Reveal */}
          <AnimatePresence>
            {stage === 2 && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-30 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  className="font-cinzel text-4xl sm:text-6xl md:text-7xl text-white tracking-[0.2em] uppercase"
                  initial={{ clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0% 0 0)' }}
                  transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                  style={{
                    textShadow: '0 0 60px rgba(201, 168, 108, 0.5), 0 0 120px rgba(201, 168, 108, 0.2)',
                  }}
                >
                  Shelby Company
                </motion.h1>

                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-brass to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: 96 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                  <span className="font-cinzel text-brass text-xl tracking-[0.3em]">Ltd.</span>
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-brass to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: 96 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </motion.div>

                <motion.p
                  className="font-cinzel text-paper/60 text-sm tracking-[0.25em] uppercase mt-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  By Order of the Peaky Blinders
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smoke particles (always present, more visible at exit) */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {smokeParticles.map(p => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: 'radial-gradient(circle, rgba(201,168,108,0.06) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  animation: `smokeDrift ${15 + p.delay * 10}s ease-in-out infinite`,
                  animationDelay: `${p.delay * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Skip Button */}
          <motion.button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-40 flex items-center gap-2 text-paper/40 hover:text-brass transition-all duration-300 glass-light px-5 py-2.5 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="font-cinzel text-xs tracking-[0.2em] uppercase">Skip</span>
          </motion.button>

          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-brass/20 z-20" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-brass/20 z-20" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-brass/20 z-20" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
