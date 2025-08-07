import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function RideHistoryScreen() {
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = await getUserInfo();
      if (!user?.email) {
        console.warn('No user email found – ride history cannot be loaded.');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/rides/user`, {
        headers: { 'x-user-email': user.email },
      });

      const data = await res.json();
      console.log('📦 Ride history:', data);
      setRides(Array.isArray(data.rides) ? data.rides : []);
    };

    fetchHistory();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Your Ride History
      </Text>
      {rides.length === 0 ? (
        <Text>No rides found.</Text>
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
