import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useCharacter } from '@/context/CharacterContext';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    mood: string;
    quote?: string;
    detail: string;
    season?: string;
}

// Moods (Emojis removed per user request)
const moodConfig: Record<string, { color: string; label: string }> = {
    victory: { color: '#4ade80', label: 'Victory' },
    loss: { color: '#ef4444', label: 'Loss' },
    betrayal: { color: '#f59e0b', label: 'Betrayal' },
    alliance: { color: '#60a5fa', label: 'Alliance' },
    war: { color: '#ef4444', label: 'War' },
};

const thomasEvents: TimelineEvent[] = [
    {
        year: '1919', title: 'Return from the Tunnels', season: 'Case #001',
        description: 'Emerging from the mud of France, Thomas Shelby returns to a broken city.',
        mood: 'war',
        quote: '"I came back from France with nothing but a plan."',
        detail: 'The claykickers survived the subterranean nightmare of Gallipoli. Thomas returns completely stripped of fear, ready to elevate his family from the soot and smog of Small Heath by any means necessary.'
    },
    {
        year: '1919', title: 'The BSA Heist', season: 'Case #002',
        description: 'A misdirected shipment of crown weapons changes everything.',
        mood: 'victory',
        quote: '"Those guns are my leverage."',
        detail: 'A crate of Lewis machine guns destined for Libya inadvertently falls into Shelby hands. Instead of returning them, Thomas weaponizes the government\'s panic to bend Inspector Campbell and the local police to his will.'
    },
    {
        year: '1920', title: 'The Cheltenham Coup', season: 'Case #003',
        description: 'Taking the tracks from Billy Kimber.',
        mood: 'victory',
        detail: 'By fixing the races and engineering a high-stakes turf war against the self-proclaimed King of the Racecourses, the Peaky Blinders secure legal betting licenses and establish their absolute supremacy in the Midlands.'
    },
    {
        year: '1921', title: 'Marching South', season: 'Case #004',
        description: 'The empire pushes into the smoke-filled clubs of London.',
        mood: 'alliance',
        quote: '"Alfie, you cross me and I\'ll kill you and your dog."',
        detail: 'Small Heath is no longer enough. The Shelbys violently insert themselves into the fractured London underworld, forging a treacherous, highly volatile alliance with Camden Town\'s eccentric kingpin, Alfie Solomons.'
    },
    {
        year: '1922', title: 'Shattered Grace', season: 'Case #005',
        description: 'The agonizing cost of power.',
        mood: 'loss',
        quote: '"I have no one."',
        detail: 'At the height of their newfound legitimate wealth, an Italian bullet meant for Thomas strikes his wife, Grace. Her death fractures his soul permanently, ushering in an era of cold, absolute ruthlessness.'
    },
    {
        year: '1924', title: 'The Black Hand', season: 'Case #006',
        description: 'A vendetta carried across the Atlantic.',
        mood: 'war',
        quote: '"I\'m going to find out who sent you, and then I\'m going to kill them."',
        detail: 'Luca Changretta arrives from New York with a cadre of professional mafia assassins. John Shelby is executed on his doorstep, forcing the fractured family to retreat to Small Heath for a brutal war of survival.'
    },
    {
        year: '1926', title: 'A Seat of Power', season: 'Case #007',
        description: 'The gangster becomes the politician.',
        mood: 'victory',
        detail: 'Swapping the razor cap for the parliamentary benches, Thomas mounts a successful campaign to become the Labour MP for Birmingham South. He quickly discovers the halls of Westminster are far more deceitful than back-alley brawls.'
    },
    {
        year: '1929', title: 'The Fascist Threat', season: 'Case #008',
        description: 'An ideology more dangerous than any rival gang.',
        mood: 'betrayal',
        quote: '"There are darker forces at work now."',
        detail: 'Sir Oswald Mosley\'s hypnotic fascism grips Britain. Thomas attempts to assassinate him from within, only to be utterly betrayed by an unknown informant, leading to devastating losses and his own psychological unraveling.'
    },
    {
        year: '1934', title: 'The Final Reckoning', season: 'Case #009',
        description: 'Facing the ghosts of a lifetime of violence.',
        mood: 'victory',
        quote: '"I\'m a man who drinks smoke and eats fire. You\'ll never defeat me."',
        detail: 'Believing he is terminally ill, Thomas destroys his enemies, secures the next generation\'s future, and sets his own funeral pyre alight—only to walk away anew, finally free from the curses of the past.'
    },
];

const lucaEvents: TimelineEvent[] = [
    {
        year: '1900', title: 'Sons of Little Italy', season: 'Ledger I',
        description: 'Raised amidst the soot of industrial Birmingham.',
        mood: 'alliance',
        detail: 'Born into a tight-knit Italian immigrant enclave in the heart of Birmingham. Luca Changretta learns early that blood and loyalty are the only currencies that matter in a foreign, hostile city.'
    },
    {
        year: '1910', title: 'The Neapolitan Code', season: 'Ledger II',
        description: 'Vicente builds an underground empire behind legitimate storefronts.',
        mood: 'victory',
        detail: 'While outsiders see charming Italian restaurants and tailors, the Changrettas steadily build an undeniable underground operation specializing in protection, extortion, and fierce territorial control.'
    },
    {
        year: '1916', title: 'Sent to the New World', season: 'Ledger III',
        description: 'Across the Atlantic to learn the true nature of power.',
        mood: 'alliance',
        detail: 'To avoid the slaughter of the Great War, Vicente ships his promising son Luca off to relatives in New York City. There, Luca is forged in the fires of the American La Cosa Nostra, learning unparalleled discipline and brutality.'
    },
    {
        year: '1921', title: 'The Blood of a Brother', season: 'Ledger IV',
        description: 'The first horrific casualty of the Shelby dispute.',
        mood: 'loss',
        quote: '"My brother\'s blood cries from the ground."',
        detail: 'Angel Changretta makes the fatal mistake of threatening Shelby interests. Under Thomas\'s orders, the Peaky Blinders execute Angel, violently drawing the irreversible line between the two families.'
    },
    {
        year: '1922', title: 'A Patriarch Betrayed', season: 'Ledger V',
        description: 'The final, unforgivable insult.',
        mood: 'loss',
        quote: '"They killed my father in his own home."',
        detail: 'Trying to avenge his son, Vicente Changretta fails to assassinate Thomas Shelby. Instead, Vicente is captured and brutally murdered by Arthur. The Italian code now mandates complete and utter eradication of the Shelby line.'
    },
    {
        year: '1924', title: 'The Black Hand Arrives', season: 'Ledger VI',
        description: 'Stepping off the boat with professional killers.',
        mood: 'war',
        quote: '"Vendetta. It\'s the only thing I understand."',
        detail: 'Luca sails into Liverpool carrying the dreaded Black Hand. He doesn\'t bring street thugs; he brings disciplined, lethal mafia soldiers from Brooklyn, completely changing the rules of engagement in Birmingham.'
    },
    {
        year: '1924', title: 'Christmas Day Execution', season: 'Ledger VII',
        description: 'The first Shelby falls to the Mafia.',
        mood: 'victory',
        quote: '"One down."',
        detail: 'Luca strikes with terrifying precision. His men ambush and gun down John Shelby outside his rural estate on Christmas morning, delivering a paralyzing shock to the previously untouchable Peaky Blinders.'
    },
    {
        year: '1924', title: 'The Trap Closes', season: 'Ledger VIII',
        description: 'Betrayed by his own confidence and American rivals, Luca\'s vendetta meets its brutal end.',
        mood: 'loss',
        detail: 'Believing he has Thomas cornered in a basement distillery, Luca discovers too late that Thomas has bought off his men using rival gang contacts in Chicago. Luca dies violently on the distillery floor, ending the vendetta forever. His quest for revenge consumed him, just as it consumed his family.'
    },
];

/* ─── Premium 3D Archive Card ─── */
function ArchiveCard({
    event,
    index,
    character,
    onClick,
}: {
    event: TimelineEvent;
    index: number;
    character: 'thomas' | 'luca';
    onClick: () => void;
}) {
    // 3D Tilt Effect on mouse move
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const imagePath = `/chronicles/${character}_event_${index}.png`;
    const m = moodConfig[event.mood];

    return (
        <motion.div
            className="flex-shrink-0 cursor-pointer perspective-[1500px]"
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-[320px] h-[480px] md:w-[400px] md:h-[600px] glass-card rounded-2xl overflow-hidden border border-white/[0.05] group transition-all duration-300 hover:border-white/20 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Vintage Photo Container */}
                <div className="absolute inset-x-4 top-4 bottom-32 rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10" style={{ transform: "translateZ(30px)" }}>
                    {/* The Image */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal"
                        style={{ backgroundImage: `url(${imagePath})` }}
                    />
                    {/* Dimming / Gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

                    {/* Event Year Overlayed on image */}
                    <div className="absolute bottom-4 left-4">
                        <span className="font-cinzel text-paper/80 text-4xl font-bold tracking-widest drop-shadow-md">{event.year}</span>
                    </div>
                </div>

                {/* Card Ledger Info */}
                <div className="absolute bottom-4 left-4 right-4 h-24 flex flex-col justify-end" style={{ transform: "translateZ(40px)" }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-paper/40 font-cinzel">
                            {event.season}
                        </span>
                        <span
                            className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded"
                            style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}30` }}
                        >
                            {m.label}
                        </span>
                    </div>
                    <h3 className="font-cinzel text-xl text-paper tracking-wider leading-snug line-clamp-2">
                        {event.title}
                    </h3>
                </div>

                {/* Glare effect */}
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.05) 25%, transparent 30%)',
                        transform: "translateZ(50px)"
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

/* ─── Fullscreen Memory Expanded Vault Modal ─── */
function MemoryExpanded({
    event,
    index,
    accentRgb,
    accent,
    character,
    onClose,
}: {
    event: TimelineEvent;
    index: number;
    accentRgb: string;
    accent: string;
    character: 'thomas' | 'luca';
    onClose: () => void;
}) {
    const imagePath = `/chronicles/${character}_event_${index}.png`;
    const m = moodConfig[event.mood];

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl px-4 md:px-12 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Background absolute huge image */}
            <motion.div
                className="absolute inset-0 z-0 origin-center pointer-events-none opacity-30"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-50"
                    style={{ backgroundImage: `url(${imagePath})` }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
            </motion.div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 z-50 text-paper/50 hover:text-white transition-colors duration-300 group flex items-center gap-2"
            >
                <span className="font-cinzel text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Content Container */}
            <motion.div
                className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
                <div className="flex items-center gap-6 mb-8 mt-12">
                    <div className="h-[1px] w-12 md:w-32" style={{ background: `rgba(${accentRgb}, 0.5)` }} />
                    <span
                        className="font-cinzel text-xs md:text-sm tracking-[0.4em] uppercase"
                        style={{ color: accent }}
                    >
                        {event.season} • {event.year}
                    </span>
                    <div className="h-[1px] w-12 md:w-32" style={{ background: `rgba(${accentRgb}, 0.5)` }} />
                </div>

                <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl text-paper tracking-wider mb-8 leading-tight drop-shadow-2xl">
                    {event.title}
                </h1>

                {event.quote && (
                    <p className="font-cinzel text-2xl md:text-4xl italic text-white/90 leading-relaxed drop-shadow-2xl font-medium mb-12 max-w-4xl">
                        {event.quote}
                    </p>
                )}

                <p className="text-paper/80 text-xl md:text-2xl leading-relaxed mb-6 max-w-3xl font-light drop-shadow-md">
                    {event.description}
                </p>

                <div className="w-[1px] h-16 bg-white/20 my-6" />

                <p className="text-paper/50 text-base md:text-lg leading-relaxed max-w-4xl font-light border-white/10">
                    {event.detail}
                </p>

                {/* Minimal classification badge at the bottom */}
                <div className="mt-16 md:mt-24">
                    <span
                        className="text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border"
                        style={{ color: m.color, borderColor: `${m.color}40`, background: `${m.color}10` }}
                    >
                        File Classification: {m.label}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Main Component: The Shelby Archives ─── */
export function TimelineSection() {
    const { theme, character } = useCharacter();
    const events = character === 'thomas' ? thomasEvents : lucaEvents;

    // For horizontal scroll using standard native overflow dragging nicely
    const scrollRef = useRef<HTMLDivElement>(null);

    // State for expanded memory
    const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

    return (
        <section className="relative bg-black min-h-screen flex flex-col py-24 md:py-32 overflow-hidden select-none">
            {/* Dark, smoky, grainy background context */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/bg_texture.jpg')] opacity-[0.03] mix-blend-screen" />
                <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black to-transparent" />
                {/* Horizontal spotlight overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] bg-white opacity-[0.02] blur-[120px] rounded-full" />
            </div>

            {/* Archive Header */}
            <div className="relative z-10 px-6 md:px-16 lg:px-24 mb-16 md:mb-24 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                    <span
                        className="font-cinzel text-xs tracking-[0.4em] uppercase"
                        style={{ color: theme.accent }}
                    >
                        CONFIDENTIAL // Classified Intelligence
                    </span>
                    <div className="h-[1px] flex-1 max-w-[200px]" style={{ background: `linear-gradient(90deg, rgba(${theme.accentRgb}, 0.5), transparent)` }} />
                </div>

                <h2 className="font-cinzel text-5xl md:text-7xl lg:text-8xl text-paper tracking-widest drop-shadow-xl text-balance">
                    {character === 'thomas' ? 'The Shelby Ledgers' : 'The Black Hand Vault'}
                </h2>
                <p className="text-paper/40 font-light mt-6 max-w-2xl text-lg md:text-xl leading-relaxed">
                    {character === 'thomas'
                        ? 'Confidential records, alliances, and assassinations belonging to Thomas Michael Shelby. Drag to explore the vault.'
                        : 'The documented blood trail of the Changretta vendetta against the Peaky Blinders. Drag to explore the vault.'}
                </p>
            </div>

            {/* Horizontal Deck of Case Files */}
            <div
                className="relative z-10 w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-20 pt-10"
                ref={scrollRef}
            >
                <div className="flex gap-8 md:gap-16 px-6 md:px-16 lg:px-24 w-max">
                    {events.map((event, i) => (
                        <ArchiveCard
                            key={`${event.year}-${i}`}
                            event={event}
                            index={i}
                            character={character}
                            onClick={() => setSelectedEventIndex(i)}
                        />
                    ))}
                    {/* End cap spacer */}
                    <div className="w-12 md:w-32 flex-shrink-0 flex items-center justify-center opacity-30">
                        <div className="h-[1px] w-full" style={{ background: `rgba(${theme.accentRgb}, 1)` }} />
                    </div>
                </div>
            </div>

            {/* Instruction element */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center z-10 pointer-events-none">
                <motion.div
                    className="flex flex-col items-center gap-3 text-paper/30"
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-cinzel">Drag horizontally to inspect files</span>
                    <div className="flex gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                            <path d="M19 12H5"></path>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                            <path d="M5 12h14"></path>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </motion.div>
            </div>

            {/* The Cinematic Fullscreen Expansion Modal */}
            <AnimatePresence>
                {selectedEventIndex !== null && (
                    <MemoryExpanded
                        event={events[selectedEventIndex]}
                        index={selectedEventIndex}
                        accent={theme.accent}
                        accentRgb={theme.accentRgb}
                        character={character}
                        onClose={() => setSelectedEventIndex(null)}
                    />
                )}
            </AnimatePresence>

            {/* Global Hide Scrollbar CSS injection for this section */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </section>
    );
}
