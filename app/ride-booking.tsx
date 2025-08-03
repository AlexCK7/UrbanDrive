import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { BASE_URL } from '../utils/constants';
import { getUserInfo } from '../utils/secureStore';

export default function RideBookingScreen() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleBookRide = async () => {
    try {
      const user = await getUserInfo();
      if (!user?.id) {
        Alert.alert('Error', 'User not found.');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          origin,
          destination,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('❌ Booking error:', text);
        throw new Error('Booking failed');
      }

      const data = await res.json();
      Alert.alert('Success', 'Ride booked successfully!');
      router.push('/ride-history');
    } catch (error) {
      console.error('❌ Ride booking failed:', error);
      Alert.alert('Error', 'Could not book ride. Try again later.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Book a Ride</Text>

        <TextInput
          style={styles.input}
          placeholder="Origin"
          placeholderTextColor="#555"
          value={origin}
          onChangeText={setOrigin}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination"
          placeholderTextColor="#555"
          value={destination}
          onChangeText={setDestination}
        />

        <TouchableOpacity style={styles.button} onPress={handleBookRide}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  back: {
    fontSize: 16,
    marginBottom: 20,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
