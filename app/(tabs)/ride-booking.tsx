import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function RideBookingScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleBookRide = async () => {
    const user = await getUserInfo();
    if (!user?.email) {
      Alert.alert('User error', 'Please log in again.');
      return;
    }
    if (!origin || !destination) {
      Alert.alert('Missing fields', 'Please enter both origin and destination.');
      return;
    }
    const res = await fetch(`${BASE_URL}/api/rides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': user.email },
      body: JSON.stringify({ origin, destination }),
    });
    const data = await res.json();
    if (res.ok) {
      Alert.alert('Ride Booked!', `Ride from ${data.origin} to ${data.destination}`);
      setOrigin('');
      setDestination('');
    } else {
      Alert.alert('Booking failed', data?.error || 'Unexpected response from server.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="location-outline" size={20} color="#007AFF" style={{ marginRight: 8 }} />
          <TextInput
            style={{
              borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
              padding: 10, flex: 1,
            }}
            placeholder="Origin"
            value={origin}
            onChangeText={setOrigin}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="flag-outline" size={20} color="#007AFF" style={{ marginRight: 8 }} />
          <TextInput
            style={{
              borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
              padding: 10, flex: 1,
            }}
            placeholder="Destination"
            value={destination}
            onChangeText={setDestination}
          />
        </View>
      </View>
      <Button title="Book Ride" onPress={handleBookRide} />
    </View>
  );
}
