import { useLearningLanguage as useLearningLanguageContext } from '@/contexts/LearningLanguageContext';

function useLearningLanguage() {
	return useLearningLanguageContext();
} 

export {
	useLearningLanguage
}