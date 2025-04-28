import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/types';
import { useSession } from '@/hooks/useSession';

interface LearningLanguageContextType {
	currentLanguage: Language | null;
	setLanguage: (lang: Language) => Promise<void>;
	languages: Language[];
	isLoading: boolean;
	loadLanguages: () => Promise<void>;
	getLanguageName: (code: string) => string;
}

const LearningLanguageContext = createContext<LearningLanguageContextType | undefined>(undefined);
const LANGUAGE_KEY = '@DLKO:learning-language';

async function _loadLearningLanguageFromStorage(): Promise<Language | null> {
	try {
		const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
		return JSON.parse(storedLanguage || 'null');
	} 
	catch (error) {
		console.error("Failed to load learning language from storage:", error);
		return null;
	}
}

async function _saveLearningLanguageToStorage(language: Language): Promise<void> {
	try { await AsyncStorage.setItem(LANGUAGE_KEY, JSON.stringify(language)); } 
	catch (error) {	console.error("Failed to save learning language to storage:", error); }
}

function LearningLanguageProvider({ children }: { children: React.ReactNode }) {
	const [currentLearningLanguage, setCurrentLearningLanguage] = useState<Language | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { getToken } = useSession();
	const [languages, setLanguages] = useState<Language[]>([]);

	const initializeLearningLanguage = useCallback(async() => { 
		const language = await _loadLearningLanguageFromStorage();
		if (language) setCurrentLearningLanguage(language);
		await loadLanguages();
		setIsLoading(false);
	}, []);

	const loadLanguages = useCallback(async() => {
		console.log('loadLanguages', isLoading, languages.length);
		if (isLoading || languages.length > 0) return;
		setIsLoading(true);
		try {
			if (!getToken()) return console.warn('No token found');
			const response = await apiClient.GET(`/api/Languages`, {
				cache: 'no-store',
				parseAs: 'json',
				headers: { 'Authorization': `Bearer ${getToken()}` }
			});

			console.log('loadLanguages', response);
			if (!response.data) throw new Error('No language data received');
			setLanguages(response.data as Language[]);
		} 
		
		catch (error) {
			console.error("Failed to load learning language:", error);
			setIsLoading(false);
		} 
		
		finally {
			setIsLoading(false);
		}
	}, [getToken]);
	
	const getLanguageName = useCallback((code: string) => {
		const language = languages.find(lang => lang.code === code);
		return language?.name || code;
	}, [languages]);

	// -- Initialize language on component mount
	useEffect(() => {
		initializeLearningLanguage(); 
	}, [initializeLearningLanguage]);

	// -- Provide the localization context value to the component tree
	return (
		<LearningLanguageContext.Provider value={{
			currentLanguage: currentLearningLanguage,
			setLanguage: async (lang: Language) => {
				await _saveLearningLanguageToStorage(lang);
				setCurrentLearningLanguage(lang);
				console.log(`setLanguage: ${lang.name}`);
			},
			languages,
			isLoading,
			loadLanguages,
			getLanguageName
		}}>
			{children}
		</LearningLanguageContext.Provider>
	);
}

function useLearningLanguage() {
	const context = useContext(LearningLanguageContext);
	if (context === undefined) throw new Error('useLearningLanguage must be used within a LearningLanguageContext');
	return context;
} 

export {
	LearningLanguageProvider,
	useLearningLanguage,
}