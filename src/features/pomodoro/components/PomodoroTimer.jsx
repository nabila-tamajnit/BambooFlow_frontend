/**
 * Cercle SVG animé + affichage MM:SS
 *
 * Props :
 * - minutes      : string "25"
 * - seconds      : string "00"
 * - progress     : number 1→0 (1 = plein, 0 = vide)
 * - currentMode  : objet { label, colorClass, strokeColor }
 * - finished     : bool — affiche une couleur de victoire si true
 */
export function PomodoroTimer({ minutes, seconds, progress, currentMode, finished }) {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeColor = finished ? '#429942' : currentMode.strokeColor;

    return (
        <div className="relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64 mx-auto">
            {/* Cercle SVG */}
            <svg
                className="absolute w-full h-full -rotate-90"
                viewBox="0 0 200 200"
                aria-hidden="true"
            >
                {/* Piste de fond */}
                <circle
                    cx="100" cy="100" r={radius}
                    fill="none"
                    stroke="#e6f2e6"
                    strokeWidth="10"
                />
                {/* Arc de progression */}
                <circle
                    cx="100" cy="100" r={radius}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                />
            </svg>

            {/* Texte centré */}
            <div className="text-center z-10 select-none">
                <p className={`text-5xl md:text-6xl font-chewy leading-none ${finished ? 'text-main-600' : currentMode.colorClass}`}>
                    {minutes}:{seconds}
                </p>
                <p className="text-xs text-main-400 font-bold uppercase tracking-widest mt-2">
                    {finished ? 'Terminé !' : currentMode.label}
                </p>
            </div>
        </div>
    );
}