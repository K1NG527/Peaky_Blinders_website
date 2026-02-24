import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmokeTransitionProps {
    isTransitioning: boolean;
    onComplete?: () => void;
    onPeak?: () => void;
}

const PEAKY_QUOTES = [
    // Standard Iconic Quotes
    "By order of the Peaky Blinders.",
    "I don't pay for suits. My suits are on the house or the house burns down.",
    "Everyone's a whore, Grace. We just sell different parts of ourselves.",
    "There is no rest for me in this world. Perhaps in the next.",
    "You can change what you do, but you can't change what you want.",
    "I have no limitations.",
    "Whiskey's good proofing water. Tells you who's real and who isn't.",
    "Lies travel faster than the truth.",
    "May you be in heaven a full half-hour before the devil knows you're dead.",
    // Slangs & Catchphrases
    "Right...",
    "To family.",
    "By order of the Peaky Fucking Blinders!",
    "Already broken.",
    "I am my own revolution.",
    "Fast women and slow horses will ruin your life.",
    "Those of you who are last will soon be first. And those of you who are downtrodden will rise up."
];

export function SmokeTransition({ isTransitioning, onComplete, onPeak }: SmokeTransitionProps) {
    const [lit, setLit] = useState(false);

    // Pick our initial quote right away when the component mounts
    const [quote, setQuote] = useState(() => PEAKY_QUOTES[Math.floor(Math.random() * PEAKY_QUOTES.length)]);

    useEffect(() => {
        if (!isTransitioning) {
            setLit(false);
            // Pre-pick the NEXT random quote while the transition barrier is hidden so it doesn't change on-screen
            setQuote(PEAKY_QUOTES[Math.floor(Math.random() * PEAKY_QUOTES.length)]);
            return;
        }

        // Start lighting up smoothly
        const lightTimer = setTimeout(() => {
            setLit(true);
        }, 400);

        // Peak reaches at 1.4s where we trigger the route change
        const peakTimer = setTimeout(() => {
            if (onPeak) onPeak();
        }, 1400);

        // Complete the transition and unmount
        const completeTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2800);

        return () => {
            clearTimeout(lightTimer);
            clearTimeout(peakTimer);
            clearTimeout(completeTimer);
        }
    }, [isTransitioning, onPeak, onComplete]);

    // Generates realistic 3D wavy smoke
    const generateSmokeWave = () => {
        // Reduced from 25 to 12 for better performance
        return Array.from({ length: 12 }).map((_, i) => {
            // Wavy horizontal spread
            const isLeft = i % 2 === 0;
            const xOffset = isLeft ? -15 - Math.random() * 30 : 15 + Math.random() * 30;

            const delay = Math.random() * 1.2;
            const duration = 1.8 + Math.random() * 1.5;

            // Varied sizes for volumetric feel
            const size = 20 + Math.random() * 50; // slightly larger to compensate for fewer particles

            return (
                <motion.div
                    key={i}
                    className="absolute bottom-0 rounded-full opacity-0 origin-center mix-blend-screen pointer-events-none"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        // Replaced expensive blur filter with a soft pseudo-gradient
                        background: 'radial-gradient(circle, rgba(180, 180, 180, 0.4) 0%, rgba(150, 150, 150, 0.1) 60%, transparent 100%)',
                    }}
                    animate={{
                        opacity: [0, 0.6 + Math.random() * 0.4, 0], // Fades in then out
                        x: [0, xOffset / 2, xOffset * 1.5, xOffset * 2], // 3D wave drift
                        y: [0, -60, -150, -300 - Math.random() * 100], // Rises up
                        scale: [1, 2, 4 + Math.random() * 2], // Expands as it rises
                        rotate: [0, (Math.random() - 0.5) * 90, (Math.random() - 0.5) * 180],
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: delay,
                        ease: "easeOut"
                    }}
                />
            );
        });
    };

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    // Pure solid black background for a true loading screen feel
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black pointer-events-none overflow-hidden"
                >
                    <motion.div
                        className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto flex-1"
                        animate={{ scale: lit ? 1.05 : 1 }}
                        transition={{ duration: 2.5, ease: 'easeOut' }}
                    >
                        {/* 3D Isometric Pipe image layer */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative flex items-center justify-center z-20 pointer-events-none"
                        >
                            <img
                                src="/pipe.png"
                                alt="3D Vintage Pipe"
                                className="w-[300px] md:w-[400px] object-contain drop-shadow-2xl brightness-110 contrast-125"
                                style={{
                                    mixBlendMode: 'screen', // Removes any black background from the image perfectly
                                }}
                            />

                            {/* Aligned Ember Glow and Dense Smoke - Lowered significantly to fit deeply INSIDE the bowl's rim perfectly */}
                            <div
                                className="absolute top-[52%] left-[30%] md:top-[52%] md:left-[30%] w-14 h-14 rounded-full z-10 flex items-center justify-center mix-blend-screen"
                                style={{ transform: 'translate(-50%, -50%)' }}
                            >
                                {/* Active burning ember properly inside the circle of the pipe */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    animate={{
                                        boxShadow: lit
                                            ? ['0 0 15px #ff4500', '0 0 35px #ff2200', '0 0 15px #ff4500']
                                            : ['0 0 0px #ff4500', '0 0 0px #ff2200', '0 0 0px #ff4500'],
                                        opacity: lit ? [0.85, 1, 0.85] : 0
                                    }}
                                    transition={{ duration: lit ? 0.3 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    style={{
                                        background: 'radial-gradient(circle, #ff9900 10%, #ff3300 50%, transparent 80%)'
                                    }}
                                />

                                {/* Realistic 3D Wavy Smoke */}
                                {lit && generateSmokeWave()}
                            </div>
                        </motion.div>

                        {/* Heavy Cloud Smoke - expanding to obscure the screen during route change */}
                        <AnimatePresence>
                            {lit && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                                    animate={{ opacity: [0, 1, 0], scale: 10, y: -100 }}
                                    transition={{ duration: 2.4, ease: "easeInOut" }}
                                    className="absolute inset-0 m-auto w-[150px] h-[150px] rounded-full pointer-events-none z-30 mix-blend-screen"
                                    style={{
                                        // Removed massive 40px blur filter and replaced with soft gradient to edge
                                        background: 'radial-gradient(circle, rgba(160, 160, 170, 0.5) 0%, rgba(160, 160, 170, 0.2) 50%, transparent 100%)',
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Random Quotes & Slangs perfectly positioned at the bottom - Quote stays visible for the whole transition */}
                    <div className="absolute bottom-12 left-6 right-6 text-center z-50 px-4">
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="font-serif italic text-base md:text-xl tracking-wide text-[#d4af37]/90 shadow-black drop-shadow-2xl max-w-3xl mx-auto leading-relaxed pb-4 inline-block"
                            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
                        >
                            "{quote}"
                        </motion.p>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
