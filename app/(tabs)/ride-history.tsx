// app/(tabs)/ride-history.tsx
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../../utils/constants';
import { getUserInfo } from '../../utils/secureStore';

export default function RideHistoryScreen() {
  const [rides, setRides] = useState<any[]>([]);
  const [shareEmails, setShareEmails] = useState<{ [rideId: number]: string }>({});

  const fetchHistory = async () => {
    const user = await getUserInfo();
    if (!user?.email) return;
    const res = await fetch(`${BASE_URL}/api/rides/user`, { headers: { 'x-user-email': user.email } });
    const data = await res.json();
    setRides(Array.isArray(data.rides) ? data.rides : []);
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleShare = async (rideId: number) => {
    const friendEmail = shareEmails[rideId];
    if (!friendEmail) {
      Alert.alert('Friend email required');
      return;
    }
    const user = await getUserInfo();
    const res = await fetch(`${BASE_URL}/api/rides/${rideId}/share`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': user?.email || '',
      },
      body: JSON.stringify({ friendEmail }),
    });
    const data = await res.json();
    if (res.ok) {
      Alert.alert('Ride shared successfully');
      fetchHistory();
    } else {
      Alert.alert('Error', data.error || 'Failed to share ride');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Your Ride History</Text>
      {rides.length === 0 ? (
        <Text>No rides found.</Text>
      ) : (
        rides.map((ride) => (
          <View key={ride.id} style={{ marginBottom: 15 }}>
            <Text>{ride.origin} ➜ {ride.destination} ({ride.status})</Text>
            {ride.status === 'pending' && (
              <>
                <TextInput
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4, marginVertical: 8 }}
                  placeholder="Enter friend's email to share"
                  value={shareEmails[ride.id] || ''}
                  onChangeText={(text) => setShareEmails((prev) => ({ ...prev, [ride.id]: text }))}
                />
                <Button title="Share Ride" onPress={() => handleShare(ride.id)} />
              </>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
