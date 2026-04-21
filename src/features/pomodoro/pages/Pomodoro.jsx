import { usePomodoro } from '../components/usePomodoro';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { PomodoroControls } from '../components/PomodoroControls';
import { PomodoroSettings } from '../components/PomodoroSettings';
import { PomodoroStats } from '../components/PomodoroStats';
import { PandaDisplay } from '../components/PandaDisplay';
import { Brain, Coffee, Palmtree } from 'lucide-react';

// Tableau des explications
const LEGEND = [
    {
        icon: Brain,
        title: 'Focus — 25 min',
        description: 'Travaillez sans distraction sur une seule tâche.',
        colorBg: 'bg-main-50',
        colorBorder: 'border-main-200',
        colorIcon: 'text-main-500',
    },
    {
        icon: Coffee,
        title: 'Pause courte — 5 min',
        description: 'Étirez-vous, buvez de l\'eau, soufflez.',
        colorBg: 'bg-secondary-50',
        colorBorder: 'border-secondary-200',
        colorIcon: 'text-secondary-500',
    },
    {
        icon: Palmtree,
        title: 'Pause longue — 15 min',
        description: 'Après 4 sessions, accordez-vous une vraie pause.',
        colorBg: 'bg-secondary-100',
        colorBorder: 'border-secondary-300',
        colorIcon: 'text-main-400',
    },
];

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

                    <PomodoroSettings
                        currentMode={currentMode}
                        onChangeMode={changeMode}
                    />

                    <PomodoroTimer
                        minutes={minutes}
                        seconds={seconds}
                        progress={progress}
                        currentMode={currentMode}
                        finished={finished}
                    />

                    <PomodoroControls
                        isRunning={isRunning}
                        finished={finished}
                        onStart={start}
                        onPause={pause}
                        onReset={reset}
                    />

                    <PomodoroStats
                        sessions={sessions}
                        finished={finished}
                        suggestedNextMode={suggestedNextMode}
                        onChangeMode={changeMode}
                    />

                </div>
            </div>

            {/* ── Légende des modes ─────────────────────── */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {LEGEND.map(({ icon: Icon, title, description, colorBg, colorBorder, colorIcon }) => (
                    <div
                        key={title}
                        className={`${colorBg} rounded-2xl p-5 border ${colorBorder} flex items-start gap-4`}
                    >
                        <div className={`shrink-0 mt-0.5 ${colorIcon}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-main-700 text-sm mb-1">{title}</p>
                            <p className="text-main-400 text-sm">{description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};