import { useEffect, useRef } from 'react';
import { useCharacter } from '@/context/CharacterContext';

// We'll use synth or noise for now to avoid missing asset issues, 
// but structured for easy asset swap.
export function Soundscape() {
    const { isStealthMode } = useCharacter();
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainsRef = useRef<{ [key: string]: GainNode }>({});
    const pannersRef = useRef<{ [key: string]: PannerNode }>({});

    useEffect(() => {
        // Resume context on first interaction
        const initAudio = () => {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        };

        window.addEventListener('mousedown', initAudio, { once: true });

        return () => window.removeEventListener('mousedown', initAudio);
    }, []);

    useEffect(() => {
        if (isStealthMode) return; // Silent in stealth mode maybe? Or different sounds?

        const ctx = audioCtxRef.current;
        if (!ctx) return;

        // Create 3 sources (Clock, Rain, Glass)
        // For this simulation/flex we use oscillators/noise as prototypes
        const sources = ['clock', 'rain', 'glass'];

        sources.forEach(name => {
            const gain = ctx.createGain();
            const panner = ctx.createPanner();
            panner.panningModel = 'HRTF';
            panner.distanceModel = 'inverse';

            gain.gain.value = 0; // Start silent

            // Dummy oscillators for ambient 
            const osc = ctx.createOscillator();
            if (name === 'clock') osc.type = 'square';
            else if (name === 'rain') osc.type = 'sawtooth';
            else osc.type = 'sine';

            osc.frequency.value = name === 'clock' ? 100 : (name === 'rain' ? 50 : 440);

            // Filter for "ambient" feel
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = name === 'rain' ? 400 : 800;

            osc.connect(filter);
            filter.connect(panner);
            panner.connect(gain);
            gain.connect(ctx.destination);

            osc.start();

            gainsRef.current[name] = gain;
            pannersRef.current[name] = panner;
        });

        const handleMouseMove = (e: MouseEvent) => {
            if (ctx.state !== 'running') return;

            const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
            const y = (e.clientY / window.innerHeight) * 2 - 1;

            // Position sources in 3D space
            // Clock is Top-Left
            pannersRef.current['clock']?.setPosition(-2, 2, -1);
            // Rain is everywhere but peaks at Top-Right
            pannersRef.current['rain']?.setPosition(2, 2, -1);
            // Glass is Bottom
            pannersRef.current['glass']?.setPosition(x * 5, -2, -1);

            // Map mouse proximity to gain
            const distClock = Math.hypot(x - (-0.8), y - (-0.8));
            const distRain = Math.hypot(x - (0.8), y - (-0.8));
            const distGlass = Math.hypot(x - 0, y - 0.8);

            if (gainsRef.current['clock']) gainsRef.current['clock'].gain.setTargetAtTime(Math.max(0, 0.05 - distClock * 0.02), ctx.currentTime, 0.1);
            if (gainsRef.current['rain']) gainsRef.current['rain'].gain.setTargetAtTime(Math.max(0, 0.03 - distRain * 0.01), ctx.currentTime, 0.1);
            if (gainsRef.current['glass']) gainsRef.current['glass'].gain.setTargetAtTime(Math.max(0, 0.04 - distGlass * 0.02), ctx.currentTime, 0.1);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            // Clean up audio nodes if needed, but usually context close is better
        };
    }, [isStealthMode]);

    return null; // Side-effect only component
}
