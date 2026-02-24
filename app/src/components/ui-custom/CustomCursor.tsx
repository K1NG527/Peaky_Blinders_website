import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [randomX] = useState(() => -8 + Math.random() * 5);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            if (cursorRef.current) {
                // Use requestAnimationFrame for smoother mapping
                requestAnimationFrame(() => {
                    if (cursorRef.current) {
                        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                    }
                });
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (['button', 'a', 'input', 'select', 'textarea'].includes(target.tagName.toLowerCase()) ||
                target.closest('button') || target.closest('a') ||
                target.getAttribute('role') === 'button' ||
                getComputedStyle(target).cursor === 'pointer') {
                setIsHovering(true);
            }
        };
        const handleMouseOut = () => setIsHovering(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{
                transform: `translate(-100px, -100px)`, // Initial hidden position
                willChange: 'transform',
            }}
        >
            <div
                className="relative"
                style={{
                    transform: `translate(-20%, -20%) scale(${isClicking ? 0.9 : isHovering ? 1.1 : 1})`,
                    transition: 'transform 0.15s ease-out'
                }}
            >
                {/* === REALISTIC CIGAR IMAGE === */}
                <img
                    src="/cigar-realistic.png"
                    alt="Cigar Cursor"
                    className="w-16 h-16 drop-shadow-2xl"
                    style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
                        transform: 'rotate(-15deg)', // Slight natural tilt
                    }}
                />

                {/* === SMOKE PHYSICS === */}
                <div className="absolute left-2 top-4 pointer-events-none">
                    {/* Smoke 1 */}
                    <motion.div
                        className="absolute -top-2 w-[2px] h-[20px] bg-gray-400 blur-[4px] opacity-40 origin-bottom"
                        animate={{
                            height: [10, 30, 40],
                            opacity: [0, 0.5, 0],
                            x: [-2, randomX, -12],
                            y: [0, -20, -35],
                            rotate: [0, -5, -10],
                        }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    />
                    {/* Smoke 2 */}
                    <motion.div
                        className="absolute -top-1 w-[3px] h-[15px] bg-slate-300 blur-[3px] opacity-30 origin-bottom"
                        animate={{
                            height: [8, 25, 30],
                            opacity: [0, 0.4, 0],
                            x: [0, -5, -8],
                            y: [0, -15, -25],
                        }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0.4, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    );
}

