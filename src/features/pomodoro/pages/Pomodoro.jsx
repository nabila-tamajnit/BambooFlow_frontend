// src/features/pomodoro/pages/Pomodoro.jsx
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const MODES = {
    focus:      { label: 'Focus',        duration: 25 * 60, color: 'text-main-600' },
    shortBreak: { label: 'Pause courte', duration:  5 * 60, color: 'text-secondary-500' },
    longBreak:  { label: 'Pause longue', duration: 15 * 60, color: 'text-secondary-600' },
};

export const Pomodoro = () => {
    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef(null);

    const currentMode = MODES[mode];
    const progress = timeLeft / currentMode.duration; // 1 → 0
    const circumference = 2 * Math.PI * 90; // rayon 90

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        if (mode === 'focus') setSessions(s => s + 1);
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, mode]);

    const handleModeChange = (newMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(MODES[newMode].duration);
    };

    const reset = () => {
        setIsRunning(false);
        setTimeLeft(currentMode.duration);
    };

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    return (
        <main className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center gap-8">
            <h1 className="text-4xl font-chewy text-main-800">Zone Focus 🎋</h1>

            {/* Sélecteur de mode */}
            <div className="flex gap-2 bg-main-100 p-1.5 rounded-2xl">
                {Object.entries(MODES).map(([key, val]) => (
                    <button key={key}
                        onClick={() => handleModeChange(key)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            mode === key ? 'bg-white shadow text-main-800' : 'text-main-500'
                        }`}>
                        {val.label}
                    </button>
                ))}
            </div>

            {/* Timer circulaire SVG */}
            <div className="relative flex items-center justify-center w-64 h-64">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 200 200">
                    {/* Piste de fond */}
                    <circle cx="100" cy="100" r="90"
                        fill="none" stroke="#e6f2e6" strokeWidth="10" />
                    {/* Arc de progression */}
                    <circle cx="100" cy="100" r="90"
                        fill="none" stroke="#429942" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress)}
                        className="transition-all duration-1000" />
                </svg>

                <div className="text-center z-10">
                    <p className={`text-6xl font-chewy ${currentMode.color}`}>
                        {minutes}:{seconds}
                    </p>
                    <p className="text-sm text-main-400 font-bold uppercase tracking-widest mt-1">
                        {currentMode.label}
                    </p>
                </div>
            </div>

            {/* 
                🐼 PANDA ICI — sous le timer
                Mode focus  → /images/panda_eating.svg   (animate-bounce-slow)
                Mode pause  → /images/panda_sleeping.svg
                Timer à 0   → /images/panda_victory.svg
            */}
            <img 
                src="/images/panda_404.svg" // remplace par la bonne image selon le mode
                alt="Panda"
                className="w-32 animate-bounce-slow"
            />

            {/* Contrôles */}
            <div className="flex items-center gap-4">
                <button onClick={reset}
                    className="p-3 rounded-2xl border-2 border-main-200 text-main-500 hover:bg-main-50 transition-all">
                    <RotateCcw size={20} />
                </button>
                <button onClick={() => setIsRunning(r => !r)}
                    className="btn px-10 py-4 text-xl flex items-center gap-3">
                    {isRunning ? <Pause size={24}/> : <Play size={24}/>}
                    {isRunning ? 'Pause' : 'Démarrer'}
                </button>
            </div>

            {/* Compteur de sessions */}
            <p className="text-main-400 font-bold text-sm uppercase tracking-widest">
                🎋 {sessions} session{sessions > 1 ? 's' : ''} complétée{sessions > 1 ? 's' : ''}
            </p>
        </main>
    );
};