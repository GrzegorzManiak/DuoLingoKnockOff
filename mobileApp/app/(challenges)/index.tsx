import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function ChallengeIndexScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<ActivityIndicator size="large" color="#58CC02" />
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
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ChallengeIndexScreen;