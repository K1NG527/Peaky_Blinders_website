import { useCallback, useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export function useMagnetic(intensity: number = 0.5) {
    const ref = useRef<HTMLElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Only apply effect if mouse is relatively close
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        const radius = 100;

        if (distance < radius) {
            x.set(distanceX * intensity);
            y.set(distanceY * intensity);
        } else {
            x.set(0);
            y.set(0);
        }
    }, [intensity, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    useEffect(() => {
        const el = ref.current;
        if (el) {
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
        }
        return () => {
            if (el) {
                el.removeEventListener('mousemove', handleMouseMove);
                el.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [handleMouseMove, handleMouseLeave]);

    return { ref, x: springX, y: springY };
}
