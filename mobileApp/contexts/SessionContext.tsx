import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { components } from '@/types'; // Assuming types are generated here
import { apiClient } from '@/utils/api';

type User = components['schemas']['UserDto'];

const SESSION_KEY = '@DLKO:session';

// -- Session State Logic -- //

interface StoredSessionData {
	user: User;
	token: string;
}

async function _initializeSessionFromStorage(): Promise<StoredSessionData | null> {
	try {
		const storedSession = await AsyncStorage.getItem(SESSION_KEY);
		if (!storedSession) return null;
		return JSON.parse(storedSession) as StoredSessionData;
	} 
	catch (error) {
		console.error("Failed to load session from storage:", error);
		await _clearSessionFromStorage(); 
		return null;
	}
}

async function _saveSessionToStorage(user: User, token: string): Promise<void> {
	try {
		const sessionData = JSON.stringify({ user, token });
		await AsyncStorage.setItem(SESSION_KEY, sessionData);
	} 
	catch (error) {
		console.error("Failed to save session to storage:", error);
		throw error; 
	}
}

async function _clearSessionFromStorage(): Promise<void> {
	try {
		await AsyncStorage.removeItem(SESSION_KEY);
	} 
	catch (error) {
		console.error("Failed to remove session from storage:", error);
	}
}

// --- React Context --- 

interface SessionProviderProps {
	children: ReactNode;
}

interface SessionState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
}

interface SessionContextValue extends SessionState {
	signIn: (user: User, token: string) => Promise<void>;
	signOut: () => Promise<void>;
	initializeSession: () => Promise<void>; 
	getToken: () => string | null;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
	const [sessionState, setSessionState] = useState<SessionState>({
		user: null,
		token: null,
		isLoading: true,
	});

	const initializeSession = useCallback(async () => {
		setSessionState(prev => ({ ...prev, isLoading: true }));
		const storedData = await _initializeSessionFromStorage();
		if (storedData) setSessionState({ user: storedData.user, token: storedData.token, isLoading: false });
		else setSessionState({ user: null, token: null, isLoading: false });
	}, []);

	const signIn = useCallback(async (user: User, token: string) => {
		try {
			await _saveSessionToStorage(user, token);
			setSessionState({ user, token, isLoading: false });
		} 
		catch (error) {
			console.error("Session sign-in failed (storage error):", error);
			setSessionState({ user: null, token: null, isLoading: false });
		}
	}, []);

	const signOut = useCallback(async () => {
		await _clearSessionFromStorage();
		setSessionState({ user: null, token: null, isLoading: false });
	}, []);

	const getToken = useCallback(() => {
		return sessionState.token;
	}, [sessionState.token]);


	// -- Initialize session on component mount
	useEffect(() => {
		initializeSession();
	}, [initializeSession]);

	// -- Exposes session state functions to the component tree
	const contextValue = useMemo(() => ({
		...sessionState,
		signIn,
		signOut,
		initializeSession,
		getToken,
	}), [sessionState, signIn, signOut, initializeSession, getToken]);

	// -- Provide the context value to the component tree
	return (
		<SessionContext.Provider value={contextValue}>
			{children}
		</SessionContext.Provider>
	);
};

export {
	SessionContext,
	SessionProvider
};