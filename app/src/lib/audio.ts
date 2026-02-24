/**
 * Cinematic UI Sound Effects Utility
 * Handles audio preloading, playback, and layering for the Peaky Blinders theme.
 */

type SFXType = 'tick' | 'hover_sweep' | 'heavy_clack' | 'thomas_transition' | 'luca_transition' | 'page_turn' | 'map_marker' | 'lamp_on' | 'lamp_off';

interface SFXConfig {
    files: string[];
    volume: number;
}

const SFX_MAP: Record<SFXType, SFXConfig> = {
    tick: {
        files: ['/assets/sounds/tick.mp3'],
        volume: 0.4,
    },
    hover_sweep: {
        files: ['/assets/sounds/paper_slide.mp3', '/assets/sounds/vinyl.mp3'],
        volume: 0.3,
    },
    heavy_clack: {
        files: ['/assets/sounds/heavy_clack.mp3'],
        volume: 0.5,
    },
    thomas_transition: {
        files: ['/assets/sounds/thomas_swell.mp3'],
        volume: 0.7,
    },
    luca_transition: {
        files: ['/assets/sounds/knife_scrape.mp3', '/assets/sounds/luca_drone.mp3'],
        volume: 0.6,
    },
    page_turn: {
        files: ['/assets/sounds/page_turn.mp3'],
        volume: 0.5,
    },
    map_marker: {
        files: ['/assets/sounds/map_marker.mp3'],
        volume: 0.6,
    },
    lamp_on: {
        files: ['/assets/sounds/lamp_on.mp3'],
        volume: 0.5,
    },
    lamp_off: {
        files: ['/assets/sounds/lamp_off.mp3'],
        volume: 0.4,
    },
};

const audioCache: Record<string, HTMLAudioElement[]> = {};

/**
 * Preload all SFX to avoid delays during interaction
 */
export const preloadSFX = () => {
    if (typeof window === 'undefined') return;

    Object.values(SFX_MAP).forEach((config) => {
        config.files.forEach((file) => {
            if (!audioCache[file]) {
                const audio = new Audio(file);
                audio.preload = 'auto';
                audioCache[file] = [audio];
            }
        });
    });
};

/**
 * Play a specific cinematic sound effect
 */
export const playSFX = (type: SFXType) => {
    if (typeof window === 'undefined') return;

    const config = SFX_MAP[type];
    if (!config) return;

    config.files.forEach((file) => {
        // Get an available audio instance or create a new one for overlapping playback
        let audioList = audioCache[file] || [];
        let audio = audioList.find((a) => a.paused || a.ended);

        if (!audio) {
            audio = new Audio(file);
            audioList.push(audio);
            audioCache[file] = audioList;
        }

        audio.volume = config.volume;
        audio.currentTime = 0;
        audio.play().catch((err) => {
            console.warn(`Audio playback failed for ${file}:`, err);
        });
    });
};
