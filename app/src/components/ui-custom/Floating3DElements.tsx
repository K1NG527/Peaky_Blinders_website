import { useEffect, useState, useMemo } from 'react';
import { useCharacter } from '@/context/CharacterContext';

export function Floating3DElements() {
  const { theme, character } = useCharacter();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({
      x: (e.clientX / innerWidth - 0.5) * 2,
      y: (e.clientY / innerHeight - 0.5) * 2,
    });
    addEventListener('mousemove', h, { passive: true });
    return () => removeEventListener('mousemove', h);
  }, []);

  const elements = useMemo(() => [
    { id: 1, x: 12, y: 15, depth: 0.3, size: 120, image: '/peaky_cap.png', speed: 5, opacity: 0.1 },
    { id: 2, x: 82, y: 55, depth: 0.6, size: 80, image: '/gold_chain.png', speed: 7, opacity: 0.06 },
    { id: 3, x: 75, y: 10, depth: 0.15, size: 60, image: '/peaky_cap.png', speed: 6, opacity: 0.05 },
  ], []);

  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2,
      duration: `${5 + Math.random() * 12}s`,
      delay: `${Math.random() * 8}s`,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" style={{ perspective: 1200 }}>
      {elements.map(el => (
        <div key={el.id} className="absolute" style={{
          left: `${el.x}%`, top: `${el.y}%`, width: el.size,
          transform: `translateX(${mouse.x * el.depth * 30}px) translateY(${mouse.y * el.depth * 20}px) translateZ(${el.depth * 100}px) rotateY(${mouse.x * el.depth * 12}deg) rotateX(${mouse.y * el.depth * -8}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d', willChange: 'transform',
        }}>
          <img src={el.image} alt="" className="w-full h-auto" style={{
            opacity: el.opacity,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
            animation: `gentleFloat ${el.speed}s ease-in-out infinite`,
          }} />
        </div>
      ))}

      {/* Silhouette — deepest parallax */}
      <div className="absolute bottom-0 left-0 w-72" style={{
        transform: `translateX(${mouse.x * -20}px) translateY(${mouse.y * -8}px)`,
        transition: 'transform 0.5s ease',
        maskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
      }}>
        <img src={character === 'thomas' ? '/thomas_silhouette.png' : '/luca_silhouette.png'} alt="" className="w-full h-auto opacity-20" />
      </div>

      {/* Ambient particles */}
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{
          left: p.left, top: p.top, width: p.size, height: p.size,
          background: theme.particleColor,
          animation: `particlePulse ${p.duration} ease-in-out infinite`,
          animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}
