import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { clearUserInfo, getUserInfo } from '../../utils/secureStore';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userInfo = await getUserInfo();
      setUser(userInfo);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await clearUserInfo();
    setUser(null);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        {user ? `Welcome, ${user.name} 👋` : 'Welcome, Guest 👋'}
      </Text>
      {user ? (
        <Text style={{ marginBottom: 20 }}>Role: {user.role}</Text>
      ) : (
        <Text style={{ marginBottom: 20 }}>Please log in or sign up.</Text>
      )}
      {user && (
        <View style={styles.buttonGroup}>
          {user.role !== 'driver' && (
            <>
              <Button title="Book Ride" onPress={() => router.push('/ride-booking')} />
              <Button title="Ride History" onPress={() => router.push('/ride-history')} />
            </>
          )}
          {user.role === 'admin' && (
            <Button title="Admin Dashboard" onPress={() => router.push('/admin-dashboard')} />
          )}
          {user.role === 'driver' && (
            <Button title="Driver Dashboard" onPress={() => router.push('/driver-dashboard')} />
          )}
          <Button title="Logout" color="red" onPress={handleLogout} />
        </View>
      )}
      {!user && (
        <>
          <Button title="Login" onPress={() => router.push('/login')} />
          <Button title="Sign Up" onPress={() => router.push('/signup')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  buttonGroup: { width: '100%', gap: 12 },
});
