import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../utils/constants';

type Ride = {
  id: number;
  origin: string;
  destination: string;
  status: string;
};

export default function AdminDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRides = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/rides?status=pending`);
      const data = await res.json();
      setRides(data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const assignDriver = async (rideId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/rides/${rideId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: 1 }) // Replace with real driver ID logic
      });
      const data = await res.json();
      Alert.alert('Success', `Driver assigned to ride ${rideId}`);
      fetchPendingRides();
    } catch (error) {
      Alert.alert('Error', 'Failed to assign driver');
    }
  };

  useEffect(() => {
    fetchPendingRides();
  }, []);

  const renderItem = ({ item }: { item: Ride }) => (
    <View style={styles.rideCard}>
      <Text>From: {item.origin}</Text>
      <Text>To: {item.destination}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity onPress={() => assignDriver(item.id)} style={styles.button}>
        <Text style={styles.buttonText}>Assign Driver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      {loading ? <Text>Loading...</Text> : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  rideCard: { marginBottom: 15, padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  button: { marginTop: 10, backgroundColor: '#000', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
