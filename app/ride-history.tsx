import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { BASE_URL } from '../constants';
import { getUserInfo } from '../utils/secureStore';

// ✅ Define type for each ride
type Ride = {
  id: number;
  origin: string;
  destination: string;
  status: string;
};

export default function RideHistory() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { email } = await getUserInfo(); // ✅ Now inside async function

      const res = await fetch(`${BASE_URL}/api/rides/user`, {
        headers: {
          'x-user-email': email || ''
        }
      });

      const data = await res.json();
      setRides(data.rides || []);
    } catch (err) {
      console.error('Failed to fetch ride history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride History</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.rideCard}>
              <Text>From: {item.origin}</Text>
              <Text>To: {item.destination}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  rideCard: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10 }
});
