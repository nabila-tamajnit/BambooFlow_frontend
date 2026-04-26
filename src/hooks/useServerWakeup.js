import { useState, useRef } from 'react';

const SLOW_THRESHOLD_MS = 2500;

export function useServerWakeup() {
    const [isWakingUp, setIsWakingUp] = useState(false);
    const timerRef = useRef(null);

    const startWatch = () => {
        timerRef.current = setTimeout(() => {
            setIsWakingUp(true);
        }, SLOW_THRESHOLD_MS);
    };

    const stopWatch = () => {
        clearTimeout(timerRef.current);
        setIsWakingUp(false);
    };

    return { isWakingUp, startWatch, stopWatch };
}