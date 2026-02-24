import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface LiquifiedTransitionProps {
    isChanging: boolean;
    onTransitionComplete?: () => void;
}

export function LiquifiedTransition({ isChanging, onTransitionComplete }: LiquifiedTransitionProps) {
    const controls = useAnimation();

    useEffect(() => {
        if (isChanging) {
            const runTransition = async () => {
                // Distortion phase
                await controls.start({
                    baseFrequency: [0, 0.05, 0.02, 0],
                    transition: { duration: 1.2, ease: "easeInOut" }
                });
                if (onTransitionComplete) onTransitionComplete();
            };
            runTransition();
        }
    }, [isChanging, controls, onTransitionComplete]);

    return (
        <svg className="fixed pointer-events-none opacity-0" width="0" height="0">
            <defs>
                <filter id="liquify-filter">
                    <motion.feTurbulence
                        type="fractalNoise"
                        baseFrequency="0"
                        numOctaves="2"
                        result="turbulence"
                        animate={controls}
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="turbulence"
                        scale="60"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}
