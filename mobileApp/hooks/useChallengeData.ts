import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import { useSession } from '@/hooks/useSession';
import { components } from '@/types';

type ChallengeDto = components['schemas']['ChallengeDto'];

function useChallengeData(challengeId?: string, languageId?: string) {
	const { getToken } = useSession();
	const [challenge, setChallenge] = useState<ChallengeDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchChallenge = async () => {
			if (!challengeId || !languageId) {
				console.error(`Challenge ID or Language ID is missing: ${challengeId}, ${languageId}`);
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				console.log(`Fetching challenge with ID: ${challengeId} for language ID: ${languageId}`);
				// @ts-ignore
				const { data } = await apiClient.GET('/api/languages/{languageId}/Challenge/{challengeId}', {
					params: { path: { languageId: Number(languageId),  challengeId: Number(challengeId) } },
					headers: { 'Authorization': `Bearer ${getToken()}` }
				});

				console.log(`Challenge data:`, data);
				// @ts-ignore
				if (data) setChallenge(data);
			}

			catch (err) {
				setError('Failed to load challenge');
				console.error('Error loading challenge:', err);
			}

			finally {
				setIsLoading(false);
			}
		};

		fetchChallenge();
	}, [challengeId, languageId, getToken]);

	async function attemptChallenge(isCorrect: boolean) {
		if (!challengeId || !languageId) {
			console.error(`Challenge ID or Language ID is missing: ${challengeId}, ${languageId}`);
			return;
		}

		try {
			await apiClient.PUT('/api/languages/{languageId}/Challenge/{challengeId}', {
				params: { path: { languageId: languageId, challengeId: Number(challengeId) } },
				headers: { 'Authorization': `Bearer ${getToken()}` },
				body: { isCorrect }
			});
		}
		catch (err) {
			setError('Failed to attempt challenge');
			console.error('Error attempting challenge:', err);
		}
	}

	return {
		challenge,
		isLoading,
		error,
		parsedContent: challenge ? JSON.parse(challenge.content || '{}') : null,
		attemptChallenge,
	};
}

interface BaseChallengeContent {

}

interface MultipleChoiceContent extends BaseChallengeContent {
	answerPool: string[];
	display: number;
	parameters: {
		word: string;
	};
	explanationParameters: {
		word: string;
	};
	question: string;
	correctAnswer: string;
	explanation: string;
}

interface FillBlanksContent extends BaseChallengeContent {
}

interface AudioChallengeContent extends BaseChallengeContent {

}

export {
	useChallengeData,
	type ChallengeDto,
	type BaseChallengeContent,
	type MultipleChoiceContent,
	type FillBlanksContent,
	type AudioChallengeContent
}