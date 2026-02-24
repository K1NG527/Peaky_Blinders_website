import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Map, Film, Home,
  Repeat, Eye, EyeOff, Network, X
} from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';
import { useMagnetic } from '@/hooks/useMagnetic';
import { playSFX } from '@/lib/audio';
import type { NavSection } from '@/types';

interface SidebarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  cinematicMode: boolean;
  onToggleCinematic: () => void;
}

const navItems: { id: NavSection; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ledger', label: 'The Archives', icon: BookOpen },
  { id: 'map', label: 'Territory Map', icon: Map },
  { id: 'relationships', label: 'Network', icon: Network },
];

function MagneticButton({
  children,
  onClick,
  className = '',
  style = {},
  whileHover = {}
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whileHover?: any;
}) {
  const { ref, x, y } = useMagnetic(0.3);
  return (
    <motion.button
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      onClick={onClick}
      className={className}
      style={{ ...style, x, y }}
      whileHover={whileHover}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

// Realistic Vintage 1920s Pocket Watch SVG (for Thomas)
const PocketWatchIcon = ({ color }: { color?: string }) => (
  <svg viewBox="0 0 200 200" className="w-16 h-16 md:w-20 md:h-20" style={{ filter: 'drop-shadow(0px 15px 20px rgba(0,0,0,0.9))' }} color={color}>
    <defs>
      <linearGradient id="brass-base" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="25%" stopColor="#aa7c11" />
        <stop offset="50%" stopColor="#fcdf95" />
        <stop offset="75%" stopColor="#8a610c" />
        <stop offset="100%" stopColor="#4a3505" />
      </linearGradient>
      <radialGradient id="inner-shadow" cx="50%" cy="50%" r="50%">
        <stop offset="75%" stopColor="transparent" />
        <stop offset="95%" stopColor="rgba(0,0,0,0.6)" />
        <stop offset="100%" stopColor="#1a1104" />
      </radialGradient>
      <radialGradient id="aged-face" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e3d6c1" />
        <stop offset="50%" stopColor="#d4c3a3" />
        <stop offset="85%" stopColor="#b59f79" />
        <stop offset="100%" stopColor="#5c4a30" />
      </radialGradient>
      <linearGradient id="glass-glare" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.7)" stopOpacity="0.7" />
        <stop offset="20%" stopColor="rgba(255,255,255,0.2)" stopOpacity="0.2" />
        <stop offset="50%" stopColor="transparent" stopOpacity="0" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0.1" />
      </linearGradient>
      <filter id="hand-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="3" dy="5" stdDeviation="3" floodOpacity="0.7" />
      </filter>
    </defs>
    <path d="M 65 35 C 65 -15, 135 -15, 135 35" fill="none" stroke="url(#brass-base)" strokeWidth="14" strokeLinecap="round" style={{ filter: 'drop-shadow(0 8px 6px rgba(0,0,0,0.6))' }} />
    <rect x="80" y="25" width="40" height="22" rx="4" fill="url(#brass-base)" style={{ filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))' }} />
    <path d="M 80 32 L 120 32 M 80 38 L 120 38 M 80 44 L 120 44" stroke="#4a3505" strokeWidth="2.5" />
    <rect x="88" y="10" width="24" height="15" rx="3" fill="url(#brass-base)" />
    <path d="M 91 10 L 91 25 M 96 10 L 96 25 M 101 10 L 101 25 M 106 10 L 106 25 M 111 10 L 111 25" stroke="#3d2a04" strokeWidth="2" />
    <circle cx="100" cy="120" r="78" fill="url(#brass-base)" />
    <circle cx="100" cy="120" r="78" fill="url(#inner-shadow)" />
    <circle cx="100" cy="120" r="71" fill="#3d2a13" />
    <circle cx="100" cy="120" r="69" fill="#1a1104" />
    <circle cx="100" cy="120" r="67" fill="#8a610c" />
    <circle cx="100" cy="120" r="66" fill="#110a02" />
    <circle cx="100" cy="120" r="65" fill="url(#aged-face)" />
    <circle cx="100" cy="120" r="61" fill="none" stroke="#2a1f10" strokeWidth="1.5" />
    <circle cx="100" cy="120" r="59" fill="none" stroke="#3d2a13" strokeWidth="0.5" strokeDasharray="1 3" />
    <circle cx="100" cy="120" r="54" fill="none" stroke="#2a1f10" strokeWidth="0.5" />
    <g fill="#1a1104" fontFamily="serif" fontSize="12" fontWeight="900" textAnchor="middle">
      <text x="100" y="70">XII</text>
      <text x="125" y="77" transform="rotate(30 125 73)">I</text>
      <text x="143" y="95" transform="rotate(60 143 91)">II</text>
      <text x="150" y="124">III</text>
      <text x="143" y="148" transform="rotate(-60 143 144)">IV</text>
      <text x="125" y="165" transform="rotate(-30 125 161)">V</text>
      <text x="100" y="172">VI</text>
      <text x="75" y="165" transform="rotate(30 75 161)">VII</text>
      <text x="57" y="148" transform="rotate(60 57 144)">VIII</text>
      <text x="50" y="124">IX</text>
      <text x="57" y="95" transform="rotate(-60 57 91)">X</text>
      <text x="75" y="77" transform="rotate(-30 75 73)">XI</text>
    </g>
    <text x="100" y="98" fontFamily="sans-serif" fontSize="4.5" letterSpacing="2.5" fill="#2a1f10" textAnchor="middle" opacity="0.85">GARRISON</text>
    <text x="100" y="103" fontFamily="serif" fontSize="3" letterSpacing="1" fill="#4a3511" textAnchor="middle" opacity="0.7">BIRMINGHAM</text>
    <circle cx="100" cy="148" r="12" fill="none" stroke="#3d2a13" strokeWidth="0.5" opacity="0.6" />
    <circle cx="100" cy="148" r="10" fill="none" stroke="#2a1f10" strokeWidth="0.5" strokeDasharray="1 2.5" opacity="0.8" />
    <path d="M 100 148 L 100 138" stroke="#8c1c13" strokeWidth="1" strokeLinecap="round" />
    <circle cx="100" cy="148" r="1.5" fill="#2a1f10" />
    <g filter="url(#hand-shadow)">
      <path d="M 95 120 C 95 110, 100 85, 100 80 C 100 85, 105 110, 105 120 C 105 125, 95 125, 95 120 Z" fill="#110a02" />
      <path d="M 98 120 C 98 110, 100 85, 100 80 C 100 85, 100 110, 100 120 C 100 125, 98 125, 98 120 Z" fill="#3d2a13" />
      <path d="M 97 120 L 100 62 L 103 120 Z" fill="#110a02" transform="rotate(40 100 120)" />
      <path d="M 98.5 120 L 100 62 L 100 120 Z" fill="#4a3511" transform="rotate(40 100 120)" />
    </g>
    <circle cx="100" cy="120" r="5" fill="url(#brass-base)" filter="url(#hand-shadow)" />
    <circle cx="100" cy="120" r="2" fill="#1a1104" />
    <circle cx="100" cy="120" r="0.5" fill="#fcdf95" />
    <circle cx="100" cy="120" r="66" fill="url(#glass-glare)" pointerEvents="none" />
    <path d="M 45 100 A 70 70 0 0 1 125 60" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" style={{ filter: 'blur(1px)' }} pointerEvents="none" />
    <path d="M 50 145 A 70 70 0 0 0 135 170" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" style={{ filter: 'blur(2px)' }} pointerEvents="none" />
  </svg>
);

// Custom Luca Signet Ring Image Icon
const LucaSignetRingIcon = ({ color: _color }: { color?: string }) => (
  <img
    src="/assets/luca_ring.png"
    alt="Luca Signet Ring"
    className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full border border-white/5"
    style={{
      filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.8)) brightness(1.1)',
      backgroundColor: 'rgba(0,0,0,0.2)'
    }}
    // @ts-ignore - using priority loading for faster theme feedback
    fetchPriority="high"
  />
);

export const Sidebar = memo(({ currentSection, onNavigate, cinematicMode, onToggleCinematic }: SidebarProps) => {
  const { theme, character, toggleCharacter, isStealthMode, toggleStealthMode } = useCharacter();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Play a subtle ticking/clicking sound here if audio context exists
  };

  const handleNavClick = (id: NavSection) => {
    playSFX('heavy_clack');
    onNavigate(id);
    setIsOpen(false);
  };

  // Choose icon based on character
  const NavIcon = character === 'thomas' ? PocketWatchIcon : LucaSignetRingIcon;

  return (
    <>
      {/* The Floating Navigation Button */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <MagneticButton
          onClick={handleToggle}
          className="relative group flex items-center justify-center p-4 rounded-full glass-heavy transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)]"
          style={{ border: `1px solid rgba(${theme.accentRgb}, 0.4)` }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Glowing ring behind the icon */}
          <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: `radial-gradient(circle, rgba(${theme.accentRgb},0.2) 0%, transparent 70%)` }} />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X className="w-8 h-8 md:w-10 md:h-10" style={{ color: theme.accent }} />
              </motion.div>
            ) : (
              <motion.div
                key={`nav-icon-${character}`}
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NavIcon color={theme.accent} />
              </motion.div>
            )}
          </AnimatePresence>
        </MagneticButton>
      </div>

      {/* The Expanded Radial/Staggered Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Navigation Items container floating above watch */}
            <motion.div
              className="fixed bottom-32 left-8 z-[100] flex flex-col items-start gap-4"
            >
              {/* Header Box */}
              <motion.div
                className="bg-black/90 border p-4 mb-4"
                style={{ borderColor: `rgba(${theme.accentRgb}, 0.2)` }}
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -20, y: 10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h1 className="font-cinzel text-paper text-sm md:text-base tracking-[0.2em] uppercase">
                  {character === 'thomas' ? 'Shelby Co. Ltd.' : 'The Changretta Famiglia'}
                </h1>
                <p className="text-[10px] text-paper/40 tracking-wider mt-1">
                  {character === 'thomas' ? 'By Order of the Peaky Blinders' : 'La Cosa Nostra'}
                </p>
              </motion.div>

              {/* Staggered Nav Links */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  >
                    <MagneticButton
                      onClick={() => handleNavClick(item.id)}
                      className={`group flex items-center gap-4 py-2 px-4 rounded-sm transition-colors duration-300 relative overflow-hidden`}
                      whileHover={{ x: 10 }}
                    >
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-20'}`}
                        style={{ background: `linear-gradient(90deg, rgba(${theme.accentRgb}, 0.15), transparent)` }}
                      />

                      <Icon
                        className="w-5 h-5 flex-shrink-0 relative z-10 transition-colors duration-300"
                        style={{ color: isActive ? theme.accent : 'rgba(255,255,255,0.4)' }}
                      />
                      <span
                        className="font-cinzel text-sm md:text-base tracking-[0.15em] uppercase relative z-10 transition-colors duration-300"
                        style={{ color: isActive ? '#e5e5e5' : 'rgba(255,255,255,0.6)' }}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-full"
                          style={{ backgroundColor: theme.accent }}
                          layoutId="activeWatchBar"
                        />
                      )}
                    </MagneticButton>
                  </motion.div>
                );
              })}

              {/* Settings / Controls */}
              <motion.div
                className="mt-6 flex flex-col gap-2 border-t pt-4 w-full"
                style={{ borderColor: `rgba(${theme.accentRgb}, 0.1)` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <MagneticButton onClick={toggleCharacter}
                  className="flex items-center gap-3 py-2 px-4 text-paper/60 hover:text-white transition-colors"
                >
                  <Repeat className="w-4 h-4" style={{ color: theme.accent }} />
                  <span className="font-cinzel text-xs tracking-[0.12em] uppercase">
                    Switch to {character === 'thomas' ? 'Luca' : 'Thomas'}
                  </span>
                </MagneticButton>

                <MagneticButton onClick={onToggleCinematic}
                  className="flex items-center gap-3 py-2 px-4 transition-colors"
                  style={{ color: cinematicMode ? theme.accent : 'rgba(229,229,229,0.4)' }}
                >
                  <Film className="w-4 h-4" />
                  <span className="font-cinzel text-xs tracking-[0.12em] uppercase">
                    Cinematic Mode: {cinematicMode ? 'ON' : 'OFF'}
                  </span>
                </MagneticButton>

                <MagneticButton onClick={toggleStealthMode}
                  className="flex items-center gap-3 py-2 px-4 transition-colors"
                  style={{ color: isStealthMode ? theme.accent : 'rgba(229,229,229,0.4)' }}
                >
                  {isStealthMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="font-cinzel text-xs tracking-[0.12em] uppercase">
                    Stealth Ops: {isStealthMode ? 'ACTIVE' : 'OFF'}
                  </span>
                </MagneticButton>
              </motion.div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
