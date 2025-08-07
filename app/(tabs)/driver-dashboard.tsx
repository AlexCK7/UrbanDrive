import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList, RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function DriverDashboard() {
  const router = useRouter();
  const [rides, setRides] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDriverRides = async () => {
    setLoading(true);
    try {
      const user = await getUserInfo();
      if (!user?.email || user.role !== 'driver') {
        Alert.alert('Unauthorized', 'Only drivers can view this dashboard');
        setLoading(false);
        return;
      }
      const res = await fetch(`${BASE_URL}/api/rides/driver`, {
        headers: { 'x-user-email': user.email },
      });
      if (!res.ok) throw new Error('Failed to fetch driver rides');
      const data = await res.json();
      setRides(Array.isArray(data.rides) ? data.rides : []);
    } catch (err) {
      console.error('❌ Fetch error (driver dashboard):', err);
      Alert.alert('Error', 'Could not load assigned rides');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading driver rides...</Text>
      </View>
    );
  }

  const renderRide = ({ item }: { item: any }) => (
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<View style={styles.centered}><Text>No assigned rides found.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 40 },
  backButton: { position: 'absolute', top: 10, left: 20 },
  backText: { color: '#007AFF', fontSize: 16 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 10, marginBottom: 16 },
  bold: { fontWeight: '700', marginBottom: 6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
