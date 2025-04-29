import { useLocalization as useLocalizationContext } from '@/contexts/LocalizationContext';

function useLocalization() {
	return useLocalizationContext();
} 

export {
	useLocalization
}