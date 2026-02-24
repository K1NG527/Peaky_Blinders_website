import { motion } from 'framer-motion';
import { useCharacter } from '@/context/CharacterContext';

interface CinematicTextProps {
    text: string | number;
    type?: 'heading' | 'subheading' | 'body' | 'label' | 'stat';
    className?: string;
    delay?: number;
    stagger?: number; // Delay between chars/words
    wrapperClassName?: string;
    glossy?: boolean;
}

export function CinematicText({
    text,
    type = 'body',
    className = '',
    delay = 0,
    stagger = 0.03,
    wrapperClassName = '',
    glossy = false
}: CinematicTextProps) {
    const { character } = useCharacter();
    const stringText = String(text);

    const isThomas = character === 'thomas';

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: delay * i }
        })
    };

    // Sharp, precision reveal for headings (Characters split)
    const charVariant = {
        hidden: { y: '100%', opacity: 0 },
        visible: {
            y: '0%',
            opacity: 1,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] as any }
        }
    };

    // Smooth fade for body (Words split)
    const wordVariant = {
        hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transition: { duration: 0.6, ease: 'easeOut' as any }
        }
    };

    // Shine animation for Glossy mode
    const shineVariant = {
        initial: { backgroundPosition: '200% center' },
        animate: {
            backgroundPosition: '-200% center',
            transition: {
                repeat: Infinity,
                duration: isThomas ? 5 : 4,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ease: "linear" as any,
                repeatDelay: isThomas ? 2 : 0 // Thomas: Slash & Pause, Luca: Continuous flow
            }
        }
    };

    const gradientStyle = glossy ? {
        backgroundImage: isThomas
            ? 'linear-gradient(110deg, #6b7280 30%, #f3f4f6 45%, #ffffff 50%, #f3f4f6 55%, #6b7280 70%)'   // Sharper Silver
            : 'linear-gradient(110deg, #92400e 30%, #fcd34d 45%, #ffffff 50%, #fcd34d 55%, #92400e 70%)',  // Brighter Gold
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
        textShadow: isThomas ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 20px rgba(251, 191, 36, 0.1)' // Subtle glow to assist
    } : {};

    if (type === 'heading' || type === 'stat' || type === 'subheading') {
        const Wrapper = glossy ? motion.div : motion.div;

        // Split by character for dramatic effect
        return (
            <Wrapper
                className={`inline-block ${wrapperClassName}`}
                // Combine reveal and shine animations if glossy
                variants={glossy ? shineVariant : container}
                initial={glossy ? "initial" : "hidden"}
                whileInView={glossy ? "animate" : "visible"}
                animate={glossy ? "animate" : undefined}
                viewport={{ once: true, margin: '-10%' }}
                style={undefined}
            >
                {/* 
                   If glossy, we render a single motion element for the text to ensure the gradient is continuous.
                   The split-char reveal is tricky with background-clip on parent. 
                   Compromise: animating the parent opacity/y for glossy to keep it simple and robust, 
                   OR applying the clip to the wrapper and animating opacity of children? 
                   Let's try animating the wrapper for the reveal + shine to ensure the gradient stays consistent.
                   Actually, if we want the SWEEP reveal, we need the container to mask.
                */}
                {glossy ? (
                    <motion.span
                        initial={{ opacity: 0, y: 20, filter: 'blur(8px)', backgroundPosition: '200% center' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        animate={{ backgroundPosition: '-200% center' }}
                        viewport={{ once: true }}
                        transition={{
                            opacity: { duration: 1, delay: delay },
                            y: { duration: 1, delay: delay },
                            filter: { duration: 1, delay: delay },
                            backgroundPosition: {
                                repeat: Infinity,
                                duration: isThomas ? 5 : 4,
                                ease: "linear",
                                repeatDelay: isThomas ? 2 : 0
                            }
                        }}
                        className={`block ${className} ${glossy ? 'cinematic-shine' : ''}`}
                        style={gradientStyle}
                    >
                        {stringText}
                    </motion.span>
                ) : (
                    // Standard Split-Character Reveal
                    <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="inline-block overflow-hidden">
                        {stringText.split('').map((char, index) => (
                            <motion.span
                                key={index}
                                className={`inline-block ${className}`}
                                variants={charVariant}
                                style={{ display: 'inline-block', whiteSpace: 'pre' }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </Wrapper>
        );
    }

    if (type === 'body') {
        // Split by word for readability flow
        return (
            <motion.div
                className={`inline-block ${wrapperClassName}`}
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-10%' }}
            >
                {stringText.split(' ').map((word, index) => (
                    <motion.span
                        key={index}
                        className={`inline-block mr-[0.25em] ${className}`}
                        variants={wordVariant}
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.div>
        );
    }

    // Label / Default
    return (
        <motion.span
            className={`inline-block ${className} ${wrapperClassName}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
        >
            {text}
        </motion.span>
    );
}
