// app/(tabs)/ride-booking.tsx
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function RideBookingScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  const handleBookRide = async () => {
    const user = await getUserInfo();
    if (!user?.email) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    if (!origin || !destination) {
      Alert.alert('Missing fields', 'Enter both origin and destination');
      return;
    }
    const res = await fetch(`${BASE_URL}/api/rides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': user.email },
      body: JSON.stringify({ origin, destination, sharedWithEmail: friendEmail || undefined }),
    });
    const data = await res.json();
    if (res.ok) {
      Alert.alert('Ride Booked!', `Ride from ${data.origin} to ${data.destination}`);
      setOrigin('');
      setDestination('');
      setFriendEmail('');
    } else {
      Alert.alert('Booking failed', data?.error || 'Unexpected error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Ride</Text>
      <TextInput style={styles.input} placeholder="Origin" value={origin} onChangeText={setOrigin} />
      <TextInput style={styles.input} placeholder="Destination" value={destination} onChangeText={setDestination} />
      <TextInput style={styles.input} placeholder="Friend's Email (optional)" value={friendEmail} onChangeText={setFriendEmail} />
      <Button title="Book Ride" onPress={handleBookRide} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
});
