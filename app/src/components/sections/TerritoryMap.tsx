import { useState, useRef, useMemo, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Building2, Wine, Shield, X, Crown, TrendingUp, Crosshair, AlertCircle, Users, Truck, Skull, Activity, Radio } from 'lucide-react';
import { territoryLocations, supplyRoutes, empireEvents, lucaTerritoryLocations, lucaSupplyRoutes, lucaEmpireEvents } from '@/data/mapData';
import { useCharacter } from '@/context/CharacterContext';
import type { TerritoryLocation, SupplyRoute, EmpireEvent } from '@/types';
import { toast } from 'sonner';
import { playSFX } from '@/lib/audio';

interface TerritoryMapProps {
  onLocationSelect?: (location: string) => void;
}

const markerIcons: Record<string, React.ElementType> = {
  warehouse: Building2,
  distillery: Wine,
  safehouse: Shield,
  pub: MapPin,
};

const cargoColors: Record<string, { color: string; glow: string }> = {
  whiskey: { color: '#d4a24e', glow: 'rgba(212, 162, 78, 0.4)' },
  weapons: { color: '#8b8b8b', glow: 'rgba(139, 139, 139, 0.4)' },
  opium: { color: '#9b59b6', glow: 'rgba(155, 89, 182, 0.4)' },
  goods: { color: '#5dade2', glow: 'rgba(93, 173, 226, 0.4)' },
};

const eventTypeColors: Record<string, string> = {
  success: '#4ade80',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#60a5fa',
};

// SVG viewBox is 1000x560 — positions in absolute coords
const MAP_W = 1000;
const MAP_H = 560;

const positionsAbsolute: Record<string, { x: number; y: number }> = {
  '1': { x: 300, y: 196 },
  '2': { x: 400, y: 140 },
  '3': { x: 480, y: 280 },
  '4': { x: 250, y: 308 },
  '5': { x: 420, y: 100 },
  '6': { x: 680, y: 325 },
  '7': { x: 780, y: 268 },
};

/* ─── Mini Sparkline ─── */
const Sparkline = memo(({ data, color, width = 100, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const points = data.map((v, i) => {
    const px = (i / (data.length - 1)) * width;
    const py = height - ((v - min) / range) * (height - 4) - 2;
    return `${px},${py}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sp-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#sp-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
});

/* ─── Threat Gauge ─── */
const ThreatGauge = memo(({ level }: { level: number }) => {
  const gaugeColor = level > 70 ? '#ef4444' : level > 40 ? '#f59e0b' : '#4ade80';
  const label = level > 70 ? 'HIGH RISK' : level > 40 ? 'MODERATE' : 'SECURE';
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[9px] uppercase tracking-wider text-paper/40">Threat</span>
        <span className="text-[9px] font-cinzel" style={{ color: gaugeColor }}>{label}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: gaugeColor }}
          initial={{ width: '0%' }} animate={{ width: `${level}%` }} transition={{ duration: 1 }} />
      </div>
    </div>
  );
});

/* ─── Memoized Route Component ─── */
const RoutePath = memo(({
  route,
  onHover,
  onClick,
  isHovered
}: {
  route: SupplyRoute & { d: string; midX: number; midY: number };
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  isHovered: boolean;
}) => {
  const cargo = cargoColors[route.cargoType] || cargoColors.goods;
  const isDisrupted = route.status === 'disrupted';

  return (
    <g>
      {isHovered && (
        <path d={route.d} fill="none" stroke={cargo.color} strokeWidth="6" strokeOpacity="0.15" filter="url(#routeGlow)" />
      )}
      <path
        d={route.d}
        fill="none"
        stroke={isDisrupted ? '#ef4444' : cargo.color}
        strokeWidth={isHovered ? 2.5 : 1.5}
        strokeDasharray={isDisrupted ? '8 6' : '6 4'}
        strokeOpacity={isHovered ? 0.9 : 0.45}
        strokeLinecap="round"
        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        onMouseEnter={() => onHover(route.id)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(route.id); }}
      >
        <animate attributeName="stroke-dashoffset" from="0" to={isDisrupted ? "0" : "-20"} dur="2s" repeatCount="indefinite" />
      </path>
      {!isDisrupted && (
        <>
          <circle r="4" fill={cargo.color} opacity="0.9">
            <animateMotion dur="5s" repeatCount="indefinite" path={route.d} rotate="auto" />
          </circle>
          <circle r="7" fill={cargo.color} opacity="0.2">
            <animateMotion dur="5s" repeatCount="indefinite" path={route.d} rotate="auto" />
          </circle>
        </>
      )}
      {isDisrupted && (
        <g>
          <circle cx={route.midX} cy={route.midY} r="8" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={route.midX} y={route.midY + 4} textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">✕</text>
        </g>
      )}
    </g>
  );
});

/* ─── Memoized Marker Component ─── */
const MapMarker = memo(({
  loc,
  idx,
  isHov,
  isSel,
  color,
  mapIn,
  orderMode,
  onClick,
  onHover
}: {
  loc: TerritoryLocation;
  idx: number;
  isHov: boolean;
  isSel: boolean;
  color: string;
  mapIn: boolean;
  orderMode: string;
  onClick: (loc: TerritoryLocation) => void;
  onHover: (id: string | null) => void;
}) => {
  const Icon = markerIcons[loc.type] || MapPin;
  const pos = positionsAbsolute[loc.id];
  if (!pos) return null;

  return (
    <div className="absolute z-10"
      style={{
        left: `${(pos.x / MAP_W) * 100}%`, top: `${(pos.y / MAP_H) * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}>
      <motion.div className="absolute -inset-3 rounded-full"
        style={{ border: `1px solid ${color}`, opacity: (isHov || isSel) ? 0.4 : 0.15 } as any}
        initial={{ opacity: 0, scale: 0 }}
        animate={mapIn ? { opacity: (isHov || isSel) ? 0.4 : 0.15, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }} />

      {(isHov || isSel) && (
        <div className="absolute -inset-5 rounded-full animate-ping" style={{ background: `radial-gradient(circle, ${color}40, transparent)`, animationDuration: '1.5s' }} />
      )}

      <motion.button
        className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${orderMode !== 'none' ? 'ring-2 ring-offset-1 ring-offset-transparent' : ''}`}
        style={{
          background: `radial-gradient(circle, ${color}30, ${color}10)`,
          border: `2px solid ${color}`,
          boxShadow: (isHov || isSel) ? `0 0 25px ${color}80, inset 0 0 10px ${color}20` : `0 0 8px ${color}30`,
          transform: (isHov || isSel) ? 'scale(1.3)' : 'scale(1)',
        }}
        onMouseEnter={() => onHover(loc.id)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(loc); }}
        initial={{ opacity: 0, scale: 0 }}
        animate={mapIn ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </motion.button>
    </div>
  );
});

export function TerritoryMap({ onLocationSelect }: TerritoryMapProps) {
  const { theme, character } = useCharacter();
  const headerRef = useRef(null);
  const mapRef = useRef(null);
  const headerIn = useInView(headerRef, { once: true, margin: '-40px' });
  const mapIn = useInView(mapRef, { once: true, margin: '-40px' });

  const [selectedLocation, setSelectedLocation] = useState<TerritoryLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [empirePanel, setEmpirePanel] = useState(true);
  const [orderMode, setOrderMode] = useState<'none' | 'deploy' | 'move' | 'sabotage'>('none');
  const [deployingTo, setDeployingTo] = useState<string | null>(null);

  // Empire events ticker
  const events: EmpireEvent[] = character === 'thomas' ? empireEvents : lucaEmpireEvents;
  const [tickerIndex, setTickerIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTickerIndex(i => (i + 1) % events.length), 4000);
    return () => clearInterval(t);
  }, [events.length]);

  // Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 100 });
  const bgX = useTransform(springX, x => x * -3);
  const bgY = useTransform(springY, x => x * -2);

  // Data
  const displayLocations = character === 'thomas' ? territoryLocations : lucaTerritoryLocations;
  const displayRoutes: SupplyRoute[] = character === 'thomas' ? supplyRoutes : lucaSupplyRoutes;

  const handleLocationClick = useCallback((location: TerritoryLocation) => {
    if (orderMode === 'deploy') {
      setDeployingTo(location.id);
      toast.success(`Deploying men to ${location.name}`, { description: 'Reinforcements en route.' });
      setTimeout(() => setDeployingTo(null), 3000);
      setOrderMode('none');
      return;
    }
    if (orderMode === 'sabotage') {
      toast.error(`Black Hand delivered to ${location.name}`, { description: 'Vendetta mark placed.' });
      setOrderMode('none');
      return;
    }
    // Toggle popup — don't navigate!
    playSFX('map_marker');
    setSelectedLocation(prev => prev?.id === location.id ? null : location);
    if (onLocationSelect) onLocationSelect(location.name);
  }, [onLocationSelect, orderMode]);

  const onMapMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    mouseY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const influenceColor = useCallback((level: string) => {
    if (level === 'high') return theme.accent;
    if (level === 'medium') return theme.accentLight;
    return '#666';
  }, [theme]);

  // Stats
  const stats = useMemo(() => ({
    total: displayLocations.length,
    high: displayLocations.filter(l => l.influenceLevel === 'high').length,
    contested: displayLocations.filter(l => l.influenceLevel === 'medium').length,
    value: displayLocations.reduce((s, l) => s + l.inventoryValue, 0),
  }), [displayLocations]);

  const mapBg = character === 'thomas' ? '/assets/map/birmingham_map.png' : '/assets/map/nyc_map.png';

  // Build route SVG paths using absolute coords
  const routePaths = useMemo(() => {
    return displayRoutes.map(route => {
      const from = positionsAbsolute[route.from];
      const to = positionsAbsolute[route.to];
      if (!from || !to) return null;
      const midX = (from.x + to.x) / 2;
      const midY = Math.min(from.y, to.y) - 30 - Math.abs(from.x - to.x) * 0.08;
      const d = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
      return { ...route, d, from, to, midX: (from.x + to.x) / 2, midY: (from.y + to.y) / 2 - 15 };
    }).filter(Boolean) as (SupplyRoute & { d: string; from: { x: number; y: number }; to: { x: number; y: number }; midX: number; midY: number })[];
  }, [displayRoutes]);

  return (
    <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-6">
      {/* ═══ EMPIRE OVERVIEW SIDE PANEL ═══ */}
      <AnimatePresence>
        {empirePanel && (
          <motion.div className="w-full lg:w-72 flex-shrink-0 space-y-4"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>

            {/* Empire Revenue */}
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Empire Revenue</span>
              </div>
              <p className="font-cinzel text-3xl text-paper">£{stats.value.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">+12.5%</span>
                <span className="text-paper/30 text-xs">this month</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: 'Locations', value: stats.total },
                  { label: 'High Ctrl', value: stats.high },
                  { label: 'Contested', value: stats.contested },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: `rgba(${theme.accentRgb}, 0.03)` }}>
                    <p className="font-cinzel text-lg text-paper">{s.value}</p>
                    <p className="text-[8px] text-paper/30 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Threat Levels */}
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Regional Threat</span>
              </div>
              <div className="space-y-3">
                {[
                  { region: character === 'thomas' ? 'Birmingham' : 'New York', level: 'CALM', color: '#4ade80', pulse: false },
                  { region: character === 'thomas' ? 'London' : 'Birmingham', level: 'HIGH', color: '#ef4444', pulse: true },
                ].map(r => (
                  <div key={r.region} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-paper/60 text-sm">{r.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-cinzel tracking-wider" style={{ color: r.color }}>{r.level}</span>
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                        {r.pulse && <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: r.color, opacity: 0.5 }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Crosshair className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Orders</span>
              </div>
              <div className="space-y-2">
                {[
                  { id: 'deploy' as const, label: 'Deploy Men', icon: Users, msg: 'Click a territory to deploy men.' },
                  { id: 'move' as const, label: 'Move Goods', icon: Truck, msg: 'Click a supply route to move goods.' },
                ].map(btn => (
                  <button key={btn.id}
                    onClick={() => {
                      playSFX('tick');
                      setOrderMode(orderMode === btn.id ? 'none' : btn.id);
                      if (orderMode !== btn.id) toast.info(btn.msg);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-300 ${orderMode === btn.id ? 'ring-1' : ''}`}
                    style={{
                      background: orderMode === btn.id ? `rgba(${theme.accentRgb}, 0.1)` : 'rgba(255,255,255,0.02)',
                      color: orderMode === btn.id ? theme.accent : 'rgba(255,255,255,0.5)',
                      borderColor: theme.accent,
                    }}>
                    <btn.icon className="w-4 h-4" />
                    <span className="font-cinzel text-xs tracking-wider">{btn.label}</span>
                  </button>
                ))}
                {character === 'luca' && (
                  <button
                    onClick={() => {
                      playSFX('tick');
                      setOrderMode(orderMode === 'sabotage' ? 'none' : 'sabotage');
                      if (orderMode !== 'sabotage') toast.info('Click a Shelby territory to sabotage.');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-300 ${orderMode === 'sabotage' ? 'ring-1' : ''}`}
                    style={{
                      background: orderMode === 'sabotage' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.02)',
                      color: orderMode === 'sabotage' ? '#ef4444' : 'rgba(255,255,255,0.5)',
                      borderColor: '#ef4444',
                    }}>
                    <Skull className="w-4 h-4" />
                    <span className="font-cinzel text-xs tracking-wider">Sabotage</span>
                  </button>
                )}
              </div>
            </div>

            {/* Intelligence Feed */}
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Radio className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Intelligence</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {events.map((ev, i) => (
                  <div key={ev.id}
                    className="flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors duration-500"
                    style={{ background: i === tickerIndex ? `rgba(${theme.accentRgb}, 0.04)` : 'transparent' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: eventTypeColors[ev.type] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-paper/60 leading-relaxed">{ev.text}</p>
                      <p className="text-paper/20 text-[10px] mt-0.5">{ev.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <motion.div ref={headerRef} initial={{ opacity: 0, y: 30 }} animate={headerIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div className="h-px" style={{ background: theme.accent }}
                  initial={{ width: 0 }} animate={headerIn ? { width: 48 } : {}} transition={{ duration: 0.6, delay: 0.3 }} />
                <span className="font-cinzel text-xs tracking-[0.2em] uppercase" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Strategic Operations</span>
              </div>
              <h2 className="font-cinzel text-2xl text-paper tracking-[0.15em] uppercase">Territory Map</h2>
              <p className="text-paper/40 text-sm mt-2 font-light">
                {character === 'thomas' ? 'Territories under Shelby control — Birmingham to London' : 'Changretta Family influence — New York to Boston'}
              </p>
            </div>
            <button onClick={() => setEmpirePanel(!empirePanel)}
              className="glass-light px-4 py-2 rounded-lg text-xs font-cinzel tracking-wider text-paper/50 hover:text-paper/80 transition-colors lg:hidden">
              {empirePanel ? 'Hide Panel' : 'Show Panel'}
            </button>
          </div>
        </motion.div>

        {/* ═══ THE MAP ═══ */}
        <motion.div ref={mapRef}
          className="relative glass-card overflow-hidden rounded-2xl"
          style={{ height: 560 }}
          onMouseMove={onMapMouseMove}
          initial={{ opacity: 0, scale: 0.95 }} animate={mapIn ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1 }}>

          {/* Vintage Map Background */}
          <motion.div className="absolute inset-0" style={{
            x: bgX, y: bgY,
            backgroundImage: `url(${mapBg})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'sepia(0.4) brightness(0.3) contrast(1.2)',
            transform: 'scale(1.1)',
          }} />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%), linear-gradient(135deg, rgba(${theme.accentRgb}, 0.04) 0%, transparent 50%)`,
          }} />

          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
            <defs>
              <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke={theme.accent} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
          </svg>

          {/* Territory Zones */}
          <div className="absolute" style={{
            left: '10%', top: '8%', width: '55%', height: '80%', borderRadius: '50%',
            border: `2px solid rgba(${theme.accentRgb}, 0.1)`,
            background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.06) 0%, transparent 60%)`,
            animation: 'accentPulse 6s ease-in-out infinite',
          }} />
          <div className="absolute" style={{
            left: '55%', top: '30%', width: '40%', height: '55%', borderRadius: '50%',
            border: `1px solid rgba(${theme.accentRgb}, 0.05)`,
            background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.03) 0%, transparent 60%)`,
          }} />

          {/* ═══ SUPPLY ROUTES SVG (proper viewBox!) ═══ */}
          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="none"
            style={{ pointerEvents: 'none' }}>
            <defs>
              <filter id="routeGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {routePaths.map(route => (
              <RoutePath
                key={route.id}
                route={route}
                isHovered={hoveredRoute === route.id}
                onHover={setHoveredRoute}
                onClick={() => {
                  if (orderMode === 'move') {
                    toast.success(`Moving goods: ${route.label}`, { description: 'Shipment dispatched.' });
                    setOrderMode('none');
                  }
                }}
              />
            ))}

            {/* Deploy animation: soldiers marching to target */}
            {deployingTo && positionsAbsolute[deployingTo] && (
              <>
                {[0, 1, 2].map(i => (
                  <g key={`deploy-${i}`}>
                    <circle r="3" fill={theme.accent} opacity="0.8">
                      <animate attributeName="cx" from={MAP_W / 2} to={positionsAbsolute[deployingTo].x} dur="2s" begin={`${i * 0.3}s`} fill="freeze" />
                      <animate attributeName="cy" from={MAP_H} to={positionsAbsolute[deployingTo].y} dur="2s" begin={`${i * 0.3}s`} fill="freeze" />
                      <animate attributeName="opacity" from="0.8" to="0" dur="2s" begin={`${i * 0.3}s`} fill="freeze" />
                    </circle>
                    <circle r="8" fill={theme.accent} opacity="0.15">
                      <animate attributeName="cx" from={MAP_W / 2} to={positionsAbsolute[deployingTo].x} dur="2s" begin={`${i * 0.3}s`} fill="freeze" />
                      <animate attributeName="cy" from={MAP_H} to={positionsAbsolute[deployingTo].y} dur="2s" begin={`${i * 0.3}s`} fill="freeze" />
                      <animate attributeName="opacity" from="0.15" to="0" dur="2s" begin={`${i * 0.3}s`} fill="freeze" />
                    </circle>
                  </g>
                ))}
              </>
            )}
          </svg>

          {/* Route hover tooltip */}
          <AnimatePresence>
            {hoveredRoute && (() => {
              const route = routePaths.find(r => r.id === hoveredRoute);
              if (!route) return null;
              const cargo = cargoColors[route.cargoType] || cargoColors.goods;
              return (
                <motion.div className="absolute z-40 glass-card px-4 py-3 rounded-lg pointer-events-none"
                  style={{
                    left: `${(route.midX / MAP_W) * 100}%`, top: `${(route.midY / MAP_H) * 100 - 6}%`,
                    transform: 'translate(-50%, -100%)',
                    borderColor: `${cargo.color}30`,
                  }}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
                  <p className="text-xs font-cinzel tracking-wider" style={{ color: cargo.color }}>{route.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${route.status === 'disrupted' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {route.status}
                    </span>
                    <span className="text-[10px] text-paper/30 capitalize">{route.cargoType}</span>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {displayLocations.map((loc, idx) => (
            <MapMarker
              key={loc.id}
              loc={loc}
              idx={idx}
              isHov={hoveredLocation === loc.id}
              isSel={selectedLocation?.id === loc.id}
              color={influenceColor(loc.influenceLevel)}
              mapIn={mapIn}
              orderMode={orderMode}
              onClick={handleLocationClick}
              onHover={setHoveredLocation}
            />
          ))}

          {/* ═══ IN-MAP POPUP (translucent card near the pin) ═══ */}
          <AnimatePresence>
            {selectedLocation && positionsAbsolute[selectedLocation.id] && (() => {
              const pos = positionsAbsolute[selectedLocation.id];
              const color = influenceColor(selectedLocation.influenceLevel);
              // Position popup to the right of the pin, or left if near right edge
              const popupLeft = pos.x > MAP_W * 0.6;
              const pctX = (pos.x / MAP_W) * 100;
              const pctY = (pos.y / MAP_H) * 100;

              return (
                <motion.div
                  className="absolute z-30"
                  style={{
                    left: popupLeft ? `${pctX - 2}%` : `${pctX + 2}%`,
                    top: `${Math.max(5, Math.min(pctY - 15, 55))}%`,
                    transform: popupLeft ? 'translateX(-100%)' : 'none',
                  }}
                  initial={{ opacity: 0, scale: 0.9, x: popupLeft ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                  <div className="w-72 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10"
                    style={{ background: 'rgba(10,10,10,0.85)' }}>

                    {/* Territory Image */}
                    {selectedLocation.image && (
                      <div className="relative h-28 overflow-hidden">
                        <img src={selectedLocation.image} alt={selectedLocation.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.6) contrast(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.9)] to-transparent" />
                        {/* Close button */}
                        <button onClick={(e) => { e.stopPropagation(); setSelectedLocation(null); }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-paper/50 hover:text-paper/80 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                        {/* Name overlay */}
                        <div className="absolute bottom-2 left-3">
                          <p className="font-cinzel text-sm text-paper tracking-wider drop-shadow-lg">{selectedLocation.name}</p>
                          <p className="text-[10px] capitalize" style={{ color }}>{selectedLocation.type} · {selectedLocation.personnel}</p>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {!selectedLocation.image && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-cinzel text-sm text-paper tracking-wider">{selectedLocation.name}</p>
                            <p className="text-[10px] capitalize" style={{ color }}>{selectedLocation.type} · {selectedLocation.personnel}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedLocation(null); }}
                            className="text-paper/30 hover:text-paper/60"><X className="w-3 h-3" /></button>
                        </div>
                      )}

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <p className="font-cinzel text-sm" style={{ color }}>£{selectedLocation.inventoryValue.toLocaleString()}</p>
                          <p className="text-[8px] text-paper/30 uppercase">Value</p>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <p className="font-cinzel text-sm capitalize" style={{ color }}>{selectedLocation.influenceLevel}</p>
                          <p className="text-[8px] text-paper/30 uppercase">Control</p>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <p className="font-cinzel text-sm text-green-400">Active</p>
                          <p className="text-[8px] text-paper/30 uppercase">Status</p>
                        </div>
                      </div>

                      {/* Threat gauge */}
                      {selectedLocation.threatLevel !== undefined && (
                        <ThreatGauge level={selectedLocation.threatLevel} />
                      )}

                      {/* Sparkline */}
                      {selectedLocation.revenueHistory && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] text-paper/30 uppercase tracking-wider">Revenue</span>
                            <Activity className="w-3 h-3 text-paper/20" />
                          </div>
                          <Sparkline data={selectedLocation.revenueHistory} color={color} width={240} height={32} />
                        </div>
                      )}

                      {/* Lore */}
                      {selectedLocation.lore && (
                        <p className="text-paper/30 text-[11px] leading-relaxed italic line-clamp-3">"{selectedLocation.lore}"</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Region labels */}
          <div className="absolute bottom-5 left-5 z-20 pointer-events-none">
            <p className="font-cinzel text-2xl tracking-[0.3em] uppercase" style={{ color: `rgba(${theme.accentRgb}, 0.15)` }}>
              {character === 'thomas' ? 'Birmingham' : 'New York'}
            </p>
          </div>
          <div className="absolute bottom-5 right-5 text-right z-20 pointer-events-none">
            <p className="font-cinzel text-xl tracking-[0.3em] uppercase" style={{ color: `rgba(${theme.accentRgb}, 0.1)` }}>
              {character === 'thomas' ? 'London' : 'Boston'}
            </p>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 glass-card p-4 rounded-xl z-20">
            <p className="font-cinzel text-[10px] tracking-[0.15em] uppercase mb-3" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Legend</p>
            <div className="space-y-2">
              {[{ label: 'Warehouse', icon: Building2 }, { label: 'Distillery', icon: Wine }, { label: 'Safe House', icon: Shield }, { label: 'Pub', icon: MapPin }].map(({ label, icon: LegIcon }) => (
                <div key={label} className="flex items-center gap-2">
                  <LegIcon className="w-3 h-3" style={{ color: theme.accent }} />
                  <span className="text-[10px] text-paper/60">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2.5 border-t" style={{ borderColor: `rgba(${theme.accentRgb}, 0.1)` }}>
              <p className="text-[10px] text-paper/30 mb-2">Supply Routes</p>
              {Object.entries(cargoColors).map(([type, c]) => (
                <div key={type} className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-0.5 rounded" style={{ backgroundColor: c.color }} />
                  <span className="text-[10px] text-paper/50 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crosshair */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(${theme.accentRgb}, 0.03), transparent)` }} />
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, rgba(${theme.accentRgb}, 0.03), transparent)` }} />
          </div>

          {/* Order mode indicator */}
          {orderMode !== 'none' && (
            <div className="absolute top-4 left-4 z-30 glass-card px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: orderMode === 'sabotage' ? '#ef4444' : theme.accent }} />
              <span className="text-xs font-cinzel tracking-wider" style={{ color: orderMode === 'sabotage' ? '#ef4444' : theme.accent }}>
                {orderMode === 'deploy' ? 'SELECT TARGET TERRITORY' : orderMode === 'move' ? 'SELECT TRADE ROUTE' : 'SELECT ENEMY TERRITORY'}
              </span>
              <button onClick={() => setOrderMode('none')} className="text-paper/30 hover:text-paper/60"><X className="w-3 h-3" /></button>
            </div>
          )}
        </motion.div>

        {/* ═══ LOCATION CARDS GRID ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {displayLocations.map((loc, idx) => {
            const Icon = markerIcons[loc.type] || MapPin;
            const color = influenceColor(loc.influenceLevel);
            const isSel = selectedLocation?.id === loc.id;
            return (
              <motion.div key={loc.id} onClick={() => handleLocationClick(loc)}
                className="glass-card p-4 rounded-xl cursor-pointer group transition-all duration-500 hover:-translate-y-1"
                style={{ borderColor: isSel ? `rgba(${theme.accentRgb}, 0.3)` : undefined, background: isSel ? `rgba(${theme.accentRgb}, 0.03)` : undefined }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.5 }} viewport={{ once: true }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cinzel text-sm text-paper tracking-[0.08em] truncate group-hover:text-accent transition-colors">{loc.name}</h4>
                    <p className="text-paper/30 text-[10px] capitalize mt-0.5">{loc.type} · {loc.personnel}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-paper/50 font-light">£{loc.inventoryValue.toLocaleString()}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full capitalize" style={{ background: `${color}12`, color }}>{loc.influenceLevel}</span>
                    </div>
                    {loc.revenueHistory && (
                      <div className="mt-2"><Sparkline data={loc.revenueHistory} color={color} /></div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
