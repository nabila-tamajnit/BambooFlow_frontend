export function WakeupBanner({ visible }) {
    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                        bg-main-800 text-white text-sm font-medium
                        px-5 py-3 rounded-2xl shadow-xl
                        flex items-center gap-3 animate-fadeIn">
            <div className="w-4 h-4 border-2 border-white border-t-transparent
                            rounded-full animate-spin shrink-0" />
            <span>
                Réveil du serveur en cours —{' '}
                <span className="text-main-300">
                    la première requête peut prendre quelques secondes
                    (hébergement gratuit).
                </span>
            </span>
        </div>
    );
}