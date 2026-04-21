import { MODES } from './usePomodoro';

/**
 * Props :
 * - currentMode : objet mode actuel
 * - onChangeMode : callback(modeKey)
 */
export function PomodoroSettings({ currentMode, onChangeMode }) {
    return (
        <div className="flex gap-2 bg-main-100 p-1.5 rounded-2xl">
            {Object.values(MODES).map((m) => (
                <button
                    key={m.key}
                    onClick={() => onChangeMode(m.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                        ${currentMode.key === m.key
                            ? 'bg-white shadow text-main-800'
                            : 'text-main-500 hover:text-main-700'
                        }`}
                >
                    {m.label}
                </button>
            ))}
        </div>
    );
}