import { useEffect, useRef, useState } from 'react';
import { SkipForward } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  skipIntro: boolean;
}

export function CinematicIntro({ onComplete, skipIntro }: CinematicIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [textOpacity, setTextOpacity] = useState(0);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const [hatRotation, setHatRotation] = useState({ x: 0, y: 0, z: 0 });
  const [hatScale, setHatScale] = useState(0.5);
  const [hatOpacity, setHatOpacity] = useState(0);
  const [chainOffset, setChainOffset] = useState(-100);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipIntro) {
      onComplete();
      return;
    }

    // Hat animation sequence
    const hatSequence = setTimeout(() => {
      setHatOpacity(1);
      setHatScale(1);
      setHatRotation({ x: 15, y: 360, z: 5 });
    }, 500);

    // Chain slides in
    const chainSequence = setTimeout(() => {
      setChainOffset(0);
    }, 1500);

    // Fade in text
    const textFadeIn = setTimeout(() => {
      setTextOpacity(1);
    }, 2500);

    // Hat floats away
    const hatFloatAway = setTimeout(() => {
      setHatRotation({ x: -30, y: 720, z: 0 });
      setHatScale(0.3);
      setHatOpacity(0);
      setChainOffset(100);
    }, 4500);

    // Start fade out sequence
    const fadeOutStart = setTimeout(() => {
      setTextOpacity(0);
    }, 6000);

    // Fade video and complete
    const completeTimeout = setTimeout(() => {
      setVideoOpacity(0);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 1000);
    }, 7000);

    return () => {
      clearTimeout(hatSequence);
      clearTimeout(chainSequence);
      clearTimeout(textFadeIn);
      clearTimeout(hatFloatAway);
      clearTimeout(fadeOutStart);
      clearTimeout(completeTimeout);
    };
  }, [skipIntro, onComplete]);

  const handleSkip = () => {
    setVideoOpacity(0);
    setHatOpacity(0);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-coal overflow-hidden"
      style={{ opacity: videoOpacity, transition: 'opacity 1s ease-out' }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230a0a0a' width='1920' height='1080'/%3E%3C/svg%3E"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-whiskey-being-poured-into-a-glass-42921-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />

      {/* 3D Floating Hat */}
      <div
        className="absolute z-20 transition-all duration-[2000ms] ease-out"
        style={{
          opacity: hatOpacity,
          transform: `
            perspective(1000px) 
            rotateX(${hatRotation.x}deg) 
            rotateY(${hatRotation.y}deg) 
            rotateZ(${hatRotation.z}deg) 
            scale(${hatScale})
            translateY(-50px)
          `,
          transformStyle: 'preserve-3d',
          top: '30%',
          left: '50%',
          marginLeft: '-150px'
        }}
      >
        <img 
          src="/peaky_cap.png" 
          alt=""
          className="w-80 h-auto drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 30px 60px rgba(201, 168, 108, 0.3))'
          }}
        />
      </div>

      {/* Golden Chain */}
      <div
        className="absolute z-10 transition-all duration-1000 ease-out"
        style={{
          transform: `translateY(${chainOffset}%)`,
          opacity: hatOpacity,
          top: '60%',
          left: '50%',
          marginLeft: '-200px'
        }}
      >
        <img 
          src="/gold_chain.png" 
          alt=""
          className="w-96 h-auto opacity-80"
          style={{
            filter: 'drop-shadow(0 10px 30px rgba(201, 168, 108, 0.5))'
          }}
        />
      </div>

      {/* Main Text */}
      <div
        className="relative z-30 text-center px-4"
        style={{ 
          opacity: textOpacity, 
          transition: 'opacity 1.5s ease-out',
          transform: `translateY(${textOpacity ? 0 : 30}px)`,
          transitionProperty: 'opacity, transform'
        }}
      >
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-[0.2em] uppercase mb-6 drop-shadow-lg">
          By Order of the
        </h1>
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-brass tracking-[0.25em] uppercase drop-shadow-2xl"
          style={{
            textShadow: '0 0 40px rgba(201, 168, 108, 0.5), 0 0 80px rgba(201, 168, 108, 0.3)'
          }}
        >
          Peaky Blinders
        </h1>
        <div className="mt-12 flex justify-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-brass to-transparent" />
        </div>
        <p className="font-cinzel text-lg sm:text-xl text-paper/80 tracking-[0.3em] uppercase mt-8">
          Shelby Company Ltd.
        </p>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 text-paper/60 hover:text-brass transition-colors duration-300"
      >
        <SkipForward className="w-4 h-4" />
        <span className="font-cinzel text-xs tracking-[0.2em] uppercase">Skip Intro</span>
      </button>

      {/* Ambient Smoke Effect */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,108,0.1) 0%, transparent 70%)',
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animation: `smokeFloat ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
