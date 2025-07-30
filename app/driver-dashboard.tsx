import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../utils/constants';
import { getUserInfo } from '../utils/secureStore';

type Ride = {
  id: number;
  origin: string;
  destination: string;
  status: string;
};

export default function DriverDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchDriverRides = async () => {
    try {
      const { id } = await getUserInfo();
      const res = await fetch(`${BASE_URL}/api/rides?driver_id=${id}`);
      const data = await res.json();
      setRides(data.rides || []);
    } catch (err) {
      console.error('Error fetching driver rides:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const completeRide = async (rideId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/rides/${rideId}/complete`, {
        method: 'POST'
      });
      const data = await res.json();
      Alert.alert('Ride Status', data.message || 'Ride completed');
      fetchDriverRides(); // Refresh list
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not complete the ride');
    }
  };

  useEffect(() => {
    fetchDriverRides();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDriverRides();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading rides...</Text>
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No assigned rides found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.info}>From: {item.origin}</Text>
            <Text style={styles.info}>To: {item.destination}</Text>
            <Text style={styles.info}>Status: {item.status}</Text>
            {item.status !== 'completed' && (
              <TouchableOpacity style={styles.completeButton} onPress={() => completeRide(item.id)}>
                <Text style={styles.buttonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#f4f4f4', padding: 16, borderRadius: 8, marginBottom: 12 },
  info: { fontSize: 16, marginBottom: 4 },
  completeButton: { backgroundColor: 'green', padding: 10, borderRadius: 6, marginTop: 8 },
  buttonText: { color: 'white', textAlign: 'center' },
});
