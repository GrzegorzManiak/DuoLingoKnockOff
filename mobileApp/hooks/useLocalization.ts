import { useLocalization as useLocalizationContext } from '@/contexts/LocalizationContext';

function useLocalization() {
	const { i18n, currentLanguage, setLanguage, isLoading } = useLocalizationContext();
	return { t: i18n, currentLanguage, setLanguage, isLoading };
} 

export {
	useLocalization
}