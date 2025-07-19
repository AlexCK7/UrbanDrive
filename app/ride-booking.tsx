import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../constants';
import { getUserInfo } from '../utils/secureStore';

export default function RideBooking() {
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const bookRide = async () => {
  try {
    const { email } = await getUserInfo();

    const res = await fetch(`${BASE_URL}/api/rides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': email || ''
      },
      body: JSON.stringify({
        pickup_location: pickup,
        dropoff_location: dropoff
      })
    });

    const data = await res.json();
    Alert.alert('Ride Booked', data.message || 'Success');
    router.push('/ride-history');
  } catch (error) {
    Alert.alert('Error', 'Ride booking failed');
    console.error(error);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Ride</Text>
      <TextInput placeholder="Pickup Location" value={pickup} onChangeText={setPickup} style={styles.input} />
      <TextInput placeholder="Dropoff Location" value={dropoff} onChangeText={setDropoff} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={bookRide}>
        <Text style={styles.buttonText}>Confirm Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#000', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
