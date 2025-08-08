import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function RideBookingScreen() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [sharedWith, setSharedWith] = useState('');

  const handleBookRide = async () => {
    const user = await getUserInfo();
    if (!user?.email) {
      Alert.alert('Session Expired', 'Please log in again.');
      router.replace('/login');
      return;
    }
    if (!origin || !destination) {
      Alert.alert('Missing Fields', 'Please enter both origin and destination.');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
        },
        body: JSON.stringify({ origin, destination, sharedWithEmail: sharedWith || null }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Ride Booked!', `Ride from ${data.origin} to ${data.destination}`);
        setOrigin('');
        setDestination('');
        setSharedWith('');
      } else {
        Alert.alert('Booking Failed', data?.error || 'Unexpected response from server.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not book ride. Try again later.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10, fontSize: 20, fontWeight: 'bold' }}>Book a Ride</Text>
      <View style={styles.inputRow}>
        <Ionicons name="location-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Origin"
          value={origin}
          onChangeText={setOrigin}
        />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="flag-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
        />
      </View>
      <View style={styles.inputRow}>
      <Ionicons name="send-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Share with friend (email)"
          value={sharedWith}
          onChangeText={setSharedWith}
        />
      </View>
      <Button title="Book Ride" onPress={handleBookRide} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  input: { flex: 1, paddingVertical: 10, marginLeft: 8 },
  icon: { marginRight: 4 },
});
