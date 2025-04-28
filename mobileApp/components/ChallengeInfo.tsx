import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { components } from '@/types';
import { getChallengeTypeName, getDifficultyName } from '@/utils/challengeUtils';

type ChallengeDto = components['schemas']['ChallengeDto'];

interface ChallengeInfoProps {
	challenge: ChallengeDto;
	style?: any;
	subtitleStyle?: any;
	imageStyle?: any;
}

const ChallengeInfo: React.FC<ChallengeInfoProps> = ({
	 challenge,
	 style,
	 subtitleStyle,
	 imageStyle
 }) => {
	const getDifficultyColor = (difficulty: number | undefined) => {
		switch (difficulty) {
			case 0: return '#58CC02';
			case 1: return '#FF9500';
			case 2: return '#FF3B30';
			default: return '#E5E5E5';
		}
	};

	const difficultyColor = getDifficultyColor(challenge?.difficulty);
	return (
		<View style={[
			styles.container,
			style,
		]}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: `https://picsum.photos/200/200?seed=${challenge?.type}` }}
					style={[styles.image, imageStyle]}
				/>
				<View style={styles.slantContainer}>
					<View style={[styles.slant, {
						borderWidth: 2,
						borderColor: difficultyColor,
					}]} />
				</View>
			</View>
			<View style={styles.infoContainer}>
				<Text style={[styles.subtitle, subtitleStyle]}>
					Type: {getChallengeTypeName(challenge?.type)}
				</Text>
				<Text style={[styles.subtitle, subtitleStyle]}>
					Difficulty: {getDifficultyName(challenge?.difficulty)}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderRadius: 8,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	imageContainer: {
		width: '33%',
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	slantContainer: {
		height: 200,
		width: 30,
		top: -50,
		right: -10,
		overflow: 'hidden',
		position: 'absolute',
		transform: [{ rotate: '-8deg' }],
	},
	slant: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'white',
	},
	infoContainer: {
		flex: 1,
		padding: 10,
		justifyContent: 'center',
		transform: [{ translateX: -15 }],
	},
	subtitle: {
		fontSize: 14,
		color: '#666',
	},
});

export {
	ChallengeInfo,
}