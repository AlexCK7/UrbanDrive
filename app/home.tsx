import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUserInfo } from '../utils/secureStore';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      try {
        const storedUser = await getUserInfo();
        if (!storedUser) {
          Alert.alert('Session Expired', 'Please log in again.');
          router.replace('/login');
          return;
        }
        setUser(storedUser);
      } catch (err) {
        console.error('❌ Failed to load user:', err);
        Alert.alert('Error', 'Could not retrieve user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetUser();
  }, []);

  const goToMain = () => {
    if (!user) return;
    switch (user.role) {
      case 'admin':
        router.push('/admin-dashboard');
        break;
      case 'driver':
        router.push('/driver-dashboard');
        break;
      default:
        router.push('/ride-booking');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name} 👋</Text>
      <Text style={styles.role}>Role: {user?.role}</Text>
      <TouchableOpacity style={styles.button} onPress={goToMain}>
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  role: { fontSize: 18, color: '#333', marginBottom: 30 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
});