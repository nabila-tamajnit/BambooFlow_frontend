// src/layout/pages/Profile.jsx
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom } from '../../atoms/auth.atom';
import { userProfileAtom } from '../../atoms/user.atom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, ShieldCheck, AlertTriangle, Trash2, LogOut, Mail, BadgeCheck } from 'lucide-react';
import authService from '../../services/auth.service';
import userService from '../../services/user.service';

export const Profile = () => {
    const token      = useAtomValue(tokenAtom);
    const profile    = useAtomValue(userProfileAtom);
    const setToken   = useSetAtom(tokenAtom);
    const setProfile = useSetAtom(userProfileAtom);
    const navigate   = useNavigate();

    const [fullProfile, setFullProfile] = useState(null);

    // Charger le profil complet depuis l'API
    useEffect(() => {
        if (!token) return;
        userService.getMe()
            .then(data => setFullProfile(data))
            .catch(console.error);
    }, [token]);

    const displayProfile = fullProfile || profile;

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting]   = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const handleLogout = () => {
        setToken(null);
        setProfile(null);
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        if (!displayProfile?.id && !displayProfile?._id) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await authService.deleteAccount(displayProfile._id || displayProfile.id);
            setToken(null);
            setProfile(null);
            navigate('/');
        } catch (err) {
            console.error(err);
            setDeleteError('Impossible de supprimer le compte. Réessayez.');
            setIsDeleting(false);
        }
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-3xl font-chewy text-main-800">Mon profil</h1>

            {/* ── Informations ──────────────────────────────────────────── */}
            <section className="bg-white rounded-[2rem] border border-main-100 shadow-sm p-8 space-y-5">
                <h2 className="text-lg font-bold text-main-700 flex items-center gap-2">
                    <User size={20} className="text-main-500" />
                    Informations
                </h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-main-100 text-main-600 flex items-center justify-center text-2xl font-bold font-chewy">
                        {displayProfile?.firstname?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <p className="font-bold text-main-800 text-xl">
                            {displayProfile?.firstname || '—'} {displayProfile?.lastname || ''}
                        </p>
                        <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5
                            ${displayProfile?.role === 'Admin' ? 'text-secondary-500' : 'text-main-400'}`}>
                            {displayProfile?.role === 'Admin'
                                ? <><ShieldCheck size={12} /> Administrateur</>
                                : <><BadgeCheck size={12} /> Membre</>
                            }
                        </span>
                    </div>
                </div>

                {/* Champs détail */}
                <div className="space-y-3 pt-2 border-t border-main-100">
                    <InfoRow icon={<User size={16} />}   label="Prénom" value={displayProfile?.firstname} />
                    <InfoRow icon={<User size={16} />}   label="Nom"    value={displayProfile?.lastname}  />
                    <InfoRow icon={<Mail size={16} />}   label="Email"  value={displayProfile?.email}     />
                </div>
            </section>

            {/* ── Actions ───────────────────────────────────────────────── */}
            <section className="bg-white rounded-[2rem] border border-main-100 shadow-sm p-8 space-y-4">
                <h2 className="text-lg font-bold text-main-700">Actions</h2>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-main-600 hover:text-main-800 font-medium transition-colors"
                >
                    <LogOut size={16} />
                    Se déconnecter
                </button>
            </section>

            {/* ── Zone danger ───────────────────────────────────────────── */}
            <section className="bg-red-50 rounded-[2rem] border border-red-200 p-8 space-y-4">
                <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Zone dangereuse
                </h2>

                {!showDeleteConfirm ? (
                    <div>
                        <p className="text-red-600 text-sm mb-4">
                            La suppression de votre compte est définitive et irréversible.
                            Toutes vos données seront perdues.
                        </p>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-5 py-2.5 text-red-600 border-2 border-red-300 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={16} />
                            Supprimer mon compte
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-red-100 rounded-2xl p-4">
                            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm font-medium">
                                Êtes-vous sûr ? Cette action supprimera définitivement votre compte et toutes vos données.
                            </p>
                        </div>
                        {deleteError && <p className="text-red-600 text-sm font-medium">{deleteError}</p>}
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
                            >
                                {isDeleting
                                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <Trash2 size={14} />
                                }
                                {isDeleting ? 'Suppression...' : 'Oui, supprimer définitivement'}
                            </button>
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                                disabled={isDeleting}
                                className="px-5 py-2.5 border-2 border-red-300 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-xl bg-main-50 flex items-center justify-center text-main-400 shrink-0">
                {icon}
            </div>
            <div className="flex-1 flex justify-between items-center">
                <span className="text-sm text-main-400 font-medium">{label}</span>
                <span className="text-sm font-bold text-main-700">{value || '—'}</span>
            </div>
        </div>
    );
}