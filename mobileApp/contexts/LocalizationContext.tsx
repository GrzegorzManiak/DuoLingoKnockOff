import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
type Translations = Record<string, any>;

interface LocalizationContextType {
	currentLanguage: string;
	setLanguage: (lang: string) => Promise<void>;
	i18n: (key: string, replacements?: Record<string, string>) => string;
	isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);
const FALLBACK_LANGUAGE = 'en';
const LANGUAGE_KEY = '@DLKO:language';

async function _loadLanguageFromStorage(): Promise<string | null> {
	try {
		const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
		return storedLanguage || FALLBACK_LANGUAGE;
	} 
	catch (error) {
		console.error("Failed to load language from storage:", error);
		return FALLBACK_LANGUAGE;
	}
}

async function _saveLanguageToStorage(language: string): Promise<void> {
	try {	
		await AsyncStorage.setItem(LANGUAGE_KEY, language);
	} 
	catch (error) {
		console.error("Failed to save language to storage:", error);
	}
}

function LocalizationProvider({ children }: { children: React.ReactNode }) {
	const [currentLanguage, setCurrentLanguage] = useState<string>(FALLBACK_LANGUAGE);
	const [translations, setTranslations] = useState<Translations>({});
	const [isLoading, setIsLoading] = useState(true);

	const initializeLanguage = useCallback(async() => { 
		let language = await _loadLanguageFromStorage();
		if (!language) language = FALLBACK_LANGUAGE;
		loadLanguage(language);
	 }, []);

	const loadLanguage = useCallback(async(lang: string) => {
		setIsLoading(true);
		try {
			// @ts-ignore // -- This is expecitng a URL thats in the OpenAPI spec, but it's not
			const response = await apiClient.GET(`/static/localization/${lang}.json`, {
				cache: 'no-store',
				parseAs: 'json',
			});
			if (!response.data) throw new Error('No language data received');
			console.debug('Fetched language data:', `/static/localization/${lang}.json`);
			setTranslations(response.data);
			setCurrentLanguage(lang);
			await _saveLanguageToStorage(lang);
		} 
		
		catch (error) {
			console.warn(`Failed to load language ${lang}:`, error);
			if (lang !== FALLBACK_LANGUAGE) loadLanguage(FALLBACK_LANGUAGE);
		} 
		
		finally {
			setIsLoading(false);
		}
	}, [FALLBACK_LANGUAGE, _saveLanguageToStorage]);

	const getTranslation = useCallback((key: string): string => {
		const keys = key.split('.');
		let value: any = translations;
		for (const k of keys) {
			if (value === undefined) break;
			value = value[k];
		}
	
		return value || key;
	}, [translations]);

	const i18n = useCallback((key: string, replacements?: Record<string, string>): string => {
		let translation = getTranslation(key);
		if (!replacements) return translation;
			
		Object.entries(replacements).forEach(([placeholder, replacementKey]) => {
			const replacementValue = getTranslation(replacementKey);
			translation = translation.replace(`{{${placeholder}}}`, replacementValue);
		});
	
		return translation;
	}, [getTranslation]);

	// -- Initialize language on component mount
	useEffect(() => { 
		initializeLanguage(); 
	}, [initializeLanguage]);

	// -- Provide the localization context value to the component tree
	return (
		<LocalizationContext.Provider value={{
			currentLanguage,
			setLanguage: loadLanguage,
			i18n,
			isLoading
		}}>
			{children}
		</LocalizationContext.Provider>
	);
}

function useLocalization() {
	const context = useContext(LocalizationContext);
	if (context === undefined) throw new Error('useLocalization must be used within a LocalizationProvider');
	return context;
} 

export {
	LocalizationProvider,
	useLocalization,
	FALLBACK_LANGUAGE
}