import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { clearUserInfo, getUserInfo } from '../../utils/secureStore';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const info = await getUserInfo();
      setUser(info);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await clearUserInfo();
    setUser(null);
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Welcome, {user?.name ?? 'Guest'} 👋
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        Role: {user?.role ?? 'N/A'}
      </Text>

      {user?.role === 'admin' && (
        <Button title="Admin Dashboard" onPress={() => router.push('/admin-dashboard')} />
      )}

      {user?.role !== 'driver' && (
        <>
          <Button title="Book Ride" onPress={() => router.push('/ride-booking')} />
          <Button title="Ride History" onPress={() => router.push('/ride-history')} />
        </>
      )}

      {user?.role === 'driver' && (
        <Button title="My Rides" onPress={() => router.push('/driver-dashboard')} />
      )}

      <Button title="Logout" color="red" onPress={handleLogout} />
    </View>
  );
}
