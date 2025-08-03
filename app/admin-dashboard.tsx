import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BASE_URL } from '../utils/constants';

type Ride = {
  id: number;
  origin: string;
  destination: string;
  status: string;
  requested_at: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const resRides = await fetch(`${BASE_URL}/api/rides?status=pending`);
      const rideData = await resRides.json();
      setRides(rideData.rides || []);

      const resUsers = await fetch(`${BASE_URL}/api/users`);
      const userData = await resUsers.json();
      setUsers(userData.users || []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  const assignRide = async (rideId: number, driverId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/rides/${rideId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: driverId }),
      });

      if (!res.ok) throw new Error('Failed to assign ride');

      Alert.alert('Success', `Ride ${rideId} assigned to driver ${driverId}`);
      fetchData();
    } catch (err) {
      console.error('❌ Assignment error:', err);
      Alert.alert('Error', 'Could not assign ride');
    }
  };

  const renderRide = ({ item }: { item: Ride }) => (
    <View style={styles.card}>
      <Text style={styles.bold}>Ride #{item.id}</Text>
      <Text>From: {item.origin}</Text>
      <Text>To: {item.destination}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Requested: {new Date(item.requested_at).toLocaleString()}</Text>

      <Text style={styles.bold}>Assign Driver:</Text>
      {users
        .filter((u) => u.role === 'driver')
        .map((driver) => (
          <TouchableOpacity
            key={driver.id}
            style={styles.driverButton}
            onPress={() => assignRide(item.id, driver.id)}
          >
            <Text style={styles.driverText}>{driver.name}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Admin Dashboard</Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRide}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 40 },
  backButton: { position: 'absolute', top: 10, left: 20 },
  backText: { color: '#007AFF', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  bold: { fontWeight: '700', marginTop: 10, marginBottom: 5 },
  driverButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  driverText: { color: 'white', textAlign: 'center' },
});
