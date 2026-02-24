import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward } from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';

interface SplashScreenProps {
    onComplete: () => void;
}

/*
 * ════════════════════════════════════════════
 *  VIDEO FILES (swap in /public):
 *    /thomas_intro.mp4  — Thomas Shelby intro
 *    /luca_intro.mp4    — Luca Changretta intro
 * ════════════════════════════════════════════
 */
const VIDEO_SOURCES = {
    thomas: '/thomas_intro.mp4',
    luca: '/luca_intro.mp4',
};

const SHELBY_S_PATH = "M60 10 C30 10, 10 30, 10 50 C10 70, 30 80, 50 80 C70 80, 90 90, 90 110 C90 130, 70 150, 40 150";

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const { theme, character } = useCharacter();
    const [stage, setStage] = useState(0);
    // 0: video + razor lines  1: monogram  2: title  3: quote  4: fade out

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 1500), // +0.3s
            setTimeout(() => setStage(2), 3500), // +0.7s
            setTimeout(() => setStage(3), 5000), // +1.0s
            setTimeout(() => setStage(4), 7000), // +1.8s
            setTimeout(() => onComplete(), 7800), // +2.0s
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    const handleSkip = useCallback(() => {
        setStage(4);
        setTimeout(() => onComplete(), 300);
    }, [onComplete]);

    const [smokeParticles] = useState(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 200 + Math.random() * 300,
            delay: Math.random() * 2,
        }))
    );

    return (
        <AnimatePresence>
            {stage < 4 ? (
                <motion.div
                    key="splash"
                    className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: theme.bg }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* ══════ CHARACTER VIDEO BACKGROUND ══════ */}
                    <video
                        autoPlay muted playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            opacity: 0.7, // Increased to 0.7 for better visibility
                            transition: 'opacity 1s ease',
                            filter: character === 'luca' ? 'hue-rotate(-30deg) saturate(1.5)' : 'none',
                        }}
                    >
                        <source src={VIDEO_SOURCES[character]} type="video/mp4" />
                    </video>

                    {/* Dark overlay — lighter now */}
                    <div className="absolute inset-0" style={{
                        background: `linear-gradient(to bottom, ${theme.bg}44, ${theme.bg}88, ${theme.bg}cc)`,
                    }} />

                    {/* Stage 0: Razor slash lines */}
                    <AnimatePresence>
                        {stage === 0 && (
                            <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <div className="razor-line" />
                                <div className="razor-line" />
                                <div className="razor-line" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stage 0: Heartbeat pulse */}
                    <AnimatePresence>
                        {stage === 0 && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="absolute w-20 h-20 rounded-full"
                                        style={{
                                            border: `1px solid rgba(${theme.accentRgb}, 0.3)`,
                                            animation: 'ringPulse 1.5s ease-out infinite',
                                            animationDelay: `${i * 0.3}s`,
                                        }}
                                    />
                                ))}
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: theme.accent,
                                        opacity: 0.6,
                                        animation: 'heartbeatPulse 1.5s ease-in-out infinite',
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stage 1: Monogram SVG Draw */}
                    <AnimatePresence>
                        {stage >= 1 && stage < 4 && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center z-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: stage === 1 ? 1 : 0.3 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="relative">
                                    <motion.div
                                        className="w-36 h-36 rounded-full flex items-center justify-center"
                                        style={{ border: `1px solid rgba(${theme.accentRgb}, 0.2)` }}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <svg viewBox="0 0 100 160" className="w-14 h-20" fill="none">
                                            <path
                                                d={SHELBY_S_PATH}
                                                className="svg-draw"
                                                stroke={theme.accent}
                                                strokeWidth="5"
                                                strokeLinecap="round"
                                                fill={theme.accent}
                                                fillOpacity="0"
                                            />
                                        </svg>
                                    </motion.div>

                                    {/* Corner marks */}
                                    {[
                                        { top: -16, left: -16, bt: true, bl: true },
                                        { top: -16, right: -16, bt: true, br: true },
                                        { bottom: -16, left: -16, bb: true, bl: true },
                                        { bottom: -16, right: -16, bb: true, br: true },
                                    ].map((pos, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-6 h-6"
                                            style={{
                                                ...(pos.top !== undefined ? { top: pos.top } : {}),
                                                ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
                                                ...(pos.left !== undefined ? { left: pos.left } : {}),
                                                ...(pos.right !== undefined ? { right: pos.right } : {}),
                                                borderTop: pos.bt ? `1px solid rgba(${theme.accentRgb}, 0.25)` : 'none',
                                                borderBottom: pos.bb ? `1px solid rgba(${theme.accentRgb}, 0.25)` : 'none',
                                                borderLeft: pos.bl ? `1px solid rgba(${theme.accentRgb}, 0.25)` : 'none',
                                                borderRight: pos.br ? `1px solid rgba(${theme.accentRgb}, 0.25)` : 'none',
                                            }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stage 2: Title Reveal */}
                    <AnimatePresence>
                        {stage >= 2 && (
                            <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-center z-30 gap-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.h1
                                    className="font-cinzel text-4xl sm:text-5xl md:text-6xl tracking-[0.2em] uppercase"
                                    style={{
                                        color: '#fff',
                                        textShadow: `0 0 60px rgba(${theme.accentRgb}, 0.5)`,
                                    }}
                                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                                    animate={{ clipPath: 'inset(0 0% 0 0)' }}
                                    transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
                                >
                                    {character === 'thomas' ? 'Shelby Company' : 'Changretta'}
                                </motion.h1>

                                <motion.div
                                    className="flex items-center gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    <motion.div
                                        className="h-px"
                                        style={{ background: `linear-gradient(to right, transparent, ${theme.accent}, transparent)` }}
                                        initial={{ width: 0 }}
                                        animate={{ width: 80 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                    />
                                    <span className="font-cinzel text-lg tracking-[0.3em]" style={{ color: theme.accent }}>
                                        {character === 'thomas' ? 'Ltd.' : 'Famiglia'}
                                    </span>
                                    <motion.div
                                        className="h-px"
                                        style={{ background: `linear-gradient(to right, transparent, ${theme.accent}, transparent)` }}
                                        initial={{ width: 0 }}
                                        animate={{ width: 80 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stage 3: Quote */}
                    <AnimatePresence>
                        {stage === 3 && (
                            <motion.div
                                className="absolute bottom-20 left-0 right-0 text-center px-8 z-30"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="font-cinzel text-sm italic max-w-xl mx-auto leading-relaxed"
                                    style={{ color: `rgba(${theme.accentRgb}, 0.5)` }}
                                >
                                    "{theme.splashQuote}"
                                </p>
                                <p className="font-cinzel text-xs mt-3 tracking-[0.2em]"
                                    style={{ color: `rgba(${theme.accentRgb}, 0.3)` }}
                                >
                                    — {theme.splashAuthor}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Ambient smoke */}
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
                                    background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.04) 0%, transparent 70%)`,
                                    filter: 'blur(40px)',
                                    animation: `smokeDrift ${15 + p.delay * 8}s ease-in-out infinite`,
                                    animationDelay: `${p.delay * 3}s`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Skip Button */}
                    <motion.button
                        onClick={handleSkip}
                        className="absolute bottom-8 right-8 z-40 flex items-center gap-2 glass-light px-5 py-2.5 rounded-full transition-all duration-300"
                        style={{ color: `rgba(${theme.accentRgb}, 0.5)` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <SkipForward className="w-3.5 h-3.5" />
                        <span className="font-cinzel text-xs tracking-[0.2em] uppercase">Skip</span>
                    </motion.button>

                    {/* Corner decorations */}
                    <div className="absolute top-8 left-8 w-12 h-12 z-20" style={{
                        borderLeft: `1px solid rgba(${theme.accentRgb}, 0.15)`,
                        borderTop: `1px solid rgba(${theme.accentRgb}, 0.15)`,
                    }} />
                    <div className="absolute top-8 right-8 w-12 h-12 z-20" style={{
                        borderRight: `1px solid rgba(${theme.accentRgb}, 0.15)`,
                        borderTop: `1px solid rgba(${theme.accentRgb}, 0.15)`,
                    }} />
                    <div className="absolute bottom-8 left-8 w-12 h-12 z-20" style={{
                        borderLeft: `1px solid rgba(${theme.accentRgb}, 0.15)`,
                        borderBottom: `1px solid rgba(${theme.accentRgb}, 0.15)`,
                    }} />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
