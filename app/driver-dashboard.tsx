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
import { getUserInfo } from '../utils/secureStore';

type Ride = {
  id: number;
  origin: string;
  destination: string;
  status: string;
  requested_at: string;
};

export default function DriverDashboard() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDriverRides = async () => {
    try {
      const user = await getUserInfo();
      if (!user?.id || user.role !== 'driver') {
        Alert.alert('Unauthorized', 'Only drivers can view this dashboard');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/rides?driver_id=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch driver rides');

      const data = await res.json();
      setRides(data.rides || []);
    } catch (err) {
      console.error('❌ Fetch error (driver dashboard):', err);
      Alert.alert('Error', 'Could not load assigned rides');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDriverRides();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDriverRides();
  };

  const renderRide = ({ item }: { item: Ride }) => (
    <View style={styles.card}>
      <Text style={styles.bold}>Ride #{item.id}</Text>
      <Text>From: {item.origin}</Text>
      <Text>To: {item.destination}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Requested: {new Date(item.requested_at).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Driver Dashboard</Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRide}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No assigned rides found.</Text>
          </View>
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
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  bold: { fontWeight: '700', marginBottom: 6 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
