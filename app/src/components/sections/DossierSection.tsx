import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote } from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';
import {
    SilhouetteThomas, SilhouetteArthur, SilhouetteJohn, SilhouettePolly, SilhouetteAda, SilhouetteAlfie,
    SilhouetteLuca, SilhouetteAngel, SilhouetteVicente, SilhouetteAudrey, SilhouetteMatteo
} from '@/components/ui-custom/CharacterSilhouettes';

interface CharacterProfile {
    id: string;
    name: string;
    role: string;
    status: 'Alive' | 'Dead' | 'Unknown';
    initials: string;
    stats: { loyalty: number; danger: number; intelligence: number };
    quote: string;
    backstory: string;
    silhouette: React.ElementType;
}

const thomasRoster: CharacterProfile[] = [
    {
        id: 'thomas', name: 'Thomas Shelby', role: 'Leader of the Peaky Blinders',
        status: 'Alive', initials: 'TS',
        stats: { loyalty: 70, danger: 95, intelligence: 98 },
        quote: "Everyone's a whore, Grace. We just sell different parts of ourselves.",
        backstory: 'A decorated war hero turned crime lord. Thomas returned from France with tunnel vision — literally and figuratively. He transformed a small Birmingham gang into a political empire, sacrificing everything human about himself along the way. His mind is a weapon, but his heart is a battlefield.',
        silhouette: SilhouetteThomas,
    },
    {
        id: 'arthur', name: 'Arthur Shelby', role: 'Enforcer & Eldest Brother',
        status: 'Alive', initials: 'AS',
        stats: { loyalty: 95, danger: 90, intelligence: 40 },
        quote: "I'm the oldest! I'm the head of this family!",
        backstory: 'Arthur is the muscle and the heart of the Shelby family. Prone to violent episodes and emotional breakdowns, he struggles between his savage nature and his desire for redemption. His loyalty to Tommy is absolute, even when it destroys him.',
        silhouette: SilhouetteArthur,
    },
    {
        id: 'john', name: 'John Shelby', role: 'Soldier & Third Brother',
        status: 'Dead', initials: 'JS',
        stats: { loyalty: 90, danger: 75, intelligence: 50 },
        quote: "Just tell me who to shoot, Tom.",
        backstory: 'The most straightforward of the Shelby brothers. John was a loyal soldier who asked few questions and fired without hesitation. His death at the hands of the Changretta family changed the Shelbys forever.',
        silhouette: SilhouetteJohn,
    },
    {
        id: 'polly', name: 'Polly Gray', role: 'Treasurer & Matriarch',
        status: 'Dead', initials: 'PG',
        stats: { loyalty: 85, danger: 65, intelligence: 92 },
        quote: "We women have to stick together. Men, they come and go.",
        backstory: 'The true spine of the Shelby empire. Polly kept the business running while the boys were at war and never let them forget it. A spiritual woman with razor-sharp instincts, she was the only person who could challenge Thomas and survive.',
        silhouette: SilhouettePolly,
    },
    {
        id: 'ada', name: 'Ada Shelby', role: 'Diplomat & Sister',
        status: 'Alive', initials: 'AD',
        stats: { loyalty: 60, danger: 30, intelligence: 85 },
        quote: "I am not just a Shelby. I am my own woman.",
        backstory: 'The most independent Shelby. Ada rejected the family business but could never fully escape it. Educated, principled, and fiercely protective of her children, she became the family\'s unlikely diplomat in London\'s political circles.',
        silhouette: SilhouetteAda,
    },
    {
        id: 'alfie', name: 'Alfie Solomons', role: 'Ally & Wildcard',
        status: 'Unknown', initials: 'AF',
        stats: { loyalty: 25, danger: 88, intelligence: 90 },
        quote: "Big fucks small. And the big, it doesn't even know the small's name.",
        backstory: 'Leader of the Jewish gang in Camden Town. Alfie is unpredictable, theatrical, and devastatingly intelligent. His relationship with Thomas oscillates between genuine respect and calculated betrayal. No one ever truly knows whose side Alfie is on.',
        silhouette: SilhouetteAlfie,
    },
];

const lucaRoster: CharacterProfile[] = [
    {
        id: 'luca', name: 'Luca Changretta', role: 'Don of the Changretta Family',
        status: 'Dead', initials: 'LC',
        stats: { loyalty: 80, danger: 90, intelligence: 85 },
        quote: "Vendetta. It's the only thing I understand.",
        backstory: 'Raised in Birmingham, hardened in New York. Luca returned to England with one purpose: to destroy every Shelby for the deaths of his father and brother. Methodical, patient, and driven by an unshakeable code of honor.',
        silhouette: SilhouetteLuca,
    },
    {
        id: 'angel', name: 'Angel Changretta', role: 'Eldest Brother',
        status: 'Dead', initials: 'AC',
        stats: { loyalty: 85, danger: 60, intelligence: 45 },
        quote: "Leave the Shelbys alone, they said. I should have listened.",
        backstory: 'Angel was the elder Changretta brother whose reckless pursuit of Lizzie Stark drew the ire of Thomas Shelby. His death was the first domino in a chain of violence that would consume both families.',
        silhouette: SilhouetteAngel,
    },
    {
        id: 'vicente', name: 'Vicente Changretta', role: 'Patriarch',
        status: 'Dead', initials: 'VC',
        stats: { loyalty: 90, danger: 55, intelligence: 70 },
        quote: "A man protects his family. That is the only law.",
        backstory: 'The respected patriarch of the Changretta family. Vicente tried to maintain peace in Birmingham while running a legitimate restaurant front. His assassination by the Peaky Blinders was the act that sent Luca on his path of vengeance.',
        silhouette: SilhouetteVicente,
    },
    {
        id: 'audrey', name: 'Audrey Changretta', role: 'Matriarch',
        status: 'Alive', initials: 'AU',
        stats: { loyalty: 95, danger: 20, intelligence: 75 },
        quote: "You must avenge your father. It is the only way.",
        backstory: 'A woman of quiet steel. After losing her husband and eldest son to the Shelbys, Audrey demanded vengeance from her surviving son Luca. She is the moral compass — or lack thereof — behind the vendetta.',
        silhouette: SilhouetteAudrey,
    },
    {
        id: 'matteo', name: 'Matteo', role: 'Soldier & Bodyguard',
        status: 'Dead', initials: 'MT',
        stats: { loyalty: 100, danger: 80, intelligence: 40 },
        quote: "I follow Luca. That is enough.",
        backstory: 'A loyal Mafia soldier who accompanied Luca from New York. Matteo was the muscle behind the vendetta operations — quiet, efficient, and completely devoted to the Changretta cause.',
        silhouette: SilhouetteMatteo,
    },
];

const statusColors: Record<string, { color: string; bg: string; border: string }> = {
    Alive: { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.25)' },
    Dead: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)' },
    Unknown: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)' },
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between">
                <span className="text-[10px] uppercase tracking-[0.15em] text-paper/40">{label}</span>
                <span className="text-[10px] text-paper/30">{value}%</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                />
            </div>
        </div>
    );
}

export function DossierSection() {
    const { theme, character } = useCharacter();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const roster = character === 'thomas' ? thomasRoster : lucaRoster;
    const selected = roster.find(c => c.id === selectedId);

    return (
        <div className="min-h-screen py-20 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[1px] w-12" style={{ background: theme.accent }} />
                        <span className="font-cinzel text-sm tracking-[0.3em] uppercase" style={{ color: theme.accent }}>
                            Classified
                        </span>
                    </div>
                    <h1 className="font-cinzel text-4xl md:text-5xl text-paper tracking-wider">
                        {character === 'thomas' ? 'Shelby Dossiers' : 'Changretta Dossiers'}
                    </h1>
                    <p className="text-paper/40 mt-3 max-w-lg font-light">
                        {character === 'thomas'
                            ? 'Profiles of the Shelby inner circle and their closest associates.'
                            : 'The Changretta family and their operatives — a record of vendetta.'}
                    </p>
                </div>

                {/* Character Grid - Single line layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {roster.map((char, i) => {
                        const s = statusColors[char.status];
                        return (
                            <motion.div
                                key={char.id}
                                className="glass-card rounded-2xl p-6 group relative overflow-hidden"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedId(char.id)}
                                style={{ cursor: 'none' }}
                            >
                                {/* Accent line */}
                                <div className="absolute top-0 left-0 w-full h-[2px]"
                                    style={{ background: `linear-gradient(90deg, transparent, rgba(${theme.accentRgb}, 0.3), transparent)` }} />

                                {/* Watermark Silhouette - Hyper-realistic V4 Waterfront */}
                                <div className="absolute -right-4 -bottom-4 w-52 h-52 opacity-[0.08] text-white pointer-events-none transform rotate-12 transition-all duration-1000 group-hover:scale-110 group-hover:-rotate-3 group-hover:opacity-[0.15]">
                                    <char.silhouette />
                                </div>

                                <div className="flex items-start justify-between mb-6">
                                    {/* Avatar */}
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                        style={{ border: `1px solid rgba(${theme.accentRgb}, 0.2)`, background: `rgba(${theme.accentRgb}, 0.05)` }}>
                                        <span className="font-cinzel text-lg font-bold" style={{ color: theme.accent }}>
                                            {char.initials}
                                        </span>
                                    </div>
                                    {/* Status badge */}
                                    <span className="text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                                        style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                                        {char.status}
                                    </span>
                                </div>

                                <h3 className="font-cinzel text-lg text-paper mb-1">{char.name}</h3>
                                <p className="text-xs text-paper/40 uppercase tracking-[0.15em] mb-5">{char.role}</p>

                                {/* Quick stats */}
                                <div className="space-y-2.5">
                                    <StatBar label="Loyalty" value={char.stats.loyalty} color={theme.accent} />
                                    <StatBar label="Danger" value={char.stats.danger} color="#ef4444" />
                                    <StatBar label="Intelligence" value={char.stats.intelligence} color="#60a5fa" />
                                </div>

                                {/* Quote preview */}
                                <div className="mt-5 pt-4" style={{ borderTop: `1px solid rgba(${theme.accentRgb}, 0.08)` }}>
                                    <p className="text-paper/30 text-xs italic line-clamp-2">"{char.quote}"</p>
                                </div>

                                {/* Hover hint */}
                                <div className="absolute bottom-3 right-4 text-[10px] text-paper/20 font-cinzel opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to open dossier →
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Full Dossier Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedId(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative glass-card rounded-2xl p-10 md:p-14 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {/* Close */}
                            <button onClick={() => setSelectedId(null)}
                                className="absolute top-6 right-6 text-paper/30 hover:text-paper/60 transition-colors"
                                style={{ cursor: 'none' }}>
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ border: `2px solid rgba(${theme.accentRgb}, 0.3)`, background: `rgba(${theme.accentRgb}, 0.08)` }}>
                                    <span className="font-cinzel text-2xl font-bold" style={{ color: theme.accent }}>
                                        {selected.initials}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-cinzel text-3xl text-paper tracking-wider">{selected.name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-paper/40 uppercase tracking-[0.15em]">{selected.role}</span>
                                        <span className="text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
                                            style={{
                                                color: statusColors[selected.status].color,
                                                background: statusColors[selected.status].bg,
                                                border: `1px solid ${statusColors[selected.status].border}`
                                            }}>
                                            {selected.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mb-8 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="text-center">
                                    <div className="font-cinzel text-2xl text-paper mb-1">{selected.stats.loyalty}%</div>
                                    <span className="text-[10px] text-paper/30 uppercase tracking-[0.15em]">Loyalty</span>
                                </div>
                                <div className="text-center">
                                    <div className="font-cinzel text-2xl mb-1" style={{ color: '#ef4444' }}>{selected.stats.danger}%</div>
                                    <span className="text-[10px] text-paper/30 uppercase tracking-[0.15em]">Danger</span>
                                </div>
                                <div className="text-center">
                                    <div className="font-cinzel text-2xl mb-1" style={{ color: '#60a5fa' }}>{selected.stats.intelligence}%</div>
                                    <span className="text-[10px] text-paper/30 uppercase tracking-[0.15em]">Intelligence</span>
                                </div>
                            </div>

                            {/* Quote */}
                            <div className="mb-8 p-6 rounded-xl" style={{ background: `rgba(${theme.accentRgb}, 0.03)`, border: `1px solid rgba(${theme.accentRgb}, 0.08)` }}>
                                <Quote className="w-5 h-5 mb-3" style={{ color: theme.accent, opacity: 0.4 }} />
                                <p className="font-cinzel text-lg text-paper/80 italic leading-relaxed">"{selected.quote}"</p>
                            </div>

                            {/* Backstory */}
                            <div>
                                <h4 className="font-cinzel text-xs text-paper/40 uppercase tracking-[0.2em] mb-4">Backstory</h4>
                                <p className="text-paper/50 leading-relaxed">{selected.backstory}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
