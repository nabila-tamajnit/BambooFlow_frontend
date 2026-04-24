import { useState, useEffect, useRef, useCallback } from 'react';

export const MODES = {
    focus: {
        key: 'focus',
        label: 'Focus',
        duration: 25 * 60,
        colorClass: 'text-main-600',
        strokeColor: '#429942',
        pandaState: 'focus',
    },
    shortBreak: {
        key: 'shortBreak',
        label: 'Pause courte',
        duration: 5 * 60,
        colorClass: 'text-secondary-500',
        strokeColor: '#e6b400',
        pandaState: 'resting',
    },
    longBreak: {
        key: 'longBreak',
        label: 'Pause longue',
        duration: 15 * 60,
        colorClass: 'text-secondary-600',
        strokeColor: '#b38c00',
        pandaState: 'sleeping',
    },
};

const SESSIONS_BEFORE_LONG_BREAK = 4;

export function usePomodoro() {
    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [finished, setFinished] = useState(false);

    const intervalRef = useRef(null);

    const currentMode = MODES[mode];
    const progress = timeLeft / currentMode.duration;

    useEffect(() => {
        if (!isRunning) {
            clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);
                    setFinished(true);
                    if (mode === 'focus') {
                        setSessions(s => s + 1);
                    }
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [isRunning, mode]);

    const start = useCallback(() => {
        setFinished(false);
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setFinished(false);
        setTimeLeft(currentMode.duration);
    }, [currentMode.duration]);

    const changeMode = useCallback((newMode) => {
        setIsRunning(false);
        setFinished(false);
        setMode(newMode);
        setTimeLeft(MODES[newMode].duration);
    }, []);

    const suggestedNextMode = useCallback(() => {
        if (mode !== 'focus') return 'focus';
        if ((sessions + 1) % SESSIONS_BEFORE_LONG_BREAK === 0) return 'longBreak';
        return 'shortBreak';
    }, [mode, sessions]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    // pandaState : 'victory' quand fini, sinon état du mode si en cours, 'idle' si en pause
    const pandaState = finished ? 'victory' : (isRunning ? currentMode.pandaState : 'idle');

    return {
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
    };
}