// app/(tabs)/admin-dashboard.tsx
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function AdminDashboard() {
  const [rides, setRides] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [assignDriver, setAssignDriver] = useState<{ [rideId: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const loadData = async () => {
    const user = await getUserInfo();
    if (!user?.email || user.role !== 'admin') {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    try {
      const ridesRes = await fetch(`${BASE_URL}/api/rides`, { headers: { 'x-user-email': user.email } });
      const ridesData = await ridesRes.json();
      const driversRes = await fetch(`${BASE_URL}/admin/drivers`, { headers: { 'x-user-email': user.email } });
      const driversData = await driversRes.json();
      setRides(Array.isArray(ridesData.rides) ? ridesData.rides : []);
      setDrivers(Array.isArray(driversData) ? driversData : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (rideId: number) => {
    const user = await getUserInfo();
    const driverEmail = assignDriver[rideId];
    if (!driverEmail) {
      Alert.alert('Select a driver first');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/rides/${rideId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || '',
        },
        body: JSON.stringify({ driverEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Ride assigned successfully');
        loadData();
      } else {
        Alert.alert('Error', data?.error || 'Failed to assign driver');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to assign driver');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (unauthorized) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Access denied. You are not an admin.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.header}>All Ride Requests</Text>
      {rides.map((ride) => (
        <View key={ride.id} style={{ marginBottom: 20 }}>
          <Text>{ride.origin} ➜ {ride.destination} ({ride.status})</Text>
          {ride.status === 'pending' && (
            <>
              <Picker
                selectedValue={assignDriver[ride.id]}
                onValueChange={(value: string) => setAssignDriver((prev) => ({ ...prev, [ride.id]: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Select driver" value="" />
                {drivers.map((driver: any) => (
                  <Picker.Item key={driver.id} label={driver.name} value={driver.email} />
                ))}
              </Picker>
              <Button title="Assign Driver" onPress={() => handleAssign(ride.id)} />
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  picker: { height: 45, width: '100%', marginVertical: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  error: { fontSize: 16, color: 'red' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
