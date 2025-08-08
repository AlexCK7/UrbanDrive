import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

interface Ride {
  id: number;
  origin: string;
  destination: string;
  status: string;
}

interface Driver {
  id: number;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignDriver, setAssignDriver] = useState<{ [rideId: number]: string }>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const user = await getUserInfo();
    if (!user?.email || user.role !== 'admin') {
      Alert.alert('Access denied', 'You are not an admin');
      return;
    }

    try {
      const [ridesRes, driversRes] = await Promise.all([
        fetch(`${BASE_URL}/api/rides`, { headers: { 'x-user-email': user.email } }),
        fetch(`${BASE_URL}/admin/drivers`, { headers: { 'x-user-email': user.email } }),
      ]);

      const ridesData = await ridesRes.json();
      const driversData = await driversRes.json();

      setRides(Array.isArray(ridesData.rides) ? ridesData.rides : []);
      setDrivers(Array.isArray(driversData) ? driversData : []);
    } catch (err) {
      Alert.alert('Error loading data', String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (rideId: number) => {
    const user = await getUserInfo();
    const driverEmail = assignDriver[rideId];
    if (!driverEmail) return Alert.alert('Select a driver first');

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
        Alert.alert('Assigned', 'Ride assigned successfully');
      } else {
        Alert.alert('Error', data?.error || 'Failed to assign');
      }
    } catch (err) {
      Alert.alert('Network Error', String(err));
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>All Ride Requests</Text>
      {rides.map((ride) => (
        <View key={ride.id} style={styles.card}>
          <Text>{ride.origin} ➜ {ride.destination} ({ride.status})</Text>
          {ride.status === 'pending' && (
            <>
              <Picker
                selectedValue={assignDriver[ride.id]}
                onValueChange={(value: string) =>
                  setAssignDriver((prev) => ({ ...prev, [ride.id]: value }))
                }
                style={styles.picker}
              >
                <Picker.Item label="Select driver" value="" />
                {drivers.map((driver) => (
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
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: { marginBottom: 15 },
  picker: { height: 50, width: '100%', marginVertical: 10 },
});
