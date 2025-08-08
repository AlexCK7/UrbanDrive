import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function DriverDashboard() {
  const router = useRouter();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRides = async () => {
    const user = await getUserInfo();
    if (!user?.email || user.role !== 'driver') {
      Alert.alert('Access Denied', 'Only drivers can view this dashboard.');
      router.replace('/home');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/rides/driver`, {
        headers: { 'x-user-email': user.email },
      });
      const data = await res.json();
      setRides(Array.isArray(data.rides) ? data.rides : []);
    } catch (err) {
      Alert.alert('Error', 'Could not load driver rides.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRides();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading rides...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
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
      <Text style={styles.title}>Driver Dashboard</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text>No assigned rides found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  bold: { fontWeight: '700', marginBottom: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
