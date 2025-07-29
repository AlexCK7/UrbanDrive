// app/home.tsx
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import { BASE_URL } from '../utils/constants';

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = await SecureStore.getItemAsync('userEmail');
        if (!email) {
          Alert.alert('Not logged in', 'Please log in again.');
          router.replace('/login');
          return;
        }

        const res = await fetch(`${BASE_URL}/api/user-info`, {
          headers: {
            'x-user-email': email,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUserName(data.name || 'User');
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch user info.');
        }
      } catch (err) {
        console.error('User fetch failed:', err);
        Alert.alert('Error', 'Unable to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back, {userName} 👋</Text>
      <Button title="Book a Ride" onPress={() => router.push('/ride-booking')} />
      <View style={styles.spacer} />
      <Button title="View Ride History" onPress={() => router.push('/ride-history')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 22,
    marginBottom: 30
  },
  spacer: {
    height: 20
  }
});
