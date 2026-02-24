// Wrapper to replace SVG props matching the silhouette usage
interface SilhouetteProps extends React.HTMLAttributes<HTMLImageElement> {
    className?: string;
}

const SilhouetteBase = ({ src, className, ...props }: SilhouetteProps & { src: string }) => (
    <img
        src={src}
        alt="Character Silhouette"
        // Use mix-blend-screen to make the pure black background transparent
        // Brightness and contrast help the white vectors pop
        className={`object-contain mix-blend-screen opacity-90 ${className || ''}`}
        style={{ filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.3)) brightness(1.2)' }}
        {...(props as React.HTMLAttributes<HTMLImageElement>)}
    />
);

export const SilhouetteThomas = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/thomas.png" {...props} />;
export const SilhouetteArthur = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/arthur.png" {...props} />;
export const SilhouetteJohn = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/john.png" {...props} />;
export const SilhouettePolly = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/polly.png" {...props} />;
export const SilhouetteAda = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/ada.png" {...props} />;
export const SilhouetteAlfie = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/alfie.png" {...props} />;

export const SilhouetteLuca = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/luca.png" {...props} />;
export const SilhouetteAngel = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/angel.png" {...props} />;
export const SilhouetteVicente = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/vicente.png" {...props} />;
export const SilhouetteAudrey = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/audrey.png" {...props} />;
export const SilhouetteMatteo = (props: SilhouetteProps) => <SilhouetteBase src="/silhouettes/matteo.png" {...props} />;

// --- PEAKY CAP & WATCH ---
export const PeakyCap = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full fill-current">
        <path d="M10,48 Q10,15 50,10 Q90,15 90,48 Q95,55 50,55 Q5,55 10,48 Z" />
        <path d="M15,45 Q50,40 85,45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
);

export const PocketWatch = () => (
    <svg viewBox="0 0 60 80" className="w-full h-full fill-current">
        <circle cx="30" cy="45" r="25" />
        <path d="M30,20 L30,5 Q30,0 35,0 L25,0 Q30,0 30,5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="30" cy="45" r="20" fill="rgba(255,255,255,0.05)" />
    </svg>
);
