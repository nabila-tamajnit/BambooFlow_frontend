import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Stocke les infos du profil (firstname, lastname, email, role)
export const userProfileAtom = atomWithStorage('bamboo_profile', null);