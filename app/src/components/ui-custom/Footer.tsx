import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';
import type { NavSection } from '@/types';

interface FooterProps {
  onNavigate?: (section: NavSection) => void;
}

export const Footer = memo(({ onNavigate }: FooterProps) => {
  const { theme } = useCharacter();
  const [hoverQuote, setHoverQuote] = useState(false);
  const [showAltQuote, setShowAltQuote] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Easter egg: hover footer quote 5 seconds → changes
  useEffect(() => {
    if (hoverQuote) {
      timerRef.current = setTimeout(() => setShowAltQuote(true), 5000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [hoverQuote]);

  const handleQuoteEnter = useCallback(() => setHoverQuote(true), []);
  const handleQuoteLeave = useCallback(() => { setHoverQuote(false); }, []);

  return (
    <footer className="relative border-t py-14" style={{ borderColor: `rgba(${theme.accentRgb}, 0.06)` }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, rgba(${theme.accentRgb}, 0.2), transparent)` }} />

      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center"
                style={{ animation: 'accentPulse 5s ease-in-out infinite' }}>
                <span className="font-cinzel text-lg font-bold" style={{ color: theme.accent }}>S</span>
              </div>
              <div>
                <h3 className="font-cinzel text-paper text-sm tracking-[0.15em] uppercase">Shelby Co.</h3>
                <p className="text-[10px] text-paper/30 tracking-wider">Ltd.</p>
              </div>
            </div>
            <p className="text-paper/40 text-sm leading-relaxed font-light">
              By order of the Peaky Blinders. Shelby Company Limited — purveyors of fine spirits since 1919.
            </p>
          </div>

          <div>
            <h4 className="font-cinzel text-xs tracking-[0.2em] uppercase mb-5" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'The Ledger', id: 'ledger' },
                { label: 'Inventory', id: 'inventory' },
                { label: 'Territory Map', id: 'map' },
                { label: 'Suppliers', id: 'suppliers' },
                { label: 'Reports', id: 'reports' }
              ].map(link => (
                <li key={link.id}>
                  <button onClick={(e) => { e.preventDefault(); onNavigate?.(link.id as NavSection); }} className="text-paper/35 hover:text-accent transition-all duration-300 text-sm font-light hover:translate-x-1 inline-block cursor-none">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel text-xs tracking-[0.2em] uppercase mb-5" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }}>Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-paper/35 text-sm font-light">
                <MapPin className="w-3.5 h-3.5" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }} />
                <span>Watery Lane, Small Heath, Birmingham</span>
              </li>
              <li className="flex items-center gap-3 text-paper/35 text-sm font-light">
                <Phone className="w-3.5 h-3.5" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }} />
                <span>+44 121 555 0191</span>
              </li>
              <li className="flex items-center gap-3 text-paper/35 text-sm font-light">
                <Mail className="w-3.5 h-3.5" style={{ color: `rgba(${theme.accentRgb}, 0.6)` }} />
                <span>business@shelby.co.uk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-paper/20 text-xs font-light">© 1924 Shelby Company Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-paper/20 hover:text-accent text-xs transition-colors font-light">Privacy Policy</a>
            <a href="#" className="text-paper/20 hover:text-accent text-xs transition-colors font-light">Terms of Service</a>
          </div>
        </div>

        {/* Easter egg quote */}
        <div className="mt-8 text-center"
          onMouseEnter={handleQuoteEnter}
          onMouseLeave={handleQuoteLeave}>
          <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase cursor-default transition-colors duration-500"
            style={{ color: showAltQuote ? `rgba(${theme.accentRgb}, 0.4)` : `rgba(${theme.accentRgb}, 0.12)` }}>
            {showAltQuote
              ? "\"Everyone's a whore, Grace. We just sell different parts of ourselves.\""
              : '"Intelligence is a valuable thing"'}
          </p>
        </div>
      </div>
    </footer>
  );
});
