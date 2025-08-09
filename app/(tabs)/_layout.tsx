import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import type { UserRole } from "../../utils/roles";
import { getUserInfo } from "../../utils/secureStore";

export default function TabsLayout() {
  const [role, setRole] = useState<UserRole | undefined>();

  useEffect(() => {
    getUserInfo().then(u => setRole(u?.role as UserRole | undefined)).catch(() => setRole(undefined));
  }, []);

  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="index" options={{ title: "Feed" }} />
      <Tabs.Screen name="ride-booking" options={{ title: "Book" }} />
      <Tabs.Screen name="ride-history" options={{ title: "History" }} />
      {/* Admin tab visible to admins only */}
      <Tabs.Screen
        name="admin-dashboard"
        options={{ title: "Admin" }}
        redirect={role !== "admin"}
      />
      {/* Driver tab visible to drivers/admins */}
      <Tabs.Screen
        name="driver-dashboard"
        options={{ title: "Driver" }}
        redirect={!(role === "driver" || role === "admin")}
      />
    </Tabs>
  );
}
