import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { apiClient } from '@/utils/api';
import { components } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginDto = components['schemas']['LoginDto'];

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useSession();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    setError(null);

    const loginData: LoginDto = {
      username,
      password,
    };

    try {
      console.log('Attempting login with:', loginData);
      const { data, error: apiError, response } = await apiClient.POST('/api/Auth/login', {
        body: loginData,
      });

      if (data) {
        console.log('Login successful:', data);
        if (data.token) {
          await signIn(data, data.token);
        } else {
          setError('Login successful, but no token received.');
          console.error('Login succeeded but no token received:', data);
        }
      } else if (apiError) {
        console.error('Login failed with API error:', apiError);
        let errorMessage = 'Login failed. Check your credentials.';
        if (typeof apiError === 'object' && apiError !== null && 'title' in apiError) {
          errorMessage = (apiError as any).title;
        } else if (typeof apiError === 'string') {
          errorMessage = apiError;
        }
        setError(errorMessage);
      } else {
        setError('An unexpected error occurred during login.');
        console.error('Unexpected login response state');
      }
    } catch (err: any) {
      console.error('Network or unexpected login error:', err);
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>

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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#A9A9A9"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkButton}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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