import { useAtomValue } from 'jotai';
import { isConnectAtom } from '../../../atoms/auth.atom';
import { Navigate } from 'react-router';

export function ProtectedPage({ children }) {

    const isConnect = useAtomValue(isConnectAtom);

    if(!isConnect) {
        return <Navigate to='/auth/login' replace />
    }

    return children;
}
