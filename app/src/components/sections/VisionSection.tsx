import { useEffect, useRef, useState } from 'react';

interface VisionSectionProps {
  isActive: boolean;
}

export function VisionSection({ isActive }: VisionSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-coal relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(201, 168, 108, 0.1) 10px,
              rgba(201, 168, 108, 0.1) 11px
            )`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Top Line */}
        <div
          className="mx-auto w-0 h-px bg-gradient-to-r from-transparent via-brass to-transparent mb-12"
          style={{
            width: isVisible ? '120px' : '0px',
            transition: 'width 1s ease-out 0.3s'
          }}
        />

        {/* Heading */}
        <h2
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-[0.15em] uppercase mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.5s'
          }}
        >
          This System Represents Order
        </h2>

        {/* Divider */}
        <div
          className="mx-auto w-16 h-px bg-brass/50 mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.7s'
          }}
        />

        {/* Body Text */}
        <div
          className="space-y-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out 0.9s'
          }}
        >
          <p className="font-inter text-base sm:text-lg md:text-xl text-paper/80 leading-relaxed max-w-2xl mx-auto">
            In a world ruled by chaos, we bring method to the madness.
            Every bottle is accounted for. Every street is marked.
          </p>
          <p className="font-inter text-base sm:text-lg md:text-xl text-paper/80 leading-relaxed max-w-2xl mx-auto">
            If it appears on this map, it belongs to the{' '}
            <span className="text-brass font-cinzel tracking-wider">Shelby Company</span>.
          </p>
          <p
            className="font-cinzel text-lg sm:text-xl text-brass tracking-[0.2em] uppercase mt-8"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.8s ease-out 1.3s'
            }}
          >
            Remember that.
          </p>
        </div>

        {/* Bottom Line */}
        <div
          className="mx-auto w-0 h-px bg-gradient-to-r from-transparent via-brass to-transparent mt-12"
          style={{
            width: isVisible ? '120px' : '0px',
            transition: 'width 1s ease-out 1.5s'
          }}
        />

        {/* Decorative Elements */}
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 w-px h-0 bg-gradient-to-b from-transparent via-brass/30 to-transparent"
          style={{
            height: isVisible ? '200px' : '0px',
            transition: 'height 1s ease-out 1s'
          }}
        />
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 w-px h-0 bg-gradient-to-b from-transparent via-brass/30 to-transparent"
          style={{
            height: isVisible ? '200px' : '0px',
            transition: 'height 1s ease-out 1s'
          }}
        />
      </div>
    </section>
  );
}
