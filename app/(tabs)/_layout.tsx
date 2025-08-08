// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../utils/secureStore';

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getUserInfo().then(user => setRole(user?.role || null));
  }, []);

  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      {role !== 'driver' && (
        <>
          <Tabs.Screen name="ride-booking" options={{ title: 'Book Ride' }} />
          <Tabs.Screen name="ride-history" options={{ title: 'Ride History' }} />
        </>
      )}
      {role === 'admin' && <Tabs.Screen name="admin-dashboard" options={{ title: 'Admin' }} />}
      {role === 'driver' && <Tabs.Screen name="driver-dashboard" options={{ title: 'Driver' }} />}
    </Tabs>
  );
}
