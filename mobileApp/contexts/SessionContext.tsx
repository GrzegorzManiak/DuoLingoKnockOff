import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { components } from '@/types'; // Assuming types are generated here

type User = components['schemas']['UserDto'];

interface SessionState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface SessionContextValue extends SessionState {
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeSession: () => Promise<void>;
}

const SESSION_KEY = '@MyApp:session';

export const SessionContext = createContext<SessionContextValue | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionState, setSessionState] = useState<SessionState>({
    user: null,
    token: null,
    isLoading: true, // Start in loading state until session is checked
  });

  const initializeSession = useCallback(async () => {
    setSessionState(prev => ({ ...prev, isLoading: true }));
    try {
      const storedSession = await AsyncStorage.getItem(SESSION_KEY);
      if (storedSession) {
        const { user, token } = JSON.parse(storedSession);
        // Add validation here if necessary (e.g., check token expiry)
        setSessionState({ user, token, isLoading: false });
      } else {
        setSessionState({ user: null, token: null, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load session:", error);
      // Handle error, maybe sign out
      await signOut(); // Ensure clean state on error
    }
  }, []);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const signIn = useCallback(async (user: User, token: string) => {
    try {
      const sessionData = JSON.stringify({ user, token });
      await AsyncStorage.setItem(SESSION_KEY, sessionData);
      setSessionState({ user, token, isLoading: false });
    } catch (error) {
      console.error("Failed to save session:", error);
      // Handle sign-in error
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      setSessionState({ user: null, token: null, isLoading: false });
    } catch (error) {
      console.error("Failed to remove session:", error);
      // Handle sign-out error, maybe force state clear
      setSessionState({ user: null, token: null, isLoading: false });
    }
  }, []);

  const contextValue = useMemo(() => ({
    ...sessionState,
    signIn,
    signOut,
    initializeSession,
  }), [sessionState, signIn, signOut, initializeSession]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}; 