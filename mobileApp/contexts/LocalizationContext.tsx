import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { apiClient } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {nameToCode} from "@/utils/langUtil";

type Translations = Record<string, any>;
type LanguageTranslations = Record<string, Translations>;

interface LanguageLoadState {
	[language: string]: {
		loading: boolean;
		loaded: boolean;
	}
}

interface LocalizationContextType {
	currentLanguage: string;
	setLanguage: (lang: string) => Promise<void>;
	isLoading: boolean;
	t: (key: string, replacements?: Record<string, string>, language?: string) => string;
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
	const [translations, setTranslations] = useState<LanguageTranslations>({});
	const [isLoading, setIsLoading] = useState(true);
	const languageLoadState = useRef<LanguageLoadState>({});
	
	const loadTranslationFile = useCallback(async (lang: string): Promise<Translations | null> => {
		const code = nameToCode(lang);
		console.debug('Loading language:', lang, code);
		lang = code || lang;
		if (languageLoadState.current[lang]?.loading) return null;
		languageLoadState.current[lang] = { loading: true, loaded: false };
		
		try {
			// @ts-ignore
			const response = await apiClient.GET(`/static/localization/${lang}.json`, {
				cache: 'no-store',
				parseAs: 'json',
			});

			if (!response.data) throw new Error('No language data received');
			console.debug('Fetched language data:', `/static/localization/${lang}.json`);
			languageLoadState.current[lang] = { loading: false, loaded: true };
			return response.data as Translations;
		}
		catch (error) {
			console.warn(`Failed to load language ${lang}:`, error);
			
			// Mark loading as failed
			languageLoadState.current[lang] = { loading: false, loaded: false };
			return null;
		}
	}, []);

	const initializeLanguage = useCallback(async() => { 
		let language = await _loadLanguageFromStorage();
		if (!language) language = FALLBACK_LANGUAGE;
		await loadLanguage(language);
	}, []);

	const loadLanguage = useCallback(async(lang: string) => {
		setIsLoading(true);
		try {
			const langTranslations = await loadTranslationFile(lang);
			if (!langTranslations) {
				if (lang !== FALLBACK_LANGUAGE) { await loadLanguage(FALLBACK_LANGUAGE); return; }
				throw new Error(`Failed to load even fallback language ${FALLBACK_LANGUAGE}`);
			}
			setTranslations(prev => ({ ...prev, [lang]: langTranslations }));
			setCurrentLanguage(lang);
			await _saveLanguageToStorage(lang);
		}
		finally {
			setIsLoading(false);
		}
	}, [FALLBACK_LANGUAGE, loadTranslationFile]);
	
	const ensureLanguageLoaded = useCallback(async (langCode: string): Promise<boolean> => {
		if (translations[langCode]) return true;
		if (languageLoadState.current[langCode]?.loading) return false;
		const langTranslations = await loadTranslationFile(langCode);
		if (langTranslations) {
			setTranslations(prev => ({ ...prev, [langCode]: langTranslations }));
			return true;
		}
		return false;
	}, [loadTranslationFile, translations]);

	const getTranslation = useCallback((key: string, langCode: string = currentLanguage): string => {
		const langTranslations = translations[langCode] || translations[currentLanguage] || {};
		const keys = key.split('.');
		let value: any = langTranslations;
		
		for (const k of keys) {
			if (value === undefined) break;
			value = value[k];
		}
		
		if (!value && langCode !== FALLBACK_LANGUAGE && translations[FALLBACK_LANGUAGE]) {
			value = translations[FALLBACK_LANGUAGE];
			for (const k of keys) {
				if (value === undefined) break;
				value = value[k];
			}
		}
		
		return value || key;
	}, [currentLanguage, translations]);

	// Simplified t function with direct language parameter
	const t = useCallback((key: string, replacements?: Record<string, string>, language?: string): string => {
		// If language is provided, translate the key to that language
		const targetLang = language || currentLanguage;
		
		// Ensure language is loaded if specified
		if (targetLang && !translations[targetLang]) {
			ensureLanguageLoaded(targetLang);
		}
		
		// Get translation in the target language
		let translation = getTranslation(key, targetLang);
		if (!replacements) return translation;
		
		// Handle replacements
		Object.entries(replacements).forEach(([placeholder, replacementValue]) => {
			if (replacementValue.includes('.')) {
				// For nested keys, also translate in the target language
				const translatedReplacement = getTranslation(replacementValue, targetLang);
				translation = translation.replace(`{{${placeholder}}}`, translatedReplacement);
			}
			else {
				// Direct replacement
				translation = translation.replace(`{{${placeholder}}}`, replacementValue);
			}
		});
		
		return translation;
	}, [currentLanguage, getTranslation, ensureLanguageLoaded, translations]);
	
	useEffect(() => { initializeLanguage(); }, [initializeLanguage]);
	
	return (
		<LocalizationContext.Provider value={{
			currentLanguage,
			setLanguage: loadLanguage,
			t,
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