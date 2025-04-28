import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '@/utils/api';
import { useSession } from '@/hooks/useSession';
import { components } from '@/types';

type ChallengeDto = components['schemas']['ChallengeDto'];

interface ChallengeContent {
	question: string;
	parameters: {
		word: string;
	};
	answerPool: string[];
	display: number;
	correctAnswer: string;
	explanation: string;
	explanationParameters: {
		word: string;
	};
}

function MultipleChoiceScreen() {
	const { challengeId, languageId } = useLocalSearchParams();
	const { getToken } = useSession();
	const router = useRouter();
	const [challenge, setChallenge] = useState<ChallengeDto | null>(null);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchChallenge = async () => {
			if (!challengeId || !languageId) return;
			setIsLoading(true);
			setError(null);

			try {
				const { data } = await apiClient.GET('/api/languages/{languageId}/Challenge/{challengeId}', {
					params: { path: { languageId: Number(languageId), challengeId: Number(challengeId) } },
					headers: { 'Authorization': `Bearer ${getToken()}` }
				});
				if (data) setChallenge(data as ChallengeDto);
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

	if (isLoading) return (
		<SafeAreaView style={styles.container}>
			<ActivityIndicator size="large" color="#58CC02" />
		</SafeAreaView>
	);
	

	if (error || !challenge) return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.errorText}>{error || 'Challenge not found'}</Text>
			<TouchableOpacity 
				style={styles.backButton}
				onPress={() => router.back()}
			>
				<Text style={styles.backButtonText}>Go Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);


	const challengeContent: ChallengeContent = JSON.parse(challenge.content || '{}');

	const handleAnswerSelect = (answer: string) => {
		setSelectedAnswer(answer);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.question}>
					{challengeContent.question.replace('{word}', challengeContent.parameters.word)}
				</Text>
				
				<View style={styles.answersContainer}>
					{challengeContent.answerPool.map((answer, index) => (
						<TouchableOpacity
							key={index}
							style={[
								styles.answerButton,
								selectedAnswer === answer && styles.selectedAnswer
							]}
							onPress={() => handleAnswerSelect(answer)}
						>
							<Text style={styles.answerText}>{answer}</Text>
						</TouchableOpacity>
					))}
				</View>

				{selectedAnswer && (
					<View style={styles.resultContainer}>
						<Text style={[
							styles.resultText,
							selectedAnswer === challengeContent.correctAnswer ? styles.correct : styles.incorrect
						]}>
							{selectedAnswer === challengeContent.correctAnswer ? 'Correct!' : 'Incorrect'}
						</Text>
						<Text style={styles.explanation}>
							{challengeContent.explanation.replace('{word}', challengeContent.explanationParameters.word)}
						</Text>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		flex: 1,
		padding: 20,
	},
	question: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
		marginBottom: 30,
		textAlign: 'center',
	},
	answersContainer: {
		gap: 10,
	},
	answerButton: {
		backgroundColor: '#F8F8F8',
		padding: 15,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	selectedAnswer: {
		backgroundColor: '#E8F5E9',
		borderColor: '#58CC02',
	},
	answerText: {
		fontSize: 18,
		color: '#333',
		textAlign: 'center',
	},
	resultContainer: {
		marginTop: 30,
		padding: 20,
		backgroundColor: '#F8F8F8',
		borderRadius: 12,
	},
	resultText: {
		fontSize: 20,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 10,
	},
	correct: {
		color: '#58CC02',
	},
	incorrect: {
		color: '#FF3B30',
	},
	explanation: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	errorText: {
		color: '#E53E3E',
		fontSize: 16,
		textAlign: 'center',
		padding: 20,
	},
	backButton: {
		marginTop: 20,
		padding: 15,
		backgroundColor: '#F8F8F8',
		borderRadius: 12,
		alignItems: 'center',
	},
	backButtonText: {
		fontSize: 16,
		color: '#58CC02',
		fontWeight: '600',
	},
});

export default MultipleChoiceScreen;