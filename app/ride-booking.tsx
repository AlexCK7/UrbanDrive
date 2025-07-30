import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../utils/constants';
import { getUserInfo } from '../utils/secureStore';

export default function RideBookingScreen() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const bookRide = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, origin, destination }),
      });
      const data = await res.json();
      Alert.alert('Ride Requested', 'Your ride has been booked.');
      router.push('/ride-history');
    } catch (error) {
      Alert.alert('Error', 'Failed to book ride');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Ride</Text>
      <TextInput placeholder="Origin" value={origin} onChangeText={setOrigin} style={styles.input} />
      <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={bookRide}>
        <Text style={styles.buttonText}>Book Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#000', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
});