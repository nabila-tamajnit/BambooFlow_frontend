/**
 * Props :
 * - sessions          : number — nb de sessions focus complétées
 * - finished          : bool — timer vient de terminer
 * - suggestedNextMode : function → clé du prochain mode recommandé
 * - onChangeMode      : callback(modeKey)
 */
export function PomodoroStats({ sessions, finished, suggestedNextMode, onChangeMode }) {
    const nextMode = suggestedNextMode();

    const nextLabels = {
        focus: 'Reprendre le focus',
        shortBreak: 'Prendre une pause courte',
        longBreak: 'Prendre une grande pause',
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Compteur sessions */}
            <p className="text-main-400 font-bold text-sm uppercase tracking-widest">
                🎋 {sessions} session{sessions > 1 ? 's' : ''} complétée{sessions > 1 ? 's' : ''}
            </p>

            {/* Points visuels — 4 points représentent un cycle */}
            <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                            ${i < (sessions % 4)
                                ? 'bg-main-500'
                                : 'bg-main-200'
                            }`}
                    />
                ))}
            </div>

            {/* Suggestion après fin de session */}
            {finished && (
                <button
                    onClick={() => onChangeMode(nextMode)}
                    className="mt-2 px-5 py-2.5 bg-main-100 text-main-700 rounded-2xl text-sm font-bold hover:bg-main-200 transition-colors"
                >
                    → {nextLabels[nextMode]}
                </button>
            )}
        </div>
    );
}