// app/(tabs)/driver-dashboard.tsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function DriverDashboard() {
  const router = useRouter();
  const [rides, setRides] = useState<any[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRides = async () => {
    setLoading(true);
    const user = await getUserInfo();
    if (!user?.email || user.role !== 'driver') {
      Alert.alert('Error', 'You are not a driver');
      setLoading(false);
      return;
    }
    // Rides assigned to driver
    const assignedRes = await fetch(`${BASE_URL}/api/rides/driver`, { headers: { 'x-user-email': user.email } });
    const assignedData = await assignedRes.json();
    setRides(Array.isArray(assignedData.rides) ? assignedData.rides : []);
    // Unassigned rides (optional)
    const unassignedRes = await fetch(`${BASE_URL}/api/rides`, { headers: { 'x-user-email': user.email } });
    const unassignedData = await unassignedRes.json();
    setUnassigned((unassignedData.rides || []).filter((r:any) => !r.driver_id));
    setLoading(false);
  };

  useEffect(() => { loadRides(); }, []);

  const onRefresh = () => { setRefreshing(true); loadRides().then(() => setRefreshing(false)); };

  const handleAccept = async (rideId: number) => {
    const user = await getUserInfo();
    const res = await fetch(`${BASE_URL}/api/rides/${rideId}/self-assign`, {
      method: 'PATCH',
      headers: { 'x-user-email': user?.email || '' },
    });
    const data = await res.json();
    if (res.ok) { Alert.alert('Ride accepted'); loadRides(); }
    else { Alert.alert('Error', data?.error || 'Failed to accept ride'); }
  };

  const handleComplete = async (rideId: number) => {
    const user = await getUserInfo();
    const res = await fetch(`${BASE_URL}/api/rides/${rideId}/complete`, {
      method: 'PATCH',
      headers: { 'x-user-email': user?.email || '' },
    });
    const data = await res.json();
    if (res.ok) { Alert.alert('Ride completed'); loadRides(); }
    else { Alert.alert('Error', data?.error || 'Failed to complete ride'); }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
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
      {item.status === 'assigned' && <Button title="Complete Ride" onPress={() => handleComplete(item.id)} />}
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
        ListEmptyComponent={<View style={styles.center}><Text>No rides assigned yet.</Text></View>}
      />

      {/* Unassigned rides list (optional) */}
      {unassigned.length > 0 && (
        <>
          <Text style={styles.subtitle}>Available Rides</Text>
          {unassigned.map((ride) => (
            <View key={ride.id} style={styles.card}>
              <Text>{ride.origin} ➜ {ride.destination} ({ride.status})</Text>
              <Button title="Accept Ride" onPress={() => handleAccept(ride.id)} />
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 40 },
  backButton: { position: 'absolute', top: 10, left: 20 },
  backText: { color: '#007AFF', fontSize: 16 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 20 },
  card: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 10, marginBottom: 16 },
  bold: { fontWeight: '700', marginBottom: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
