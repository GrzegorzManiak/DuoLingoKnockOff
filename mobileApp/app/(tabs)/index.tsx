import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlimLanguageSelector } from '@/components/SlimLanguageSelector';
import { ChallengeInfo } from '@/components/ChallengeInfo';
import { useLearningLanguage } from '@/contexts/LearningLanguageContext';
import { apiClient } from '@/utils/api';
import { components } from '@/types';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'expo-router';

type ChallengeDto = components['schemas']['ChallengeDto'];

function HomeScreen() {
	const { currentLanguage, isLoading: isLanguageLoading } = useLearningLanguage();
	const { getToken } = useSession();
	const router = useRouter();
	const [attemptingChallenges, setAttemptingChallenges] = useState<ChallengeDto[]>([]);
	const [completedChallenges, setCompletedChallenges] = useState<ChallengeDto[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchChallenges = async () => {
		if (!currentLanguage?.id) return;		
		setIsLoading(true);
		setError(null);
		
		try {
			const { data: attemptingData } = await apiClient.GET('/api/languages/{languageId}/Challenge/attempting', {
				params: { path: { languageId: currentLanguage.id }, query: { page: 1, pageSize: 3 } },
				headers: { 'Authorization': `Bearer ${getToken()}` }
			});

			const { data: completedData } = await apiClient.GET('/api/languages/{languageId}/Challenge/completed', {
				params: { path: { languageId: currentLanguage.id }, query: { page: 1, pageSize: 10 } },
				headers: { 'Authorization': `Bearer ${getToken()}` }
			});
			
			// @ts-ignore
			if (attemptingData) setAttemptingChallenges(attemptingData.items);
			// @ts-ignore
			if (completedData) setCompletedChallenges(completedData.items);
			
		} 
		catch (err) {
			setError('Failed to load challenges');
			console.error('Error loading challenges:', err);
		} 
		finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchChallenges();
	}, [currentLanguage?.id, getToken]);

	const startNewChallenge = async (difficulty: 0 | 1 | 2) => {
		if (!currentLanguage?.id) return;
		try {
			const { data } = await apiClient.POST('/api/languages/{languageId}/Challenge/new', {
				params: { 
					path: { languageId: currentLanguage.id },
					query: { difficulty }
				},
				headers: { 'Authorization': `Bearer ${getToken()}` }
			});
			
			if (data) router.push({
				pathname: '/(challenges)' as any,
				params: { 
					challengeId: data.id,
					languageId: currentLanguage.id
				}
			});
		} 
		
		catch (err) {
			console.error('Error starting challenge:', err);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container}>
				{/* Language Selector */}
				<SlimLanguageSelector />

				{/* Currently Attempting Section */}
				<View style={[styles.section, styles.challengesContainer]}>
					<Text style={styles.sectionTitle}>Currently Attempting</Text>
					{isLoading ? (
						<ActivityIndicator size="large" color="#58CC02" />
					) : error ? (
						<Text style={styles.errorText}>{error}</Text>
					) : (!attemptingChallenges || attemptingChallenges.length === 0) ? (
						<Text style={styles.emptyText}>You are not attempting any challenges</Text>
					) : (
						attemptingChallenges.map((challenge) => (
							<TouchableOpacity 
								key={challenge?.id} 
								onPress={() => {
									if (challenge?.id && currentLanguage?.id) {
										router.push({
											pathname: '/(challenges)/index' as any,
											params: { 
												challengeId: challenge.id,
												languageId: currentLanguage.id
											}
										});
									}
								}}
							>
								<ChallengeInfo 
									challenge={challenge} 
									style={styles.challengeInfo}
									imageStyle={styles.challengeImage}
								/>
							</TouchableOpacity>
						))
					)}
				</View>

				{/* Continue Learning Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Continue Learning</Text>
					<View style={styles.difficultyGrid}>
						<TouchableOpacity 
							style={[styles.difficultyCard, styles.easyCard]}
							onPress={() => startNewChallenge(0)}
						>
							<Text style={styles.difficultyText}>Easy</Text>
							<Text style={styles.difficultySubtext}>Perfect for beginners</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.difficultyCard, styles.mediumCard]}
							onPress={() => startNewChallenge(1)}
						>
							<Text style={styles.difficultyText}>Medium</Text>
							<Text style={styles.difficultySubtext}>Challenge yourself</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.difficultyCard, styles.hardCard]}
							onPress={() => startNewChallenge(2)}
						>
							<Text style={styles.difficultyText}>Hard</Text>
							<Text style={styles.difficultySubtext}>Test your skills</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Completed Challenges Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Completed Challenges</Text>
					{isLoading ? (
						<ActivityIndicator size="large" color="#58CC02" />
					) : error ? (
						<Text style={styles.errorText}>{error}</Text>
					) : (!completedChallenges || completedChallenges.length === 0) ? (
						<Text style={styles.emptyText}>You haven't completed any challenges yet</Text>
					) : (
						<ScrollView 
							horizontal 
							showsHorizontalScrollIndicator={false}
							style={styles.completedScroll}
						>
							{completedChallenges.map((challenge) => (
								<View key={challenge?.id}>
									<ChallengeInfo 
										challenge={challenge} 
										style={styles.completedInfo}
										imageStyle={styles.completedImage}
									/>
								</View>
							))}
						</ScrollView>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
	},
	section: {
		padding: 20,
		marginBottom: 0,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 5,
		color: '#333',
	},
	challengeInfo: {
		height: 70,
		marginBottom: 0,
	},
	challengeImage: {
		height: '100%',
	},
	challengeTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 5,
	},
	challengeSubtitle: {
		fontSize: 14,
		color: '#666',
	},
	continueCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		padding: 20,
		borderRadius: 12,
	},
	continueInfo: {
		flex: 1,
	},
	continueTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 5,
	},
	continueSubtitle: {
		fontSize: 14,
		color: '#666',
	},
	completedScroll: {
		flexDirection: 'row',
	},
	completedCard: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
	},
	completedInfo: {
		height: 100,
		marginBottom: 6,
	},
	completedImage: {
		height: '100%',
	},
	completedTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 5,
	},
	completedSubtitle: {
		fontSize: 12,
		color: '#666',
	},
	errorText: {
		color: '#E53E3E',
		fontSize: 16,
		textAlign: 'center',
		padding: 20,
	},
	emptyText: {
		color: '#666',
		fontSize: 16,
		textAlign: 'center',
		padding: 20,
		fontStyle: 'italic',
	},
	difficultyGrid: {
		flexDirection: 'row',
		gap: 10,
		justifyContent: 'space-between',
	},
	difficultyCard: {
		flex: 1,
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden',
	},
	easyCard: {
		backgroundColor: '#58CC02',
		borderBottomWidth: 6,
		borderBottomColor: '#3AA300',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	mediumCard: {
		backgroundColor: '#FF9500',
		borderBottomWidth: 6,
		borderBottomColor: '#E68600',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	hardCard: {
		backgroundColor: '#FF3B30',
		borderBottomWidth: 6,
		borderBottomColor: '#E62E2E',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	difficultyText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#fff',
	},
	difficultySubtext: {
		fontSize: 12,
		color: '#fff',
		opacity: 0.8,
		marginTop: 4,
	},
	challengesContainer: {
		flexDirection: 'column',
		gap: 10,
		marginBottom: 0,
		paddingBottom: 0
	},
});

export default HomeScreen;