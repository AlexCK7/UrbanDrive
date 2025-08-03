import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextStyle,
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

export default function RideHistoryScreen() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRideHistory = async () => {
    try {
      const user = await getUserInfo();
      if (!user?.id) {
        Alert.alert('Error', 'User not found.');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/rides?user_id=${user.id}`);
      if (!res.ok) throw new Error('Fetch failed');

      const data = await res.json();
      setRides(data.rides || []);
    } catch (err) {
      console.error('❌ Error fetching ride history:', err);
      Alert.alert('Error', 'Could not load ride history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRideHistory();
  };

  const renderItem = ({ item }: { item: Ride }) => (
    <View style={styles.card}>
      <Text style={styles.info}>From: {item.origin}</Text>
      <Text style={styles.info}>To: {item.destination}</Text>
      <Text style={[styles.info, getStatusStyle(item.status)]}>
        Status: {item.status}
      </Text>
      <Text style={styles.date}>
        Requested: {new Date(item.requested_at).toLocaleString()}
      </Text>
    </View>
  );

const getStatusStyle = (status: string): TextStyle => {
  const colorMap: { [key: string]: string } = {
    pending: 'orange',
    'in-progress': 'blue',
    completed: 'green',
  };

  return {
    color: colorMap[status] || 'gray',
    fontWeight: '700', // ✅ Valid numeric weight
  };
};


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Ride History</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text>Loading rides...</Text>
        </View>
      ) : rides.length === 0 ? (
        <View style={styles.centered}>
          <Text>No rides found.</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 40 },
  backButton: { position: 'absolute', top: 10, left: 20 },
  backText: { color: '#007AFF', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  info: { fontSize: 16, marginBottom: 4 },
  date: { fontSize: 14, color: '#666' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
