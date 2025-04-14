import React from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { useSession } from '@/hooks/useSession';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, signOut } = useSession(); // -- The functions we passwed down in session context

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Logout Error", "Could not log out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}> 
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
        {user && (
          <Text style={styles.welcomeText}>
            Welcome, {user.usernameCased || user.username || 'User'}!
          </Text>
        )}
        <Text style={styles.infoText}>
          Blah blah some text
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Log Out" onPress={handleLogout} color="#e53e3e" /> 
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  welcomeText: {
      fontSize: 18,
      marginBottom: 15,
      color: '#555',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
      marginTop: 20,
      width: '80%'
  }
});
