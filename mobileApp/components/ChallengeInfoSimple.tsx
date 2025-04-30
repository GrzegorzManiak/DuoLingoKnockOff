import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getChallengeTypeName, getDifficultyName } from '@/utils/challengeUtils';
import {components} from "@/types";
import {useLocalization} from "@/hooks/useLocalization";


type ChallengeDto = components['schemas']['ChallengeDto'];

interface ChallengeInfoProps {
	challenge: ChallengeDto;
	style?: any;
	subtitleStyle?: any;
	imageStyle?: any;
}
const ChallengeInfoSimple: React.FC<ChallengeInfoProps> = ({ challenge, style, subtitleStyle }) => {
	const getDifficultyColor = (difficulty: number | undefined) => {
		switch (difficulty) {
			case 0: return '#58CC02'; // Easy
			case 1: return '#FF9500'; // Medium
			case 2: return '#FF3B30'; // Hard
			default: return '#E5E5E5';
		}
	};
	const { t } = useLocalization();

	const difficultyColor = getDifficultyColor(challenge?.difficulty);

	return (
		<View style={[styles.container, style]}>
			<View style={styles.infoContainer}>
				<Text style={[styles.subtitle, subtitleStyle]}>
					<Text style={[styles.subtitle, subtitleStyle]}>
						{t(`common.type.${getChallengeTypeName(challenge?.type).toLowerCase().replace(' ', '')}`)} | {t(`common.difficulty.${getDifficultyName(challenge?.difficulty).toLowerCase()}`)}
					</Text>
				</Text>
				<View style={[styles.difficultyIndicator, { backgroundColor: difficultyColor }]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		overflow: 'hidden',
	},
	infoContainer: {
		padding: 10,
	},
	subtitle: {
		fontSize: 14,
		color: '#666',
		marginBottom: 5,
	},
	difficultyIndicator: {
		height: 2,
		marginTop: 1,
		borderRadius: 2,
	}
});

export { ChallengeInfoSimple };