import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { apiClient } from '@/utils/api';
import { components } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type RegisterDto = components['schemas']['RegisterDto'];
// UserDto type is inferred by openapi-fetch

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useSession();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);

    const registerData: RegisterDto = {
      username,
      email,
      password,
      // preferredLanguage can be added here if needed
    };

    try {
      console.log('Attempting registration with:', registerData);
      // Use openapi-fetch client
      const { data, error: apiError } = await apiClient.POST('/api/Auth/register', {
        body: registerData,
        // No explicit headers needed here (defaults to application/json)
      });

      if (data) {
        console.log('Registration successful:', data);
        if (data.token) {
          await signIn(data, data.token);
          // Navigation handled by _layout.tsx effect
          // router.replace('/(tabs)');
        } else {
           setError('Registration successful, but no token received. Please log in.');
           console.error('Registration succeeded but no token received:', data);
           // Optionally navigate to login: router.push('/login');
        }
      } else if (apiError) {
        console.error('Registration failed with API error:', apiError);
        // Extract error message (adjust parsing based on your API error structure)
        let errorMessage = 'Registration failed. Please try again.';
        try {
            // Assuming apiError might be a validation problem details object or similar
            if (typeof apiError === 'object' && apiError !== null) {
                 // Example: Join validation errors if they exist
                 errorMessage = Object.values(apiError).flat().join(' ') || errorMessage;
             }
        } catch (parseError) {
            console.error("Error parsing API error object:", parseError);
        }
        setError(errorMessage);
      } else {
        setError('An unexpected error occurred during registration.');
        console.error('Unexpected registration response state');
      }
    } catch (err: any) {
      console.error('Network or unexpected registration error:', err);
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#A9A9A9"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A9A9A9"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#A9A9A9"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

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
  button: {
    width: '100%',
    backgroundColor: '#58CC02', // Duolingo green
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#B2E0B2', // Lighter green when disabled
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
    color: '#58CC02', // Duolingo green
    fontSize: 14,
    fontWeight: 'bold'
  },
}); 