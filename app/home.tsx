import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserInfo } from '../utils/secureStore';

export default function HomeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const { name } = await getUserInfo();
      setName(name || 'Guest');
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back, {name} 👋</Text>
      <TouchableOpacity onPress={() => router.push('/ride-booking')}>
        <Text style={styles.buttonText}>🚗 Book a Ride</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/ride-history')}>
        <Text style={styles.buttonText}>📜 Ride History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  welcome: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#000',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
});
