import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../utils/secureStore';

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);

  // Load the current user’s role at mount
  useEffect(() => {
    getUserInfo().then(user => setRole(user?.role));
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      {/* Everyone sees Home */}
      <Tabs.Screen name="home" options={{ title: 'Home' }} />

      {/* Users and admins see booking & history */}
      {role !== 'driver' && (
        <>
          <Tabs.Screen name="ride-booking" options={{ title: 'Book Ride' }} />
          <Tabs.Screen name="ride-history" options={{ title: 'Ride History' }} />
        </>
      )}

      {/* Admins only */}
      {role === 'admin' && (
        <Tabs.Screen name="admin-dashboard" options={{ title: 'Admin' }} />
      )}

      {/* Drivers only */}
      {role === 'driver' && (
        <Tabs.Screen name="driver-dashboard" options={{ title: 'Driver' }} />
      )}
    </Tabs>
  );
}
