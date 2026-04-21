/**
 * Affiche l'image du panda selon l'état du timer.
 */

const PANDA_IMAGES = {
    idle:     '/images/panda_idle.svg',
    eating:   '/images/panda_eating.svg',
    resting:  '/images/panda_resting.svg',
    sleeping: '/images/panda_sleeping.svg',
    victory:  '/images/panda_victory.svg',
    fallback: '/images/panda_404.svg',
};

const PANDA_ANIMATIONS = {
    idle:     '',
    eating:   'animate-bounce-slow',
    resting:  'animate-float',
    sleeping: 'animate-float',
    victory:  'animate-bounce-slow',
};

const PANDA_LABELS = {
    idle:     'Le panda attend...',
    eating:   'Le panda est concentré !',
    resting:  'Le panda se repose.',
    sleeping: 'Le panda dort profondément.',
    victory:  'Bravo ! Session terminée !',
};

export function PandaDisplay({ pandaState = 'idle' }) {
    const src = PANDA_IMAGES[pandaState] || PANDA_IMAGES.fallback;
    const animation = PANDA_ANIMATIONS[pandaState] || '';
    const label = PANDA_LABELS[pandaState] || '';

    return (
        <div className="flex flex-col items-center gap-4">
            <img
                src={src}
                alt={label}
                // Si l'image n'existe pas encore, on affiche le fallback
                onError={(e) => { e.currentTarget.src = PANDA_IMAGES.fallback; }}
                className={`w-48 md:w-64 lg:w-72 drop-shadow-md transition-all duration-500 ${animation}`}
            />
            <p className="text-main-400 text-sm italic text-center">
                {label}
            </p>
        </div>
    );
}