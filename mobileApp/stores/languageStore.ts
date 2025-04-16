import { create } from 'zustand';
import { Language } from '@/types';

interface LanguageState {
  availableLanguages: Language[];
  setAvailableLanguages: (languages: Language[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  availableLanguages: [],
  setAvailableLanguages: (languages) => set({ availableLanguages: languages }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
})); 