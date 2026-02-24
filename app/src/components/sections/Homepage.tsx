import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Crown, MapPin, Wine, TrendingUp, Repeat } from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';
import { CinematicText } from '@/components/ui-custom/CinematicText';
import { CinematicHeroTitle } from '@/components/ui-custom/CinematicHeroTitle';
import { playSFX } from '@/lib/audio';
import type { InventoryStats, NavSection } from '@/types';

interface HomepageProps {
  stats: InventoryStats; // Default/Fallback
  onNavigate: (section: NavSection) => void;
}

// Lore-accurate stats
const thomasStats: InventoryStats = {
  totalValue: 450000,
  totalBottles: 15400,
  territories: 8,
  activeShipments: 12
};

const lucaStats: InventoryStats = {
  totalValue: 1200000,
  totalBottles: 8200,
  territories: 3,
  activeShipments: 5
};

const PeakyCap = () => (
  <svg viewBox="0 0 100 60" className="w-full h-full fill-current">
    <path d="M10,45 Q10,20 50,15 Q90,20 90,45 Q90,55 50,55 Q10,55 10,45 Z M15,40 Q50,35 85,40" />
    <path d="M30,18 Q50,5 70,18" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

const PocketWatch = () => (
  <svg viewBox="0 0 60 80" className="w-full h-full fill-current">
    <circle cx="30" cy="45" r="25" />
    <path d="M30,20 L30,5 Q30,0 35,0 L25,0 Q30,0 30,5" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M30,20 C15,20 15,35 30,35 C45,35 45,20 30,20" fill="gray" />
  </svg>
);

import {
  SilhouetteThomas, SilhouetteArthur, SilhouetteJohn, SilhouettePolly, SilhouetteAda, SilhouetteAlfie,
  SilhouetteLuca, SilhouetteAngel, SilhouetteVicente, SilhouetteAudrey, SilhouetteMatteo
} from '@/components/ui-custom/CharacterSilhouettes';

// Animated counter
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, start]);
  return count;
}

// TiltCard defined but unused in current bento grid, keeping for potential reuse or removing if final.

// Iconic quotes
const thomasQuotes = [
  "I don't pay for suits. My suits are on the house or the house burns down.",
  "Everyone's a whore, Grace. We just sell different parts of ourselves.",
  "I have no limitations. I am whatever I need to be.",
  "Big fucks small.",
  "In the bleak midwinter...",
];

const lucaQuotes = [
  "Vendetta. It's the only thing I understand.",
  "My father told me... never forget.",
  "The Changretta name means something in this country.",
  "First I will kill the brothers. Then I will kill Tommy Shelby.",
  "Arrivederci.",
];

export function Homepage({ onNavigate }: HomepageProps) {
  const { theme, character, toggleCharacter } = useCharacter();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const { scrollYProgress: pageScroll } = useScroll();
  const capY = useTransform(pageScroll, [0, 1], [0, -300]);
  const watchY = useTransform(pageScroll, [0, 1], [0, -600]);
  const capRotate = useTransform(pageScroll, [0, 1], [0, 45]);
  const watchRotate = useTransform(pageScroll, [0, 1], [0, -30]);

  // Parallax elements with different speeds

  // Quote carousel
  const quotes = character === 'thomas' ? thomasQuotes : lucaQuotes;
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % quotes.length), 5000);
    return () => clearInterval(t);
  }, [quotes.length]);

  // Refs
  const statsRef = useRef(null);
  const familyRef = useRef(null);
  const quoteRef = useRef(null);
  const statsIn = useInView(statsRef, { once: true, margin: '-80px' });
  const familyIn = useInView(familyRef, { once: true, margin: '-80px' });

  // Select stats based on character
  const currentStats = character === 'thomas' ? thomasStats : lucaStats;

  const cV = useCounter(currentStats.totalValue, 2000, statsIn);
  const cB = useCounter(currentStats.totalBottles, 1500, statsIn);
  const cT = useCounter(currentStats.territories, 1000, statsIn);

  // quickStats removed for bento grid

  const thomasFamily = [
    { name: 'Thomas Shelby', role: 'Leader', desc: 'The mastermind behind Shelby Company', init: 'TS', back: '"I already know what I\'m going to do."', silhouette: <SilhouetteThomas /> },
    { name: 'Arthur Shelby', role: 'Enforcer', desc: 'The eldest brother, keeper of order', init: 'AS', back: '"BY ORDER OF THE PEAKY BLINDERS!"', silhouette: <SilhouetteArthur /> },
    { name: 'John Shelby', role: 'Operator', desc: 'The third brother, man of action', init: 'JS', back: '"Who the hell are you?"', silhouette: <SilhouetteJohn /> },
    { name: 'Polly Gray', role: 'Treasurer', desc: 'The matriarch, keeper of accounts', init: 'PG', back: '"When you\'re dead already, you\'re free."', silhouette: <SilhouettePolly /> },
    { name: 'Ada Shelby', role: 'Diplomat', desc: 'Political influence and reason', init: 'AD', back: '"I am not just a Shelby."', silhouette: <SilhouetteAda /> },
    { name: 'Alfie Solomons', role: 'Ally', desc: 'The wandering Jew of Camden Town', init: 'AF', back: '"Big fucks small."', silhouette: <SilhouetteAlfie /> },
  ];

  const lucaFamily = [
    { name: 'Luca Changretta', role: 'Don', desc: 'Head of the Changretta Famiglia', init: 'LC', back: '"Vendetta."', silhouette: <SilhouetteLuca /> },
    { name: 'Angel Changretta', role: 'Soldier', desc: 'Loyal brother and enforcer', init: 'AC', back: '"For the family."', silhouette: <SilhouetteAngel /> },
    { name: 'Vicente Changretta', role: 'Patriarch', desc: 'The man who started it all', init: 'VC', back: '"An eye for an eye."', silhouette: <SilhouetteVicente /> },
    { name: 'Audrey Changretta', role: 'Matriarch', desc: 'Mother and avenger', init: 'MC', back: '"Never forgive. Never forget."', silhouette: <SilhouetteAudrey /> },
    { name: 'Matteo', role: 'Enforcer', desc: 'The professional from New York', init: 'MT', back: '"It is done."', silhouette: <SilhouetteMatteo /> },
  ];

  const family = character === 'thomas' ? thomasFamily : lucaFamily;

  // 3D flip state for family cards
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  // Stamp section — useInView triggered animation
  const stampRef = useRef<HTMLDivElement>(null);
  const stampInView = useInView(stampRef, { once: true, margin: '-200px' });
  const [stampLanded, setStampLanded] = useState(false);

  useEffect(() => {
    if (stampInView && !stampLanded) {
      // Delay the slam slightly for dramatic buildup
      const t = setTimeout(() => {
        setStampLanded(true);
        playSFX('heavy_clack');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [stampInView, stampLanded]);


  return (
    <div className="space-y-0 relative overflow-hidden">
      {/* Scroll-Triggered Parallax Background Silhouettes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          style={{ y: capY, rotate: capRotate }}
          className="absolute top-[25%] right-[5%] w-80 h-80 opacity-[0.02] text-white"
        >
          <PeakyCap />
        </motion.div>
        <motion.div
          style={{ y: watchY, rotate: watchRotate }}
          className="absolute top-[70%] left-[8%] w-64 h-80 opacity-[0.02] text-white"
        >
          <PocketWatch />
        </motion.div>
      </div>
      {/* ========== EDITORIAL OVERLAY (Fixed) ========== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <motion.div
          className="absolute -top-20 -left-20 font-cinzel text-[20vw] opacity-[0.03] leading-none whitespace-nowrap"
          style={{ color: theme.accent, x: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        >
          {character === 'thomas' ? 'SHELBY' : 'FAMIGLIA'}
        </motion.div>
        <motion.div
          className="absolute -bottom-20 -right-20 font-cinzel text-[20vw] opacity-[0.03] leading-none whitespace-nowrap"
          style={{ color: theme.accent, x: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        >
          {character === 'thomas' ? 'BIRMINGHAM' : 'CHANGRETTA'}
        </motion.div>
      </div>

      {/* ========== HERO ========== */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{
          y: bgY,
          backgroundImage: `linear-gradient(to bottom, rgba(${character === 'luca' ? '13,5,5' : '10,10,10'},0.3), rgba(${character === 'luca' ? '13,5,5' : '10,10,10'},0.7)), url(${character === 'luca' ? '/luca_bg_texture.jpg' : '/bg_texture.jpg'})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'background-image 0.8s ease',
          opacity: 0.6, // Blend with shader
        }} />

        {/* Hero content */}
        <motion.div className="relative z-10 text-center px-8 max-w-5xl" style={{ y: heroY, opacity: heroOpacity }}>
          {/* ... existing hero content ... */}
          {/* Crown with glow */}
          <motion.div className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}>
            <div className="relative">
              <Crown className="w-16 h-16" style={{
                color: theme.accent, filter: `drop-shadow(0 0 30px rgba(${theme.accentRgb}, 0.6))`,
              }} />
            </div>
          </motion.div>

          <div className="mb-12">
            <CinematicHeroTitle
              title={character === 'thomas' ? 'Shelby' : 'Luca'}
              subtitle={character === 'thomas' ? 'Company Limited' : 'Changretta'}
            />
          </div>

          <motion.div className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            <button onClick={() => onNavigate('ledger')} className="btn-accent-filled px-12 py-4 rounded-full text-sm font-cinzel tracking-widest uppercase hover:scale-105 transition-transform">
              Open the Ledger
            </button>
            <button onClick={toggleCharacter} className="glass-light px-8 py-4 rounded-full text-sm font-cinzel tracking-widest uppercase flex items-center gap-3 hover:bg-white/5 transition-colors">
              <Repeat className="w-4 h-4" />
              Switch to {character === 'thomas' ? 'Luca' : 'Thomas'}
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-accent to-transparent relative overflow-hidden">
            <motion.div className="absolute inset-0 bg-paper/40" animate={{ y: [0, 64] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
          </div>
        </motion.div>
      </div>

      {/* ========== BENTO GRID STATS ========== */}
      <div ref={statsRef} className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-[1px] w-12 bg-accent" />
          <span className="font-cinzel text-sm tracking-[0.3em] uppercase text-accent">Operations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[480px]">
          {/* Main Stat Card (Large) */}
          <motion.div
            className="md:col-span-2 md:row-span-2 glass-card rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative"
            onMouseEnter={() => playSFX('hover_sweep')}
            initial={{ opacity: 0, scale: 0.9 }} animate={statsIn ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8 }}
          >
            <div className="absolute -right-20 -bottom-20 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
              <TrendingUp className="w-80 h-80" />
            </div>
            <div>
              <TrendingUp className="w-10 h-10 mb-6 text-accent" />
              <h3 className="font-cinzel text-xl text-paper/40 uppercase tracking-widest mb-2">Total Ledger Value</h3>
              <p className="font-cinzel text-6xl md:text-7xl text-paper">£{cV.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 text-paper/60 font-light">
              <span className="text-green-500 font-medium">+12.5%</span>
              <span>since last month</span>
            </div>
          </motion.div>

          {/* Secondary Stat (Medium) */}
          <motion.div
            className="md:col-span-2 glass-card rounded-3xl p-8 flex items-center justify-between group"
            onMouseEnter={() => playSFX('hover_sweep')}
            initial={{ opacity: 0, x: 20 }} animate={statsIn ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <h3 className="font-cinzel text-lg text-paper/40 uppercase tracking-widest mb-1">Whiskey Stock</h3>
              <p className="font-cinzel text-5xl text-paper">{cB.toLocaleString()}</p>
              <p className="text-sm text-paper/30 mt-2 font-light tracking-wide">Bottles moving through the Midlands</p>
            </div>
            <Wine className="w-16 h-16 text-accent/20 group-hover:text-accent/40 transition-colors" />
          </motion.div>

          {/* Small Stats (Split) */}
          <motion.div
            className="glass-card rounded-3xl p-8 flex flex-col justify-center text-center group"
            onMouseEnter={() => playSFX('hover_sweep')}
            initial={{ opacity: 0, y: 20 }} animate={statsIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
          >
            <MapPin className="w-8 h-8 mx-auto mb-4 text-accent/40 group-hover:scale-110 transition-transform" />
            <span className="font-cinzel text-4xl text-paper block">
              <CinematicText text={cT} type="stat" delay={0.2} />
            </span>
            <div className="font-cinzel text-[10px] text-paper/30 uppercase tracking-widest mt-2">
              <CinematicText text="Territories" type="label" delay={0.4} />
            </div>
          </motion.div>

          <motion.div
            className="glass-card rounded-3xl p-8 flex flex-col justify-center text-center group active-shipments-bento"
            onMouseEnter={() => playSFX('hover_sweep')}
            initial={{ opacity: 0, y: 20 }} animate={statsIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative inline-block mx-auto mb-4">
              <div className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center relative">
                <span className="text-[10px] font-bold text-black">8</span>
              </div>
            </div>
            <div className="font-cinzel text-paper/40 text-[10px] uppercase tracking-widest">
              <CinematicText text="Active Runs" type="label" delay={0.5} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========== QUOTE SECTION (Wide) ========== */}
      <div ref={quoteRef} className="py-40 px-8 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span className="text-accent text-6xl font-serif block mb-8 opacity-20">"</motion.span>
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              className="font-cinzel text-3xl md:text-4xl text-paper/80 italic leading-snug tracking-wide"
            >
              <CinematicText text={quotes[quoteIdx]} type="body" stagger={0.05} />
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-12">
            {quotes.map((_, i) => (
              <div key={i} className={`h-[2px] transition-all duration-700 ${i === quoteIdx ? 'w-12 bg-accent' : 'w-4 bg-paper/10'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ========== STAMP SLAM — 3D PERSPECTIVE ========== */}
      <div ref={stampRef} className="relative min-h-[80vh] flex items-center justify-center px-8 py-24"
        style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
      >

        {/* Impact flash — full-section white/crimson flash on slam */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          initial={{ opacity: 0 }}
          animate={stampLanded ? { opacity: [0, 0.25, 0.08, 0] } : {}}
          transition={{ duration: 0.4, ease: 'easeOut', times: [0, 0.15, 0.4, 1] }}
          style={{
            background: character === 'thomas'
              ? 'radial-gradient(ellipse at center, rgba(160,20,10,0.3) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)'
              : 'radial-gradient(ellipse at center, rgba(120,10,10,0.3) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)',
          }}
        />

        {/* Screen shake wrapper */}
        <div className={`relative flex items-center justify-center w-full ${stampLanded ? 'animate-stamp-shake' : ''}`}>

          {/* ═══ INK SPLASH / SPLATTER LAYERS ═══ */}

          {/* Layer 1: Shockwave ring — expands outward from impact */}
          <motion.div
            className="absolute pointer-events-none z-0 rounded-full"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={stampLanded ? { opacity: [0, 0.5, 0.3, 0], scale: [0.2, 1.5, 2.2, 3] } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', times: [0, 0.2, 0.5, 1] }}
            style={{
              width: 600, height: 400,
              border: `2px solid rgba(${character === 'thomas' ? '150,20,15' : '120,10,10'}, 0.3)`,
              boxShadow: `0 0 40px rgba(${character === 'thomas' ? '150,20,15' : '120,10,10'}, 0.15),
                          inset 0 0 40px rgba(${character === 'thomas' ? '150,20,15' : '120,10,10'}, 0.1)`,
            }}
          />

          {/* Layer 2: Ink dust cloud */}
          <motion.div
            className="absolute pointer-events-none z-0"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={stampLanded ? { opacity: [0, 0.5, 0], scale: [0.3, 2, 3] } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              width: 800, height: 600,
              background: `radial-gradient(ellipse at center, rgba(${character === 'thomas' ? '130,20,12' : '100,8,8'}, 0.12) 0%, rgba(${character === 'thomas' ? '130,20,12' : '100,8,8'}, 0.04) 40%, transparent 65%)`,
              borderRadius: '50%',
            }}
          />

          {/* Layer 3: Large ink splatters — big visible blobs */}
          {stampLanded && [...Array(8)].map((_, i) => {
            const angle = (i / 8) * 360 + 22;
            const dist = 160 + (i % 3) * 60;
            const size = 12 + (i % 4) * 8;
            return (
              <motion.div key={`lg-${i}`}
                className="absolute pointer-events-none z-[5]"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 0.7, 0.4, 0],
                  x: Math.cos(angle * Math.PI / 180) * dist,
                  y: Math.sin(angle * Math.PI / 180) * dist,
                  scale: [0, 1.5, 1.2, 0.8],
                  rotate: angle + 45,
                }}
                transition={{ duration: 0.8, delay: 0.02 * i, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: size, height: size * 0.5,
                  background: `rgba(${character === 'thomas' ? '155,22,12' : '120,10,10'}, 0.6)`,
                  borderRadius: '50% 30% 55% 45%',
                  filter: 'blur(0.5px)',
                }}
              />
            );
          })}

          {/* Layer 4: Medium ink dots — scattered around */}
          {stampLanded && [...Array(20)].map((_, i) => {
            const angle = (i / 20) * 360 + (i * 17);
            const dist = 100 + (i % 7) * 35;
            const size = 4 + (i % 5) * 3;
            return (
              <motion.div key={`md-${i}`}
                className="absolute pointer-events-none z-[5]"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: Math.cos(angle * Math.PI / 180) * dist,
                  y: Math.sin(angle * Math.PI / 180) * dist,
                  scale: [0, 1.3, 0.6],
                }}
                transition={{ duration: 0.6, delay: 0.01 * i, ease: 'easeOut' }}
                style={{
                  width: size, height: size * 0.65,
                  background: `rgba(${character === 'thomas' ? '150,22,15' : '120,10,10'}, ${0.4 + (i % 3) * 0.15})`,
                  borderRadius: '40% 60% 45% 55%',
                }}
              />
            );
          })}

          {/* Layer 5: Fine ink mist — tiny particles for texture */}
          {stampLanded && [...Array(32)].map((_, i) => {
            const angle = (i / 32) * 360 + (i * 7);
            const dist = 60 + Math.random() * 200;
            const size = 2 + (i % 3) * 1.5;
            return (
              <motion.div key={`sm-${i}`}
                className="absolute pointer-events-none z-[5]"
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  x: Math.cos(angle * Math.PI / 180) * dist,
                  y: Math.sin(angle * Math.PI / 180) * dist,
                }}
                transition={{ duration: 0.5, delay: 0.015 * i, ease: 'easeOut' }}
                style={{
                  width: size, height: size,
                  background: `rgba(${character === 'thomas' ? '140,18,12' : '110,8,8'}, 0.35)`,
                  borderRadius: '50%',
                }}
              />
            );
          })}

          {/* ═══ THE STAMP — 3D PERSPECTIVE SLAM ═══ */}
          <motion.div
            className="relative z-10"
            initial={{
              rotateX: -80,
              y: -300,
              scale: 1.6,
              opacity: 0,
            }}
            animate={stampLanded ? {
              rotateX: [null, 0, 4, -2, 0],
              y: [null, 0, 8, -4, 0],
              scale: [null, 1, 1.04, 0.98, 1],
              scaleY: [null, 0.7, 1.12, 0.95, 1],
              scaleX: [null, 1.15, 0.92, 1.03, 1],
              opacity: [null, 1, 1, 1, 1],
            } : {}}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.3, 0.5, 0.75, 1],
            }}
            style={{
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Drop shadow — grows darker as stamp approaches paper */}
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
              initial={{ opacity: 0, scaleX: 0.2, scaleY: 0.3 }}
              animate={stampLanded ? {
                opacity: [0, 0.4, 0.25],
                scaleX: [0.2, 1.3, 1],
                scaleY: [0.3, 1.8, 1],
              } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                width: '90%', height: 35,
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)',
                filter: 'blur(14px)',
              }}
            />

            {/* The actual stamp image */}
            <motion.img
              src={character === 'thomas' ? '/stamp_peakyblinders.png' : '/stamp_changretta.png'}
              alt={character === 'thomas' ? 'By Order of the Peaky Blinders' : 'Changretta Famiglia'}
              className="w-[320px] md:w-[480px] lg:w-[600px] h-auto select-none"
              draggable={false}
              initial={{ filter: 'blur(4px) brightness(1.5)', opacity: 0 }}
              animate={stampLanded ? {
                filter: ['blur(4px) brightness(1.5)', 'blur(0px) brightness(1.05)', 'blur(0px) brightness(1)'],
                opacity: [0, 1, 1],
              } : {}}
              transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
              style={{ willChange: 'transform, filter' }}
            />

            {/* Ink pressure marks near the stamp — small splashes attached to stamp edges */}
            {stampLanded && (
              <>
                {/* Top-left splash */}
                <motion.div className="absolute -top-3 -left-4 pointer-events-none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.5, 0.3], scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{
                    width: 18, height: 8,
                    background: `rgba(${character === 'thomas' ? '150,20,12' : '120,10,10'}, 0.4)`,
                    borderRadius: '60% 40% 50% 50%',
                    transform: 'rotate(-15deg)',
                  }}
                />
                {/* Top-right splash */}
                <motion.div className="absolute -top-2 -right-5 pointer-events-none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.45, 0.25], scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                  style={{
                    width: 14, height: 10,
                    background: `rgba(${character === 'thomas' ? '150,20,12' : '120,10,10'}, 0.35)`,
                    borderRadius: '45% 55% 40% 60%',
                    transform: 'rotate(20deg)',
                  }}
                />
                {/* Bottom-left splash */}
                <motion.div className="absolute -bottom-4 left-[10%] pointer-events-none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.4, 0.2], scale: [0, 1.1, 1] }}
                  transition={{ duration: 0.4, delay: 0.14 }}
                  style={{
                    width: 20, height: 7,
                    background: `rgba(${character === 'thomas' ? '150,20,12' : '120,10,10'}, 0.3)`,
                    borderRadius: '50% 30% 55% 45%',
                    transform: 'rotate(8deg)',
                  }}
                />
                {/* Bottom-right splash */}
                <motion.div className="absolute -bottom-3 right-[8%] pointer-events-none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.5, 0.3], scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.35, delay: 0.16 }}
                  style={{
                    width: 16, height: 9,
                    background: `rgba(${character === 'thomas' ? '150,20,12' : '120,10,10'}, 0.35)`,
                    borderRadius: '55% 45% 40% 60%',
                    transform: 'rotate(-12deg)',
                  }}
                />
              </>
            )}
          </motion.div>
        </div>
      </div>


      <div ref={familyRef} className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-accent" />
              <CinematicText text="The Inner Circle" type="label" className="font-cinzel text-sm tracking-[0.3em] uppercase text-accent" />
            </div>
            <h2 className="font-cinzel text-4xl text-paper tracking-wider">
              <CinematicText text={character === 'thomas' ? 'The Shelbys' : 'The Changrettas'} type="heading" />
            </h2>
          </div>
          <div className="text-paper/30 font-light text-sm hidden md:block max-w-xs text-right">
            <CinematicText text="Loyalty is the only currency in Birmingham that never loses its value." type="body" />
          </div>
        </div>

        <div className={family.length === 6 ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" : "flex flex-wrap justify-center gap-4"}>
          {family.map((m, i) => (
            <motion.div key={m.name}
              initial={{ opacity: 0, y: 50 }}
              animate={familyIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className={`group ${family.length < 6 ? "w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[18%]" : ""} z-10 hover:z-50`}
              onMouseEnter={() => playSFX('hover_sweep')}
              onClick={() => setFlippedCard(flippedCard === i ? null : i)}>
              {/* Event handler container for mouse tracking */}
              <div
                className="relative h-[340px] cursor-pointer group/card [perspective:1000px]"
                onMouseMove={(e) => {
                  const card = e.currentTarget.firstElementChild as HTMLElement;
                  if (!card) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  // Calculate dynamic rotation based on cursor pos (max 15 deg)
                  const rotateX = ((y - centerY) / centerY) * -15;
                  const rotateY = ((x - centerX) / centerX) * 15;

                  // Apply 3D transform with pop-out styling
                  card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                  card.style.transition = 'none'; // Instant follow without lag
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget.firstElementChild as HTMLElement;
                  if (!card) return;
                  // Snap back to origin
                  card.style.transform = `translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)`;
                  card.style.transition = 'transform 0.5s ease-out'; // Restore smooth easing
                }}
              >
                {/* 3D Parallax Object Layer */}
                <div className="w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-[.group/card]:hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.8)] rounded-2xl">
                  {/* Flip Wrapper */}
                  <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flippedCard === i ? '[transform:rotateY(180deg)]' : ''}`}>

                    {/* Front Face */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform-style:preserve-3d]">
                      {/* Background Block (Handles overflow clipping and glass reflection) */}
                      <div className="absolute inset-0 glass-card rounded-2xl overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0a0a0a] via-[rgba(10,10,10,0.8)] to-transparent pointer-events-none z-0" />
                        <div className="absolute inset-0 opacity-[0.22] text-white pointer-events-none group-[.group/card]:hover:opacity-[0.35] transition-opacity duration-1000 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
                          {/* Inner layer parallax on hover */}
                          <div className="w-full h-full origin-top group-[.group/card]:hover:scale-105 group-[.group/card]:hover:-translate-y-2 transition-transform duration-1000 [&>img]:!object-cover [&>img]:!object-top [&>img]:!w-full [&>img]:!h-full">
                            {m.silhouette}
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 group-[.group/card]:hover:w-full bg-accent transition-all duration-700 z-20" />
                      </div>

                      {/* Content Block (Floating via translateZ for depth separation) */}
                      <div className="relative z-10 w-full h-full p-5 flex flex-col items-center justify-end text-center [transform:translateZ(50px)] drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] pointer-events-none [backface-visibility:hidden]">
                        <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center mb-3 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                          <span className="font-cinzel text-[10px] text-accent tracking-widest">{m.init}</span>
                        </div>
                        <h3 className="font-cinzel text-base md:text-lg text-paper mb-1 whitespace-pre-line leading-tight drop-shadow-[0_5px_10px_rgba(0,0,0,1)]">
                          {m.name.split(' ').map((word, wordIdx) => (
                            <span key={wordIdx} className="block">
                              <CinematicText text={word} type="heading" delay={0.2 + wordIdx * 0.15} />
                            </span>
                          ))}
                        </h3>
                        <div className="text-accent text-[9px] uppercase tracking-[0.25em] drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] pb-1">
                          <CinematicText text={m.role} type="label" delay={0.4} />
                        </div>
                      </div>
                    </div>

                    {/* Back Face (3D Flip) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] [transform-style:preserve-3d]">
                      {/* Back Background Block */}
                      <div className="absolute inset-0 glass-card rounded-2xl overflow-hidden shadow-2xl border border-accent/20 bg-[#0a0a0a]/95 [backface-visibility:hidden]" />

                      {/* Back Content Block (Floating via translateZ) */}
                      <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center [transform:translateZ(40px)] pointer-events-auto [backface-visibility:hidden]">
                        <p className="font-cinzel text-paper text-sm md:text-base italic leading-relaxed font-light drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                          "{m.back}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="py-40 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="font-cinzel text-accent tracking-[0.5em] uppercase text-sm mb-12 block">
            <CinematicText text="Ready for your next run?" type="label" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <button onClick={() => onNavigate('ledger')} className="font-cinzel text-5xl md:text-7xl text-paper tracking-tighter hover:text-accent transition-colors duration-500">
              <CinematicText text="OPEN THE LEDGER" type="heading" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
