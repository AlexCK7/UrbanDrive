import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function AdminDashboard() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      const user = await getUserInfo();
      if (!user?.email) {
     	console.warn('No user email found – admin data cannot be loaded.');
     	setLoading(false);
     	return;
      }
      const res = await fetch(`${BASE_URL}/api/rides`, {
        headers: { 'x-user-email': user.email },
      });
      const data = await res.json();
      setRides(Array.isArray(data.rides) ? data.rides : []);
      setLoading(false);
    };
    fetchRides();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading rides...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        All Ride Requests
      </Text>
      {rides.length === 0 ? (
        <Text>No rides yet.</Text>
      ) : (
        rides.map((ride, index) => (
          <View key={index} style={{ paddingVertical: 10 }}>
            <Text>{ride.origin} ➜ {ride.destination} ({ride.status})</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
