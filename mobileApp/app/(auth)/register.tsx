import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { apiClient } from '@/utils/api';
import { components } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type RegisterDto = components['schemas']['RegisterDto'];

function RegisterScreen() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [outlined, setOutlined] = useState<{username: boolean, email: boolean, password: boolean}>({
		username: false, 
		email: false, 
		password: false
	});
	const router = useRouter();
	const { signIn } = useSession();

	async function handleRegister() {
		if (!username || !email || !password) {
			let [outlinedUsername, outlinedEmail, outlinedPassword, error] = [false, false, false, 'Sorry, but'];
			
			if (username.length < 3) {
				outlinedUsername = true;
				error += ' your username must be at least 3 characters long';
			}

			if (!email.includes('@')) {
				outlinedEmail = true;
				if (outlinedUsername) error += ',';
				error += ' your email must be valid';
			}

			if (password.length < 6) {
				outlinedPassword = true;
				if (outlinedUsername || outlinedEmail) error += ' and';
				error += ' your password must be at least 6 characters long';
			}
		
			setOutlined({username: outlinedUsername, email: outlinedEmail, password: outlinedPassword});
			setError(error);
			return;
		}

		setLoading(true);
		setError(null);
		const registerData: RegisterDto = { username, email, password };

		try {
			console.log('Attempting registration with:', registerData);
			const { data, error: apiError } = await apiClient.POST('/api/Auth/register', { body: registerData });

			if (data) {
				console.log('Registration successful:', data);
				if (data.token) return await signIn(data, data.token);
				setError('Registration successful, but no token received.');
				console.log('Registration succeeded but no token received:', data);
			} 
			
			else if (apiError) {
				console.log('Registration failed with API error:', apiError);
				setOutlined({username: true, email: true, password: true});
				setError(`Sorry, but the registration failed. Please try again.`);
			} 
			
			else {
				setError('An unexpected error occurred during registration.');
				console.log('Unexpected registration response state');
			}
		} 
		
		catch (err: any) {
			console.log('Network or unexpected registration error:', err);
			setError(err.message || 'A network error occurred. Please try again.');
		} 
		
		finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.title}>Create Account</Text>

				{error && <Text style={styles.errorText}>{error}</Text>}

				<TextInput
					style={[styles.input, outlined.username && styles.outlinedInput]}
					placeholder="Username"
					value={username}
					onChangeText={setUsername}
					autoCapitalize="none"
					placeholderTextColor={outlined.username ? '#ff7a70' : '#b0b0b0'}
				/>
				
				<TextInput
					style={[styles.input, outlined.email && styles.outlinedInput]}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
					placeholderTextColor={outlined.username ? '#ff7a70' : '#b0b0b0'}
				/>
				
				<TextInput
					style={[styles.input, outlined.password && styles.outlinedInput]}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					placeholderTextColor={outlined.username ? '#ff7a70' : '#b0b0b0'}
				/>

				<TouchableOpacity
					style={[styles.button, loading && styles.buttonDisabled]}
					onPress={handleRegister}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#ffffff" />
					) : (
						<Text style={styles.buttonText}>Register</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity onPress={() => router.push('/login')} style={styles.linkButton}>
					<Text style={styles.linkText}>Already have an account? Log In</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#4B4B4B',
		marginBottom: 30,
	},
	input: {
		width: '100%',
		height: 50,
		backgroundColor: '#F0F0F0',
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	outlinedInput: {
		borderColor: 'red',
		borderWidth: 1,
		backgroundColor: '#ffe0de',
		color: '#ff7a70',
	},
	button: {
		width: '100%',
		backgroundColor: '#58CC02',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonDisabled: {
		backgroundColor: '#B2E0B2',
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	errorText: {
		color: 'red',
		marginBottom: 15,
		textAlign: 'center'
	},
	linkButton: {
		marginTop: 20,
	},
	linkText: {
		color: '#58CC02',
		fontSize: 14,
		fontWeight: 'bold'
	},
}); 

export default RegisterScreen;