import { usePomodoro } from '../components/usePomodoro';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { PomodoroControls } from '../components/PomodoroControls';
import { PomodoroSettings } from '../components/PomodoroSettings';
import { PomodoroStats } from '../components/PomodoroStats';
import { PandaDisplay } from '../components/PandaDisplay';

export const Pomodoro = () => {
    const {
        mode,
        currentMode,
        timeLeft,
        isRunning,
        sessions,
        finished,
        progress,
        minutes,
        seconds,
        pandaState,
        suggestedNextMode,
        start,
        pause,
        reset,
        changeMode,
    } = usePomodoro();

    return (
        <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16">

            <div className="text-center mb-10">
                <h1 className="text-4xl font-chewy text-main-800">Zone Focus 🎋</h1>
                <p className="text-main-400 mt-2 font-medium">
                    Travaillez par blocs de 25 minutes, récoltez votre concentration.
                </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-white rounded-[2.5rem] border border-main-100 shadow-xl p-8 md:p-12">

                {/* ── Colonne gauche : Panda ─────────────────────────────── */}
                <div className="w-full md:w-2/5 flex justify-center order-2 md:order-1">
                    <PandaDisplay pandaState={pandaState} />
                </div>

                {/* ── Colonne droite : Timer + Contrôles ────────────────── */}
                <div className="w-full md:w-3/5 flex flex-col items-center gap-8 order-1 md:order-2">

                    {/* Sélecteur de mode */}
                    <PomodoroSettings
                        currentMode={currentMode}
                        onChangeMode={changeMode}
                    />

                    {/* Timer circulaire */}
                    <PomodoroTimer
                        minutes={minutes}
                        seconds={seconds}
                        progress={progress}
                        currentMode={currentMode}
                        finished={finished}
                    />

                    {/* Boutons */}
                    <PomodoroControls
                        isRunning={isRunning}
                        finished={finished}
                        onStart={start}
                        onPause={pause}
                        onReset={reset}
                    />

                    {/* Stats + suggestion */}
                    <PomodoroStats
                        sessions={sessions}
                        finished={finished}
                        suggestedNextMode={suggestedNextMode}
                        onChangeMode={changeMode}
                    />

                </div>
            </div>

            {/* Explication rapide en bas */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-white rounded-2xl p-5 border border-main-100">
                    <p className="font-bold text-main-700 mb-1">🎯 Focus — 25 min</p>
                    <p className="text-main-400">Travaillez sans distraction sur une seule tâche.</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-main-100">
                    <p className="font-bold text-main-700 mb-1">☕ Pause courte — 5 min</p>
                    <p className="text-main-400">Étirez-vous, buvez de l'eau, soufflez.</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-main-100">
                    <p className="font-bold text-main-700 mb-1">🌿 Pause longue — 15 min</p>
                    <p className="text-main-400">Après 4 sessions, accordez-vous une vraie pause.</p>
                </div>
            </div>
        </main>
    );
};