import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';

type Translations = Record<string, any>;

interface LocalizationContextType {
	currentLanguage: string;
	setLanguage: (lang: string) => Promise<void>;
	i18n: (key: string, replacements?: Record<string, string>) => string;
	isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);
const FALLBACK_LANGUAGE = 'en';

function LocalizationProvider({ children }: { children: React.ReactNode }) {
	const [currentLanguage, setCurrentLanguage] = useState<string>(FALLBACK_LANGUAGE);
	const [translations, setTranslations] = useState<Translations>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => { loadLanguage(FALLBACK_LANGUAGE); }, []);

	async function loadLanguage(lang: string) {
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
		} 
		
		catch (error) {
			console.warn(`Failed to load language ${lang}:`, error);
			if (lang !== FALLBACK_LANGUAGE) loadLanguage(FALLBACK_LANGUAGE);
		} 
		
		finally {
			setIsLoading(false);
		}
	}

	function getTranslation(key: string): string {
		const keys = key.split('.');
		let value: any = translations;
		for (const k of keys) {
			if (value === undefined) break;
			value = value[k];
		}
	
		return value || key;
	}

	function i18n(key: string, replacements?: Record<string, string>): string {
		let translation = getTranslation(key);
		if (!replacements) return translation;
			
		Object.entries(replacements).forEach(([placeholder, replacementKey]) => {
			const replacementValue = getTranslation(replacementKey);
			translation = translation.replace(`{{${placeholder}}}`, replacementValue);
		});
	
		return translation;
	}

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