import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Character, CharacterTheme } from '@/types';

const STORAGE_KEY = 'shelby-character';
const STEALTH_KEY = 'shelby-stealth';

const themes: Record<Character, CharacterTheme> = {
    thomas: {
        name: 'Thomas',
        fullName: 'Thomas Shelby',
        title: 'Shelby Company Limited',
        accent: '#c9a86c',
        accentLight: '#d4b87c',
        accentRgb: '201, 168, 108',
        bg: '#0a0a0a',
        surface: 'rgba(26, 26, 26, 0.6)',
        splashQuote: "I'm not a traitor to my class. I am just an extreme example of what a working man can achieve.",
        splashAuthor: 'Thomas Shelby',
        particleColor: 'rgba(201, 168, 108, 0.4)',
    },
    luca: {
        name: 'Luca',
        fullName: 'Luca Changretta',
        title: 'Changretta Famiglia',
        accent: '#8b0000',
        accentLight: '#c0392b',
        accentRgb: '139, 0, 0',
        bg: '#0d0505',
        surface: 'rgba(40, 10, 10, 0.6)',
        splashQuote: "Vendetta. It's the only thing I understand.",
        splashAuthor: 'Luca Changretta',
        particleColor: 'rgba(200, 30, 30, 0.5)',
    },
};

interface CharacterContextValue {
    character: Character;
    theme: CharacterTheme;
    setCharacter: (char: Character) => void;
    toggleCharacter: () => void;
    isStealthMode: boolean;
    toggleStealthMode: () => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
    const [character, setCharacterState] = useState<Character>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return (stored === 'luca' ? 'luca' : 'thomas') as Character;
    });

    const [isStealthMode, setIsStealthMode] = useState(() => {
        return localStorage.getItem(STEALTH_KEY) === 'true';
    });

    const theme = useMemo(() => {
        const baseTheme = themes[character];
        if (isStealthMode) {
            return {
                ...baseTheme,
                accent: '#e5e5e5', // Silver
                accentLight: '#ffffff',
                accentRgb: '229, 229, 229',
                bg: '#000000', // Pure black
                surface: 'rgba(20, 20, 20, 0.9)',
                particleColor: 'rgba(200, 200, 200, 0.3)',
            };
        }
        return baseTheme;
    }, [character, isStealthMode]);

    // Inject CSS custom properties on <html>
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-character', character);
        root.setAttribute('data-stealth', isStealthMode.toString());
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-light', theme.accentLight);
        root.style.setProperty('--accent-rgb', theme.accentRgb);
        root.style.setProperty('--bg', theme.bg);
        root.style.setProperty('--surface', theme.surface);
        root.style.setProperty('--particle-color', theme.particleColor);
    }, [character, theme, isStealthMode]);

    const setCharacter = useCallback((char: Character) => {
        setCharacterState(char);
        localStorage.setItem(STORAGE_KEY, char);
    }, []);

    const toggleCharacter = useCallback(() => {
        setCharacterState(prev => {
            const next = prev === 'thomas' ? 'luca' : 'thomas';
            localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    }, []);

    const toggleStealthMode = useCallback(() => {
        setIsStealthMode(prev => {
            const next = !prev;
            localStorage.setItem(STEALTH_KEY, next.toString());
            return next;
        });
    }, []);

    const value = useMemo(
        () => ({ character, theme, setCharacter, toggleCharacter, isStealthMode, toggleStealthMode }),
        [character, theme, setCharacter, toggleCharacter, isStealthMode, toggleStealthMode]
    );

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
}

export function useCharacter() {
    const ctx = useContext(CharacterContext);
    if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
    return ctx;
}

export { themes };
