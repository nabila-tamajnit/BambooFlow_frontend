import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Props :
 * - isRunning : bool
 * - finished  : bool — permet d'afficher "Recommencer" à la fin
 * - onStart   : callback
 * - onPause   : callback
 * - onReset   : callback
 */
export function PomodoroControls({ isRunning, finished, onStart, onPause, onReset }) {
    return (
        <div className="flex items-center justify-center gap-4">
            {/* Reset */}
            <button
                onClick={onReset}
                aria-label="Réinitialiser"
                className="p-3 rounded-2xl border-2 border-main-200 text-main-500 hover:bg-main-50 hover:border-main-300 transition-all"
            >
                <RotateCcw size={20} />
            </button>

            {/* Start / Pause */}
            <button
                onClick={isRunning ? onPause : onStart}
                className="btn px-10 py-4 text-xl flex items-center gap-3 min-w-[180px] justify-center"
            >
                {isRunning ? (
                    <>
                        <Pause size={22} />
                        Pause
                    </>
                ) : finished ? (
                    <>
                        <Play size={22} />
                        Recommencer
                    </>
                ) : (
                    <>
                        <Play size={22} />
                        Démarrer
                    </>
                )}
            </button>
        </div>
    );
}