// app/(tabs)/home.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { clearUserInfo, getUserInfo } from "../../utils/secureStore";
import { getBaseUrl } from "../../utils/tunnel";

type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: "user" | "driver" | "admin";
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [base, setBase] = useState<string>("");

  useEffect(() => {
    (async () => {
      const u = await getUserInfo();
      setUser(u ?? null);
      const b = await getBaseUrl();
      setBase(b);
    })();
  }, []);

  const go = (path: string) => router.push(path);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>UrbanDrive</Text>
      <Text style={styles.subtitle}>Connected to: {base || "…"}</Text>

      <View style={styles.card}>
        <Text style={styles.hello}>
          {user?.name ? `Welcome, ${user.name}!` : "Welcome!"}
        </Text>
        <Text style={styles.meta}>
          {user?.email ?? "guest@local"} • {user?.role ?? "guest"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.row}>
          <Button title="Book Ride" onPress={() => go("/ride-booking")} />
          <View style={styles.spacer} />
          <Button title="Ride History" onPress={() => go("/ride-history")} />
        </View>

        {user?.role === "driver" && (
          <View style={styles.row}>
            <Button title="Driver Dashboard" onPress={() => go("/driver-dashboard")} />
          </View>
        )}

        {user?.role === "admin" && (
          <View style={styles.row}>
            <Button title="Admin Dashboard" onPress={() => go("/admin-dashboard")} />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session</Text>
        <Button
          color="red"
          title="Logout"
          onPress={async () => {
            await clearUserInfo();
            Alert.alert("Logged out");
            router.replace("/login");
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#666",
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f7f7f9",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
  hello: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    color: "#444",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  spacer: { width: 8 },
});
