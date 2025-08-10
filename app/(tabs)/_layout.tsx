// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import type { UserRole } from "../../utils/roles";
import { getUserInfo } from "../../utils/secureStore";

export default function TabsLayout() {
  const [role, setRole] = useState<UserRole | undefined>();

  useEffect(() => {
    let mounted = true;
    getUserInfo()
      .then((u) => mounted && setRole(u?.role as UserRole | undefined))
      .catch(() => mounted && setRole(undefined));
    return () => {
      mounted = false;
    };
  }, []);

  const isAdmin = role === "admin";
  const isDriver = role === "driver";

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ride-booking"
        options={{
          title: "Book",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ride-history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      {/* Driver tab is hidden unless user is driver or admin */}
      <Tabs.Screen
        name="driver-dashboard"
        options={{
          title: "Driver",
          href: isDriver || isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />
      {/* Admin tab is hidden unless user is admin */}
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: "Admin",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
