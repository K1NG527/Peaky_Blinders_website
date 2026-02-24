import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCharacter } from '@/context/CharacterContext';

interface CinematicHeroTitleProps {
    title: string;
    subtitle: string;
}

export function CinematicHeroTitle({ title, subtitle }: CinematicHeroTitleProps) {
    const { character } = useCharacter();
    const [hovered, setHovered] = useState(false);

    // Thomas = cold steel silver sweep | Luca = burning crimson-gold sweep
    const gradient = character === 'thomas'
        ? 'linear-gradient(110deg, #6b6b6b 0%, #a0a0a0 20%, #ffffff 30%, #a0a0a0 40%, #6b6b6b 60%)'
        : 'linear-gradient(110deg, #5a0000 0%, #8b0000 20%, #ff4500 28%, #ffd700 32%, #8b0000 40%, #5a0000 60%)';

    const glowColor = character === 'thomas'
        ? 'rgba(200, 200, 255, 0.15)'
        : 'rgba(255, 69, 0, 0.2)';

    return (
        <div className="relative z-10 text-center select-none">
            {/* Scoped keyframes — lives inside this component, no external CSS needed */}
            <style>{`
        @keyframes heroShine {
          0% { background-position: -100% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

            <motion.h1
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase' as const,
                    lineHeight: 1,
                    // The magic: inline styles = highest specificity, no conflicts
                    backgroundImage: gradient,
                    backgroundSize: '300% auto',
                    backgroundPosition: hovered ? undefined : '0% center',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    filter: hovered ? `drop-shadow(0 0 40px ${glowColor})` : 'none',
                    animation: hovered ? 'heroShine 4s linear infinite' : 'none',
                    transition: 'filter 0.4s ease',
                    cursor: 'none',
                }}
                className="text-7xl md:text-9xl"
            >
                {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1.5 }}
                style={{
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.6em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(229, 229, 229, 0.8)',
                    marginTop: '1.5rem',
                }}
                className="text-lg md:text-2xl"
            >
                {subtitle}
            </motion.p>
        </div>
    );
}
