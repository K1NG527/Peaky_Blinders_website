import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Sword, Handshake, HelpCircle } from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';
import { playSFX } from '@/lib/audio';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

interface CharacterNode {
    id: string;
    name: string;
    role: string;
    initials: string;
    image: string;
    quote: string;
    aliases: string[];
    x: number; // 0–1600
    y: number; // 0–1000
}

interface Relationship {
    from: string;
    to: string;
    type: 'ally' | 'enemy' | 'neutral' | 'family';
    label: string;
}

// ── Thomas's World (positions on 1600×1000 board) ──
const thomasNodes: CharacterNode[] = [
    { id: 'thomas', name: 'Thomas Shelby', role: 'Leader of the Peaky Blinders', initials: 'TS', image: '/silhouettes/thomas.png', quote: '"I already know what I\'m going to do."', aliases: ['Tommy', 'OBE', 'The Devil'], x: 780, y: 420 },
    { id: 'arthur', name: 'Arthur Shelby', role: 'Enforcer', initials: 'AS', image: '/silhouettes/arthur.png', quote: '"BY ORDER OF THE PEAKY BLINDERS!"', aliases: ['The Mad Dog'], x: 380, y: 200 },
    { id: 'polly', name: 'Polly Gray', role: 'Treasurer & Matriarch', initials: 'PG', image: '/silhouettes/polly.png', quote: '"When you\'re dead already, you\'re free."', aliases: ['Aunt Pol', 'Elizabeth'], x: 1180, y: 200 },
    { id: 'john', name: 'John Shelby', role: 'Soldier', initials: 'JS', image: '/silhouettes/john.png', quote: '"Who the hell are you?"', aliases: ['Johnny Boy'], x: 250, y: 500 },
    { id: 'ada', name: 'Ada Shelby', role: 'Diplomat', initials: 'AD', image: '/silhouettes/ada.png', quote: '"I am not just a Shelby."', aliases: ['Ada Thorne'], x: 1300, y: 500 },
    { id: 'alfie', name: 'Alfie Solomons', role: 'Ally / Rival', initials: 'AF', image: '/silhouettes/alfie.png', quote: '"Big fucks small."', aliases: ['The Wandering Jew'], x: 180, y: 780 },
    { id: 'grace', name: 'Grace Shelby', role: 'Wife & Spy', initials: 'GS', image: '/silhouettes/thomas.png', quote: '"You have no idea what I am."', aliases: ['Grace Burgess'], x: 780, y: 120 },
    { id: 'luca', name: 'Luca Changretta', role: 'Nemesis', initials: 'LC', image: '/silhouettes/luca.png', quote: '"Vendetta."', aliases: ['The Italian'], x: 1350, y: 800 },
    { id: 'campbell', name: 'Major Campbell', role: 'Antagonist', initials: 'MC', image: '/silhouettes/thomas.png', quote: '"I am the law."', aliases: ['Inspector Campbell'], x: 780, y: 800 },
    { id: 'mosley', name: 'Oswald Mosley', role: 'Political Foe', initials: 'OM', image: '/silhouettes/thomas.png', quote: '"The future belongs to the fascist."', aliases: ['Sir Oswald'], x: 500, y: 780 },
];

const thomasRelationships: Relationship[] = [
    { from: 'thomas', to: 'arthur', type: 'family', label: 'Brothers — bound by blood and war' },
    { from: 'thomas', to: 'polly', type: 'family', label: 'Aunt — his counsel and conscience' },
    { from: 'thomas', to: 'john', type: 'family', label: 'Brothers — loyal soldier' },
    { from: 'thomas', to: 'ada', type: 'family', label: 'Sister — independent spirit' },
    { from: 'thomas', to: 'grace', type: 'ally', label: 'Wife — his only vulnerability' },
    { from: 'thomas', to: 'alfie', type: 'neutral', label: 'Unpredictable alliance — mutual respect' },
    { from: 'thomas', to: 'luca', type: 'enemy', label: 'Vendetta — blood feud' },
    { from: 'thomas', to: 'campbell', type: 'enemy', label: 'Obsessive pursuer' },
    { from: 'thomas', to: 'mosley', type: 'enemy', label: 'Political enemy — fascist threat' },
    { from: 'arthur', to: 'john', type: 'family', label: 'Brothers' },
    { from: 'polly', to: 'ada', type: 'family', label: 'Aunt and niece' },
    { from: 'luca', to: 'alfie', type: 'neutral', label: 'Italian-Jewish tensions' },
];

// ── Luca's World ──
const lucaNodes: CharacterNode[] = [
    { id: 'luca', name: 'Luca Changretta', role: 'Don of the Changretta Family', initials: 'LC', image: '/silhouettes/luca.png', quote: '"Vendetta."', aliases: ['The Italian', 'Don Luca'], x: 780, y: 420 },
    { id: 'angel', name: 'Angel Changretta', role: 'Brother & Soldier', initials: 'AC', image: '/silhouettes/angel.png', quote: '"For the family."', aliases: ['Little Angel'], x: 450, y: 180 },
    { id: 'vicente', name: 'Vicente Changretta', role: 'Father & Patriarch', initials: 'VC', image: '/silhouettes/vicente.png', quote: '"An eye for an eye."', aliases: ['The Old Don'], x: 1100, y: 180 },
    { id: 'audrey', name: 'Audrey Changretta', role: 'Mother', initials: 'AU', image: '/silhouettes/audrey.png', quote: '"Never forgive. Never forget."', aliases: ['Mamma Changretta'], x: 780, y: 100 },
    { id: 'thomas', name: 'Thomas Shelby', role: 'Primary Target', initials: 'TS', image: '/silhouettes/thomas.png', quote: '"I already know what I\'m going to do."', aliases: ['Tommy', 'OBE'], x: 200, y: 700 },
    { id: 'arthur', name: 'Arthur Shelby', role: 'Target', initials: 'AS', image: '/silhouettes/arthur.png', quote: '"BY ORDER OF THE PEAKY BLINDERS!"', aliases: ['The Mad Dog'], x: 520, y: 750 },
    { id: 'polly', name: 'Polly Gray', role: 'Target', initials: 'PG', image: '/silhouettes/polly.png', quote: '"When you\'re dead already, you\'re free."', aliases: ['Aunt Pol'], x: 850, y: 780 },
    { id: 'alfie', name: 'Alfie Solomons', role: 'Hired Gun', initials: 'AF', image: '/silhouettes/alfie.png', quote: '"Big fucks small."', aliases: ['The Wandering Jew'], x: 1280, y: 550 },
    { id: 'matteo', name: 'Matteo', role: 'Loyal Soldier', initials: 'MT', image: '/silhouettes/matteo.png', quote: '"It is done."', aliases: ['The Professional'], x: 300, y: 430 },
];

const lucaRelationships: Relationship[] = [
    { from: 'luca', to: 'angel', type: 'family', label: 'Brother — killed by Shelbys' },
    { from: 'luca', to: 'vicente', type: 'family', label: 'Father — murdered, vendetta begins' },
    { from: 'luca', to: 'audrey', type: 'family', label: 'Mother — demands vengeance' },
    { from: 'luca', to: 'thomas', type: 'enemy', label: 'Primary target — blood debt' },
    { from: 'luca', to: 'arthur', type: 'enemy', label: 'Target — Shelby brother' },
    { from: 'luca', to: 'polly', type: 'enemy', label: 'Target — Shelby matriarch' },
    { from: 'luca', to: 'alfie', type: 'neutral', label: 'Hired to betray Shelbys' },
    { from: 'luca', to: 'matteo', type: 'ally', label: 'Loyal soldier from New York' },
    { from: 'angel', to: 'vicente', type: 'family', label: 'Father and son' },
];

const typeColors: Record<string, string> = {
    family: '#c9a86c',
    ally: '#4ade80',
    enemy: '#ef4444',
    neutral: '#888888',
};

const typeIcons: Record<string, React.ElementType> = {
    family: Shield,
    ally: Handshake,
    enemy: Sword,
    neutral: HelpCircle,
};

const BOARD_W = 1600;
const BOARD_H = 1000;

/* ═══════════════════════════════════════════
   TYPEWRITER HOOK
   ═══════════════════════════════════════════ */
function useTypewriter(text: string, speed = 30) {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        setDisplayed('');
        if (!text) return;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);
    return displayed;
}

/* ═══════════════════════════════════════════
   CATENARY STRING PATH
   ═══════════════════════════════════════════ */
function catenaryPath(x1: number, y1: number, x2: number, y2: number, sag = 40): string {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + sag;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function RelationshipWeb() {
    const { theme, character } = useCharacter();
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [hoveredLine, setHoveredLine] = useState<string | null>(null);

    // Drag-to-pan state
    const containerRef = useRef<HTMLDivElement>(null);
    const [pan, setPan] = useState({ x: -400, y: -200 });
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const panStart = useRef({ x: 0, y: 0 });

    const nodes = character === 'thomas' ? thomasNodes : lucaNodes;
    const relationships = character === 'thomas' ? thomasRelationships : lucaRelationships;

    const selectedCharacter = nodes.find(n => n.id === selectedNode);

    const connectedRelationships = useMemo(() => {
        if (!selectedNode) return [];
        return relationships.filter(r => r.from === selectedNode || r.to === selectedNode);
    }, [selectedNode, relationships]);

    const connectedIds = useMemo(() => {
        if (!selectedNode) return new Set<string>();
        const ids = new Set<string>();
        connectedRelationships.forEach(r => { ids.add(r.from); ids.add(r.to); });
        return ids;
    }, [selectedNode, connectedRelationships]);

    // Typewriter for dossier
    const dossierName = useTypewriter(selectedCharacter?.name || '', 40);
    const dossierRole = useTypewriter(selectedCharacter?.role || '', 25);
    const dossierQuote = useTypewriter(selectedCharacter?.quote || '', 20);

    // ── Drag handlers ──
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        // Don't start drag if clicking a card
        if ((e.target as HTMLElement).closest('[data-card]')) return;
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        panStart.current = { ...pan };
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }, [pan]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPan({
            x: Math.max(-(BOARD_W - 800), Math.min(0, panStart.current.x + dx)),
            y: Math.max(-(BOARD_H - 400), Math.min(0, panStart.current.y + dy)),
        });
    }, []);

    const handlePointerUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    const handleCardClick = useCallback((nodeId: string) => {
        playSFX('tick');
        setSelectedNode(prev => prev === nodeId ? null : nodeId);
    }, []);

    return (
        <div className="min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[1px] w-12" style={{ background: theme.accent }} />
                        <span className="font-cinzel text-sm tracking-[0.3em] uppercase" style={{ color: theme.accent }}>
                            Intelligence
                        </span>
                    </div>
                    <h1 className="font-cinzel text-4xl md:text-5xl text-paper tracking-wider">
                        {character === 'thomas' ? 'The Shelby Network' : 'Changretta Connections'}
                    </h1>
                    <p className="text-paper/40 mt-3 max-w-lg font-light">
                        {character === 'thomas'
                            ? 'Every alliance and every enemy. Drag to navigate. Click a pin to investigate.'
                            : 'The web of vengeance. Drag to navigate. Click a pin to investigate.'}
                    </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    {/* ═══ THE BOARD ═══ */}
                    <div
                        ref={containerRef}
                        className="flex-1 relative overflow-hidden rounded-2xl select-none"
                        style={{
                            height: 600,
                            cursor: isDragging.current ? 'grabbing' : 'grab',
                            // Corkboard background
                            background: `
                linear-gradient(135deg, #3d2b1f 0%, #2a1f15 40%, #1e1610 100%)
              `,
                            boxShadow: 'inset 0 2px 30px rgba(0,0,0,0.6), 0 0 0 2px rgba(139,90,43,0.3)',
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        {/* Cork texture overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            backgroundImage: `
                radial-gradient(ellipse at 20% 50%, rgba(139,90,43,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 30%, rgba(139,90,43,0.06) 0%, transparent 50%),
                radial-gradient(circle at 50% 80%, rgba(139,90,43,0.04) 0%, transparent 40%)
              `,
                        }} />

                        {/* Grain noise on board */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                                backgroundSize: '200px 200px',
                            }}
                        />

                        {/* Pannable board content */}
                        <div
                            style={{
                                width: BOARD_W,
                                height: BOARD_H,
                                transform: `translate(${pan.x}px, ${pan.y}px)`,
                                transition: isDragging.current ? 'none' : 'transform 0.15s ease-out',
                                position: 'relative',
                            }}
                        >
                            {/* ═══ STRING CONNECTIONS (SVG) ═══ */}
                            <svg
                                className="absolute inset-0"
                                width={BOARD_W}
                                height={BOARD_H}
                                style={{ pointerEvents: 'none', zIndex: 1 }}
                            >
                                <defs>
                                    <filter id="stringGlow">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                {relationships.map((r, i) => {
                                    const from = nodes.find(n => n.id === r.from);
                                    const to = nodes.find(n => n.id === r.to);
                                    if (!from || !to) return null;

                                    const lineId = `${r.from}-${r.to}`;
                                    const isHovered = hoveredLine === lineId;
                                    const isConnected = selectedNode && (r.from === selectedNode || r.to === selectedNode);
                                    const isDimmed = selectedNode && !isConnected;
                                    const color = typeColors[r.type];

                                    // String connects from center of each card (80x100 cards)
                                    const x1 = from.x + 40, y1 = from.y + 50;
                                    const x2 = to.x + 40, y2 = to.y + 50;
                                    const d = catenaryPath(x1, y1, x2, y2, 30 + Math.abs(x1 - x2) * 0.03);
                                    const mx = (x1 + x2) / 2;
                                    const my = (y1 + y2) / 2 + 15;

                                    return (
                                        <g key={i}>
                                            {/* Glow for connected/hovered */}
                                            {(isConnected || isHovered) && (
                                                <path d={d} fill="none" stroke={color} strokeWidth="4" strokeOpacity="0.2" filter="url(#stringGlow)" />
                                            )}

                                            {/* The string itself */}
                                            <path
                                                d={d}
                                                fill="none"
                                                stroke={isDimmed ? 'rgba(100,60,30,0.15)' : color}
                                                strokeWidth={isConnected || isHovered ? 2.5 : 1.5}
                                                strokeOpacity={isDimmed ? 0.3 : isConnected || isHovered ? 0.9 : 0.5}
                                                strokeLinecap="round"
                                                style={{ pointerEvents: 'stroke', cursor: 'pointer', transition: 'all 0.4s ease' }}
                                                onMouseEnter={() => setHoveredLine(lineId)}
                                                onMouseLeave={() => setHoveredLine(null)}
                                            >
                                                {!isDimmed && (
                                                    <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="3s" repeatCount="indefinite" />
                                                )}
                                            </path>

                                            {/* Handwritten label on hover */}
                                            {(isHovered || isConnected) && (
                                                <foreignObject x={mx - 100} y={my - 14} width={200} height={30}>
                                                    <div style={{
                                                        fontFamily: "'Caveat', cursive",
                                                        fontSize: '14px',
                                                        color: color,
                                                        textAlign: 'center',
                                                        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {r.label}
                                                    </div>
                                                </foreignObject>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* ═══ CHARACTER CARDS (pinned photos) ═══ */}
                            {nodes.map((node) => {
                                const isSelected = selectedNode === node.id;
                                const isDimmed = selectedNode && !connectedIds.has(node.id);
                                const color = isSelected ? theme.accent : typeColors[
                                    relationships.find(r => (r.from === node.id || r.to === node.id) && (r.from === (character === 'thomas' ? 'thomas' : 'luca') || r.to === (character === 'thomas' ? 'thomas' : 'luca')))?.type || 'neutral'
                                ];

                                return (
                                    <motion.div
                                        key={node.id}
                                        data-card
                                        className="absolute z-10 group"
                                        style={{
                                            left: node.x,
                                            top: node.y,
                                            width: 80,
                                        }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: isDimmed ? 0.25 : 1,
                                            scale: isSelected ? 1.15 : 1,
                                        }}
                                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                                        onClick={() => handleCardClick(node.id)}
                                        whileHover={{ scale: isDimmed ? 1 : 1.08 }}
                                    >
                                        {/* Thumb-tack pin */}
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full"
                                            style={{
                                                background: `radial-gradient(circle at 35% 35%, #d4443e, #8b1a15)`,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(0,0,0,0.3)',
                                            }}
                                        >
                                            {/* Pin highlight */}
                                            <div className="absolute top-[2px] left-[3px] w-[5px] h-[3px] rounded-full bg-white/30" />
                                        </div>
                                        {/* Pin shadow on board */}
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full bg-black/20 blur-[1px]" />

                                        {/* Photo card */}
                                        <div
                                            className="relative overflow-hidden rounded-sm transition-all duration-300"
                                            style={{
                                                background: 'linear-gradient(145deg, #2a2218, #1a1510)',
                                                border: `1px solid ${isSelected ? theme.accent + '60' : 'rgba(139,90,43,0.2)'}`,
                                                boxShadow: isSelected
                                                    ? `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${theme.accent}30`
                                                    : '0 4px 15px rgba(0,0,0,0.5)',
                                                transform: `rotate(${(node.x * 0.02 - 8) % 7}deg)`,
                                            }}
                                        >
                                            {/* Character silhouette */}
                                            <div className="w-full h-20 overflow-hidden relative"
                                                style={{ background: 'linear-gradient(180deg, rgba(30,20,12,0.8), rgba(20,14,8,0.95))' }}>
                                                <img
                                                    src={node.image}
                                                    alt={node.name}
                                                    className="w-full h-full object-contain opacity-70 mix-blend-luminosity"
                                                    style={{ filter: 'sepia(0.3) contrast(1.2) brightness(0.8)' }}
                                                />
                                                {/* Burn edge vignette */}
                                                <div className="absolute inset-0" style={{
                                                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(20,12,6,0.8) 100%)',
                                                }} />
                                            </div>

                                            {/* Name strip */}
                                            <div className="px-2 py-1.5 text-center" style={{ background: 'rgba(20,14,8,0.9)' }}>
                                                <p className="font-cinzel text-[9px] tracking-[0.12em] uppercase truncate"
                                                    style={{ color: isSelected ? theme.accent : 'rgba(200,180,150,0.7)' }}>
                                                    {node.name.split(' ')[0]}
                                                </p>
                                                <p className="text-[7px] uppercase tracking-wider mt-0.5"
                                                    style={{ color: color + '80' }}>
                                                    {node.role.split(' ')[0]}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Board edge darkening */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)',
                        }} />

                        {/* Legend */}
                        <div className="absolute bottom-4 left-4 z-20 backdrop-blur-sm rounded-lg px-4 py-3"
                            style={{ background: 'rgba(10,8,5,0.7)', border: '1px solid rgba(139,90,43,0.15)' }}>
                            <p className="font-cinzel text-[9px] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(200,180,150,0.4)' }}>Legend</p>
                            <div className="flex gap-4">
                                {Object.entries(typeColors).map(([type, color]) => {
                                    const Icon = typeIcons[type];
                                    return (
                                        <div key={type} className="flex items-center gap-1.5">
                                            <Icon className="w-3 h-3" style={{ color }} />
                                            <span className="text-[10px] capitalize" style={{ color: color + '99' }}>{type}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Drag hint */}
                        <div className="absolute top-4 right-4 z-20 backdrop-blur-sm rounded-lg px-3 py-2"
                            style={{ background: 'rgba(10,8,5,0.5)', border: '1px solid rgba(139,90,43,0.1)' }}>
                            <p className="text-[10px] text-paper/30 font-light">⟵ Drag to navigate ⟶</p>
                        </div>
                    </div>

                    {/* ═══ DOSSIER PANEL ═══ */}
                    <div className="w-full xl:w-80 flex-shrink-0">
                        <AnimatePresence mode="wait">
                            {selectedCharacter ? (
                                <motion.div
                                    key={selectedNode}
                                    className="relative overflow-hidden rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(20,16,10,0.95), rgba(30,24,16,0.9))',
                                        border: '1px solid rgba(139,90,43,0.2)',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                    }}
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ type: 'spring', damping: 25 }}
                                >
                                    {/* CLASSIFIED stamp */}
                                    <div className="absolute top-6 right-4 z-10 rotate-[-12deg] pointer-events-none">
                                        <span className="font-cinzel text-xl tracking-[0.3em] uppercase" style={{
                                            color: 'rgba(200,40,30,0.15)',
                                            textShadow: '0 0 20px rgba(200,40,30,0.1)',
                                        }}>
                                            CLASSIFIED
                                        </span>
                                    </div>

                                    {/* Silhouette header */}
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={selectedCharacter.image}
                                            alt=""
                                            className="w-full h-full object-contain opacity-30 mix-blend-luminosity"
                                            style={{ filter: 'sepia(0.4) contrast(1.3)' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,16,10,1)] via-[rgba(20,16,10,0.5)] to-transparent" />
                                        <button
                                            onClick={() => setSelectedNode(null)}
                                            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                            style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(200,180,150,0.5)' }}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Dossier content */}
                                    <div className="p-6 -mt-8 relative z-10 space-y-5">
                                        {/* Name — typewriter */}
                                        <div>
                                            <h3 className="font-cinzel text-xl text-paper tracking-wider">
                                                {dossierName}
                                                <span className="animate-pulse text-paper/40">|</span>
                                            </h3>
                                            <p className="text-xs uppercase tracking-[0.2em] mt-1" style={{ color: theme.accent + 'aa' }}>
                                                {dossierRole}
                                            </p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px w-full" style={{ background: 'rgba(139,90,43,0.2)' }} />

                                        {/* Quote */}
                                        <div className="pl-3" style={{ borderLeft: `2px solid ${theme.accent}30` }}>
                                            <p className="text-paper/50 text-sm italic font-light leading-relaxed">
                                                {dossierQuote}
                                            </p>
                                        </div>

                                        {/* Aliases */}
                                        <div>
                                            <p className="font-cinzel text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(200,180,150,0.35)' }}>
                                                Known Aliases
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCharacter.aliases.map(alias => (
                                                    <span key={alias} className="text-xs px-2 py-1 rounded"
                                                        style={{
                                                            background: 'rgba(139,90,43,0.08)',
                                                            color: 'rgba(200,180,150,0.6)',
                                                            border: '1px solid rgba(139,90,43,0.12)',
                                                        }}>
                                                        {alias}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px w-full" style={{ background: 'rgba(139,90,43,0.15)' }} />

                                        {/* Connections */}
                                        <div>
                                            <p className="font-cinzel text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(200,180,150,0.35)' }}>
                                                Connections
                                            </p>
                                            <div className="space-y-2">
                                                {connectedRelationships.map((r, i) => {
                                                    const Icon = typeIcons[r.type];
                                                    const otherId = r.from === selectedNode ? r.to : r.from;
                                                    const otherNode = nodes.find(n => n.id === otherId);
                                                    if (!otherNode) return null;
                                                    return (
                                                        <motion.div key={i}
                                                            className="flex items-start gap-3 p-2.5 rounded-lg transition-colors"
                                                            style={{ background: 'rgba(255,255,255,0.015)' }}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.08 }}
                                                        >
                                                            <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: typeColors[r.type] }} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-paper/70 text-xs font-cinzel truncate">{otherNode.name}</p>
                                                                <p className="text-paper/35 text-[10px] mt-0.5 leading-relaxed">{r.label}</p>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    className="rounded-2xl p-8 text-center"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(20,16,10,0.8), rgba(30,24,16,0.7))',
                                        border: '1px dashed rgba(139,90,43,0.15)',
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                                        style={{ border: `1px solid rgba(${theme.accentRgb}, 0.15)` }}>
                                        <Shield className="w-6 h-6" style={{ color: theme.accent, opacity: 0.3 }} />
                                    </div>
                                    <p className="text-paper/30 font-cinzel text-sm">Click a pinned card to view their dossier</p>
                                    <p className="text-paper/15 text-xs mt-2">Drag the board to explore the full network</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
