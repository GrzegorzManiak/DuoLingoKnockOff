import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLearningLanguage } from '@/hooks/useLearningLanguage';
import { apiClient } from '@/utils/api';
import { components } from '@/types';
import { useSession } from '@/hooks/useSession';
type LeaderboardDto = components['schemas']['LeaderboardDto'];

export default function LeaderboardScreen() {
	const { currentLanguage } = useLearningLanguage();
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { getToken } = useSession();
	const [error, setError] = useState<string | null>(null);

	const getAvatarUrl = (username: string) => {
		return `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(username)}`;
	};

	useEffect(() => {
		const fetchLeaderboard = async () => {
			if (!currentLanguage?.id) return;
			
			setIsLoading(true);
			setError(null);
			
			try {
				const { data, error: apiError } = await apiClient.GET('/api/Languages/{id}/leaderboard', {
					params: { path: { id: currentLanguage.id } },
					cache: 'no-store',
					parseAs: 'json',
					headers: { 'Authorization': `Bearer ${getToken()}` }
				});
				
				if (data) setLeaderboardData(data);
				else if (apiError) {
					setError('Failed to load leaderboard');
					console.error('Leaderboard error:', apiError);
				}

				console.log('Leaderboard data:', leaderboardData);
			} 

			catch (err) {
				setError('Network error occurred');
				console.error('Network error:', err);
			} 
			
			finally {
				setIsLoading(false);
			}
		};

		fetchLeaderboard();
	}, [currentLanguage]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>Leaderboard</Text>
					<View style={styles.languageSelector}>
						<IconSymbol name="flag.fill" size={16} color="#666" style={styles.flagIcon} />
						<Text style={styles.languageText}>{currentLanguage?.nativeName || 'Loading...'}</Text>
						<IconSymbol name="chevron.down" size={20} color="#666" />
					</View>
				</View>
				
				{/* Leaderboard List */}
				<ScrollView style={styles.leaderboardList}>
					{isLoading ? (
						<View style={styles.loadingContainer}>
							<Text style={styles.loadingText}>Loading...</Text>
							<ActivityIndicator size="large" color="#58CC02" />
						</View>
					) : error ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					) : leaderboardData?.entries?.length === 0 ? (
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>No people on the leaderboard yet</Text>
						</View>
					) : leaderboardData?.entries?.map((user, index) => (
						<View key={user.userId} style={[
							styles.leaderboardItem,
							index === 0 && styles.firstPlace,
							index === 1 && styles.secondPlace,
							index === 2 && styles.thirdPlace
						]}>
							<View style={[
								styles.rankContainer,
								index === 0 && styles.firstPlaceRank,
								index === 1 && styles.secondPlaceRank,
								index === 2 && styles.thirdPlaceRank
							]}>
								<Text style={[
									styles.rankText,
									index < 3 && styles.topThreeRankText
								]}>{index + 1}</Text>
							</View>
							<View style={styles.userInfo}>
								<View style={styles.avatarContainer}>
									<Image
										source={{ uri: getAvatarUrl(user.username || '') }}
										style={styles.avatar}
									/>
								</View>
								<View style={styles.userDetails}>
									<Text style={styles.userName}>{user.usernameCased || user.username}</Text>
									<Text style={styles.userStats}>
										{user.totalScore} XP • {user.completedChallenges} challenges
									</Text>
								</View>
							</View>
							{index < 3 && (
								<IconSymbol
									name={`${index === 0 ? 'trophy.fill' : 'medal.fill'}`}
									size={24}
									color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
								/>
							)}
						</View>
					))}
					{leaderboardData?.entries && leaderboardData.entries.length > 0 && (
						<View style={styles.endOfListContainer}>
							<Text style={styles.endOfListText}>End of leaderboard</Text>
						</View>
					)}
				</ScrollView>
			</View>
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
	header: {
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
	},
	languageSelector: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
	languageText: {
		fontSize: 16,
		color: '#666',
	},
	leaderboardList: {
		flex: 1,
	},
	leaderboardItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	rankContainer: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: '#F8F8F8',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	loadingText: {
		fontSize: 16,
		color: '#666',
	},
	rankText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
	},
	userInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	avatarContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#F8F8F8',
		overflow: 'hidden',
	},
	avatar: {
		width: '100%',
		height: '100%',
	},
	userDetails: {
		flex: 1,
	},
	userName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	userStats: {
		fontSize: 14,
		color: '#666',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		color: '#E53E3E',
		fontSize: 16,
		textAlign: 'center',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	emptyText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	firstPlace: {
		backgroundColor: '#FFF9E6',
	},
	secondPlace: {
		backgroundColor: '#F5F5F5',
	},
	thirdPlace: {
		backgroundColor: '#FFF3E0',
	},
	firstPlaceRank: {
		backgroundColor: '#FFD700',
	},
	secondPlaceRank: {
		backgroundColor: '#C0C0C0',
	},
	thirdPlaceRank: {
		backgroundColor: '#CD7F32',
	},
	topThreeRankText: {
		color: '#FFFFFF',
	},
	endOfListContainer: {
		padding: 20,
		alignItems: 'center',
	},
	endOfListText: {
		fontSize: 14,
		color: '#999',
		fontStyle: 'italic',
	},
	flagIcon: {
		marginRight: 8,
	},
}); 