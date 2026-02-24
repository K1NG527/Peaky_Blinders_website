import { useEffect, useRef } from 'react';
import { useCharacter } from '@/context/CharacterContext';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    type: 'spark' | 'smoke';
    color: string;
    alpha: number;
}

const SPARK_COLORS = ['#d4a24e', '#e8963a', '#f5c542', '#ff8c00', '#ffaa33'];
const SMOKE_COLORS = ['#888888', '#999999', '#777777', '#aaaaaa'];
const MAX_PARTICLES = 80;
const SPARK_SPEED_THRESHOLD = 8; // px/frame — above this, sparks fly

export function CursorParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -100, y: -100 });
    const prevMouseRef = useRef({ x: -100, y: -100 });
    const particlesRef = useRef<Particle[]>([]);
    const frameRef = useRef<number>(0);
    const { theme } = useCharacter();
    const themeAccentRef = useRef(theme.accent);

    // Keep accent in sync without re-creating the loop
    useEffect(() => {
        themeAccentRef.current = theme.accent;
    }, [theme.accent]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Size canvas to viewport
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Track mouse
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMouseMove);

        // Cigar tip offset — the ember is roughly at the top-left of the cigar image
        // Cigar is 64x64, rotated -15deg, translated -20%,-20%
        const tipOffsetX = 4;
        const tipOffsetY = 8;

        let smokeTimer = 0;

        const loop = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const px = prevMouseRef.current.x;
            const py = prevMouseRef.current.y;

            const dx = mx - px;
            const dy = my - py;
            const speed = Math.sqrt(dx * dx + dy * dy);

            // Emit position = cigar tip
            const emitX = mx + tipOffsetX;
            const emitY = my + tipOffsetY;

            const particles = particlesRef.current;

            // --- SPARKS: fast movement ---
            if (speed > SPARK_SPEED_THRESHOLD && particles.length < MAX_PARTICLES) {
                const count = Math.min(Math.floor(speed / 6), 4);
                for (let i = 0; i < count; i++) {
                    particles.push({
                        x: emitX + (Math.random() - 0.5) * 4,
                        y: emitY + (Math.random() - 0.5) * 4,
                        vx: (Math.random() - 0.5) * 3 - dx * 0.15,
                        vy: (Math.random() - 0.5) * 3 - dy * 0.15 - Math.random() * 2,
                        life: 0,
                        maxLife: 20 + Math.random() * 20,
                        size: 1 + Math.random() * 2.5,
                        type: 'spark',
                        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
                        alpha: 1,
                    });
                }
            }

            // --- SMOKE: continuous, more visible when slow ---
            smokeTimer++;
            const smokeInterval = speed > SPARK_SPEED_THRESHOLD ? 8 : 3;
            if (smokeTimer >= smokeInterval && particles.length < MAX_PARTICLES) {
                smokeTimer = 0;
                particles.push({
                    x: emitX + (Math.random() - 0.5) * 6,
                    y: emitY + (Math.random() - 0.5) * 4,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: -0.4 - Math.random() * 0.8,
                    life: 0,
                    maxLife: 50 + Math.random() * 40,
                    size: 4 + Math.random() * 6,
                    type: 'smoke',
                    color: SMOKE_COLORS[Math.floor(Math.random() * SMOKE_COLORS.length)],
                    alpha: 0.25 + Math.random() * 0.1,
                });
            }

            // --- UPDATE & DRAW ---
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life++;

                if (p.life >= p.maxLife) {
                    particles.splice(i, 1);
                    continue;
                }

                const progress = p.life / p.maxLife;

                if (p.type === 'spark') {
                    // Gravity
                    p.vy += 0.08;
                    p.vx *= 0.97;
                    p.vy *= 0.97;
                    p.x += p.vx;
                    p.y += p.vy;

                    const fadeAlpha = p.alpha * (1 - progress);

                    // Glow
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = fadeAlpha;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    // Smoke: drift upward, sway, expand, fade
                    p.vx += (Math.random() - 0.5) * 0.05;
                    p.x += p.vx;
                    p.y += p.vy;

                    const fadeAlpha = p.alpha * (1 - progress);
                    const expandedSize = p.size * (1 + progress * 1.5);

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, expandedSize, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = fadeAlpha * 0.6;
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            prevMouseRef.current = { x: mx, y: my };
            frameRef.current = requestAnimationFrame(loop);
        };

        frameRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9998, willChange: 'auto' }}
        />
    );
}
