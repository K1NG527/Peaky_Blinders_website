import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load sections for optimization
const SplashScreen = lazy(() => import('@/components/sections/SplashScreen').then(m => ({ default: m.SplashScreen })));
const Homepage = lazy(() => import('@/components/sections/Homepage').then(m => ({ default: m.Homepage })));
const LedgerDashboard = lazy(() => import('@/components/sections/LedgerDashboard').then(m => ({ default: m.LedgerDashboard })));
const TerritoryMap = lazy(() => import('@/components/sections/TerritoryMap').then(m => ({ default: m.TerritoryMap })));
const DossierSection = lazy(() => import('@/components/sections/DossierSection').then(m => ({ default: m.DossierSection })));
const TimelineSection = lazy(() => import('@/components/sections/TimelineSection').then(m => ({ default: m.TimelineSection })));
const RelationshipWeb = lazy(() => import('@/components/sections/RelationshipWeb').then(m => ({ default: m.RelationshipWeb })));

import { Sidebar } from '@/components/ui-custom/Sidebar';
import { Footer } from '@/components/ui-custom/Footer';
import { AudioPlayer } from '@/components/ui-custom/AudioPlayer';
import { CustomCursor } from '@/components/ui-custom/CustomCursor';
import { CursorParticles } from '@/components/ui-custom/CursorParticles';
import { LiquifiedTransition } from '@/components/ui-custom/LiquifiedTransition';
import { SmokeTransition } from '@/components/ui-custom/SmokeTransition';
import { Soundscape } from '@/components/ui-custom/Soundscape';
import { WhiskeyShader } from '@/components/ui-custom/WhiskeyShader';
import { useCharacter } from '@/context/CharacterContext';
import { useInventory, useCinematicMode } from '@/hooks/useInventory';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import type { NavSection } from '@/types';
import { playSFX, preloadSFX } from '@/lib/audio';
import './App.css';

const THEME_SONG_URL = 'my-song.mpeg';

const sectionVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -15, filter: 'blur(4px)' },
};

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/* ═══════════════════════════════════════
   CLICK SPARK EFFECT
   ═══════════════════════════════════════ */
function createSparks(x: number, y: number) {
  const colors = ['#FF6600', '#FFAA00', '#FFDD44', '#c9a86c', '#FF4400'];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 40 + Math.random() * 40;
    const size = 2 + Math.random() * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 500 + Math.random() * 200;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 20;

    spark.style.cssText = `
      position: fixed; left: ${x}px; top: ${y}px; width: ${size}px; height: ${size}px;
      background: ${color}; border-radius: 50%; pointer-events: none; z-index: 9999;
      box-shadow: 0 0 6px ${color}; --dx: ${dx}px; --dy: ${dy}px;
      animation: sparkOut ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), duration);
  }

  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed; left: ${x - 8}px; top: ${y - 8}px; width: 16px; height: 16px;
    background: radial-gradient(circle, rgba(255,170,0,0.6) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none; z-index: 9999;
    animation: sparkFlash 300ms ease-out forwards;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 300);
}

function App() {
  const { theme, character, isStealthMode } = useCharacter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentSection, setCurrentSection] = useState<NavSection>('home');
  const [shaking, setShaking] = useState(false);
  const [arthurFlash, setArthurFlash] = useState(false);
  const [isChangingCharacter, setIsChangingCharacter] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stealthFlash, setStealthFlash] = useState(false);
  // ... (Easter eggs omitted for brevity in diff tool)
  const prevStealth = useRef(isStealthMode);
  const prevSection = useRef(currentSection);
  const prevCharacter = useRef(character);
  const [pendingSection, setPendingSection] = useState<NavSection | null>(null);

  const { cinematicMode, toggleCinematicMode } = useCinematicMode();
  const { isLoaded, getStats } = useInventory();

  // Preload and Click sparks
  useEffect(() => {
    preloadSFX();
    const h = (e: MouseEvent) => {
      createSparks(e.clientX, e.clientY);
      playSFX('tick');
    };
    addEventListener('click', h);
    return () => removeEventListener('click', h);
  }, []);

  // EMP flash on stealth toggle
  useEffect(() => {
    if (prevStealth.current !== isStealthMode) {
      setStealthFlash(true);
      setTimeout(() => setStealthFlash(false), 400);
    }
    prevStealth.current = isStealthMode;
  }, [isStealthMode]);

  // Konami code Easter egg
  useEffect(() => {
    let seq: string[] = [];
    const h = (e: KeyboardEvent) => {
      seq.push(e.key);
      seq = seq.slice(-KONAMI.length);
      if (seq.join(',') === KONAMI.join(',')) {
        setArthurFlash(true);
        setShaking(true);
        setTimeout(() => { setArthurFlash(false); setShaking(false); }, 2000);
        seq = [];
      }
    };
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, []);

  // "alfie" Easter egg
  useEffect(() => {
    const h = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.value.toLowerCase() === 'alfie') {
        toast.info("Big fucks small. And the big, it doesn't even know the small's name.", {
          description: '— Alfie Solomons',
          duration: 4000,
        });
      }
    };
    addEventListener('input', h);
    return () => removeEventListener('input', h);
  }, []);

  // ═══ REPLAY SPLASH ON CHARACTER SWITCH ═══
  useEffect(() => {
    if (prevCharacter.current !== character && !showSplash) {
      setIsChangingCharacter(true);
      setShowSplash(true);

      // Cinematic transition sounds
      if (character === 'thomas') {
        playSFX('thomas_transition');
      } else if (character === 'luca') {
        playSFX('luca_transition');
      }
    }
    prevCharacter.current = character;
  }, [character, showSplash]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    prevSection.current = currentSection;
  }, [currentSection]);

  const handleNavigate = useCallback((s: NavSection) => {
    // If we are already navigating or same section, ignore
    if (isNavigating || s === currentSection) return;

    setPendingSection(s);
    setIsNavigating(true);
  }, [currentSection, isNavigating]);

  const handleSmokePeak = useCallback(() => {
    if (pendingSection) {
      setCurrentSection(pendingSection);
      setPendingSection(null);
    }
  }, [pendingSection]);

  const handleLocationSelect = useCallback((_location: string) => {
    // No-op: territory map handles its own selection UI now
  }, []);

  // Particles
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${10 + Math.random() * 18}s`,
      delay: `${Math.random() * 10}s`,
      size: 1 + Math.random() * 3,
    }))
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'home': return <Homepage stats={getStats()} onNavigate={handleNavigate} />;
      case 'ledger': return <LedgerDashboard />;
      case 'map': return <TerritoryMap onLocationSelect={handleLocationSelect} />;
      case 'dossier': return <DossierSection />;
      case 'timeline': return <TimelineSection />;
      case 'relationships': return <RelationshipWeb />;
      default: return <Homepage stats={getStats()} onNavigate={handleNavigate} />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full animate-spin" style={{ border: `1px solid rgba(${theme.accentRgb}, 0.3)`, borderTopColor: theme.accent }} />
            <div className="absolute inset-2 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s', border: `1px solid rgba(${theme.accentRgb}, 0.15)`, borderTopColor: theme.accentLight }} />
          </div>
          <p className="font-cinzel tracking-[0.2em] text-sm" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${shaking ? 'screen-shake' : ''}`}
      style={{
        backgroundColor: theme.bg,
        transition: 'background-color 0.8s ease',
        cursor: 'none', // Hide default cursor here too
      }}
    >
      {/* Cinematic Transition Effect */}
      <LiquifiedTransition
        isChanging={isChangingCharacter}
        onTransitionComplete={() => setIsChangingCharacter(false)}
      />

      <SmokeTransition
        isTransitioning={isNavigating}
        onPeak={handleSmokePeak}
        onComplete={() => setIsNavigating(false)}
      />

      <Soundscape />
      <WhiskeyShader />

      {/* Animated Custom Cursor */}
      <CursorParticles />
      <CustomCursor />

      {/* Cinematic Smoke Page Transition */}
      <SmokeTransition
        isTransitioning={!!pendingSection}
        onComplete={() => setIsNavigating(false)}
        onPeak={handleSmokePeak}
      />

      {/* Splash Screen — plays on load AND on character switch */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Main App */}
      {!showSplash && (
        <div className="flex">
          <Sidebar currentSection={currentSection} onNavigate={handleNavigate}
            cinematicMode={cinematicMode} onToggleCinematic={toggleCinematicMode} />
          <main
            className="flex-1 min-h-screen relative overflow-y-auto transition-[margin] duration-300"
            style={{ filter: isChangingCharacter ? 'url(#liquify-filter)' : 'none' }}
          >
            <div className="relative z-10 pb-20">
              <AnimatePresence mode="wait">
                <motion.div key={currentSection} variants={sectionVariants}
                  initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
                  <Suspense fallback={
                    <div className="flex items-center justify-center p-20">
                      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: theme.accent }} />
                    </div>
                  }>
                    {renderContent()}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </div>
            <Footer onNavigate={handleNavigate} />
          </main>
        </div>
      )}

      {/* ===== AMBIENT EFFECTS ===== */}

      {/* Smoke wisps */}
      {!showSplash && (
        <div className="ambient-smoke">
          <div className="smoke-wisp" />
          <div className="smoke-wisp" />
          <div className="smoke-wisp" />
        </div>
      )}

      {/* Floating particles */}
      {!showSplash && (
        <div className="particles-layer">
          {particles.map(p => (
            <div key={p.id}
              className={character === 'thomas' ? 'gold-particle' : 'ember-particle'}
              style={{ left: p.left, bottom: -10, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay }} />
          ))}
        </div>
      )}

      {/* Cinematic overlays */}
      {cinematicMode && (
        <>
          <div className="grain-overlay" />
          <div className="vignette-overlay" />
          <div className="scratch-overlay" />
        </>
      )}

      {/* Arthur Flash */}
      <AnimatePresence>
        {arthurFlash && (
          <motion.div className="easter-egg-flash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="font-cinzel text-6xl md:text-8xl text-white tracking-[0.3em] uppercase"
              style={{ textShadow: `0 0 80px rgba(${theme.accentRgb}, 0.8)` }}>
              ARTHUR!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== STEALTH MODE OVERLAYS ===== */}
      {isStealthMode && (
        <>
          <div className="stealth-scanlines" />
          <div className="stealth-vignette" />
          <div className="stealth-hud-badge">
            <div className="stealth-hud-dot" />
            Stealth Active
          </div>
        </>
      )}

      {/* EMP Flash */}
      <AnimatePresence>
        {stealthFlash && (
          <motion.div
            className="stealth-emp-flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Audio Player */}
      <AudioPlayer audioUrl={THEME_SONG_URL} />

      {/* Telegram Notification Toasts */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'telegram-toast',
        }}
      />
    </div>
  );
}

export default App;
