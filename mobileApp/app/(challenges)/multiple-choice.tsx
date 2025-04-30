import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChallengeData, MultipleChoiceContent } from '@/hooks/useChallengeData';
import {useLocalization} from "@/hooks/useLocalization";
import {useLearningLanguage} from "@/hooks/useLearningLanguage";

function MultipleChoiceScreen() {
	const { challengeId, languageId } = useLocalSearchParams();
	const { currentLanguage } = useLearningLanguage();
	const { t } = useLocalization();
	// @ts-ignore
	const { challenge, isLoading, error, parsedContent, attemptChallenge } = useChallengeData(challengeId, languageId);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const router = useRouter();

	const challengeContent = parsedContent as MultipleChoiceContent;
	const handleAnswerSelect = async (answer: string) => {
		// If a correct answer is already selected, don't allow further selections
		if (selectedAnswer === challengeContent.correctAnswer) return;
		
		const isCorrect = answer === challengeContent.correctAnswer;
		setSelectedAnswer(answer);
		await attemptChallenge(isCorrect);
	};

	let variableLanguage = currentLanguage?.name ?? undefined;

	if (isLoading) return (
		<SafeAreaView style={styles.container}>
			<ActivityIndicator size="large" color="#58CC02" />
		</SafeAreaView>
	);

	if (error || !challenge) return (
		<SafeAreaView style={styles.errorContainer}>
			<Text style={styles.errorText}>{error || 'Challenge not found'}</Text>
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => router.back()}
			>
				<Text style={styles.backButtonText}>Go Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.mainContainer}>
				<View style={styles.questionContainer}>
					<Text style={styles.question}>
						{t(challengeContent.question, { word: t(`challenges.answers.${challengeContent.parameters.word}`, {}, variableLanguage) })}
					</Text>
	
					{selectedAnswer && (
						<View style={styles.resultContainer}>
							<Text style={[
								styles.resultText,
								selectedAnswer === challengeContent.correctAnswer ? styles.correct : styles.incorrect
							]}>
								{t(selectedAnswer === challengeContent.correctAnswer ? 'common.correct' : 'common.incorrect')}
							</Text>

							{/*<Text style={styles.explanation}>*/}
							{/*	{t(challengeContent.explanation, { word: challengeContent.explanationParameters.word })}*/}
							{/*</Text>*/}

							{selectedAnswer === challengeContent.correctAnswer && (
								<>
									<Text style={styles.successText}>
										{t('common.challengeCompleted')}
									</Text>

									<TouchableOpacity
										style={styles.successButton}
										onPress={() => router.back()}
									>
										<Text style={styles.successButtonText}>
											{t('common.continue')}
										</Text>
									</TouchableOpacity>
								</>
							)}
						</View>
					)}
				</View>
	
				<ScrollView style={styles.answersScrollContainer}>
					<View style={styles.answersContainer}>
						{challengeContent.answerPool.map((answer, index) => (
							<TouchableOpacity
								key={index}
								style={[
									styles.answerButton,
									selectedAnswer === answer && (
										answer === challengeContent.correctAnswer
											? styles.selectedCorrectAnswer
											: styles.selectedIncorrectAnswer
									),
									selectedAnswer === challengeContent.correctAnswer &&
										answer !== challengeContent.correctAnswer &&
										styles.selectedIncorrectAnswer
								]}
								onPress={() => handleAnswerSelect(answer)}
								disabled={selectedAnswer === challengeContent.correctAnswer}
								activeOpacity={selectedAnswer === challengeContent.correctAnswer ? 1: 0.2}
							>
								<Text style={styles.answerText}>
									{t(`challenges.answers.${answer}`, {})}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</View>
	
			<View style={styles.footer}>
				<TouchableOpacity
					style={styles.footerButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>
						{t('common.goBack')}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	mainContainer: {
		flex: 1,
		paddingBottom: 70, // Make room for the footer
	},
	questionContainer: {
		padding: 20,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 0,
	},
	question: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
		marginBottom: 30,
		textAlign: 'center',
	},
	answersScrollContainer: {
		flex: 1,
		paddingHorizontal: 20,
	},
	answersContainer: {
		gap: 10,
		paddingBottom: 20,
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
	footer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	footerButton: {
		padding: 15,
		backgroundColor: '#F8F8F8',
		borderRadius: 12,
		alignItems: 'center',
	},
	backButton: {
		marginTop: 20,
		padding: 15,
		marginLeft: 20,
		marginRight: 20,
		backgroundColor: '#F8F8F8',
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 20
	},
	backButtonText: {
		fontSize: 16,
		color: '#58CC02',
		fontWeight: '600',
	},
	selectedCorrectAnswer: {
		backgroundColor: '#E8F5E9',
		borderColor: '#58CC02',
	},
	selectedIncorrectAnswer: {
		backgroundColor: '#FFEBEE',
		borderColor: '#FF3B30',
	},
	resultBackButton: {
		marginTop: 20,
		padding: 15,
		backgroundColor: '#F8F8F8',
		borderRadius: 12,
		alignItems: 'center',
	},
	successButton: {
		marginTop: 20,
		padding: 15,
		backgroundColor: '#58CC02',
		borderRadius: 12,
		alignItems: 'center',
	},
	successButtonText: {
		fontSize: 16,
		color: '#FFFFFF',
		fontWeight: '600',
	},
	successText: {
		fontSize: 20,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 2,
		marginTop: 15,
		color: '#58CC02',
	},
});

export default MultipleChoiceScreen;