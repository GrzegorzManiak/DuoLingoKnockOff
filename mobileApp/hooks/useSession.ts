import { useContext } from 'react';
import { SessionContext } from '@/contexts/SessionContext';


function useSession() {
	const context = useContext(SessionContext);
	if (context === undefined) throw new Error('useSession must be used within a SessionProvider');
	return context;
}

export {
	useSession
};