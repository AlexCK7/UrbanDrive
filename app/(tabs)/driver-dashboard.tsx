import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, Text, View } from "react-native";
import RoleGate from "../../components/RoleGate";
import type { UserRole } from "../../utils/roles";
import { getUserInfo } from "../../utils/secureStore";
import { getBaseUrl } from "../../utils/tunnel";

type Ride = {
  id: number; origin: string; destination: string; status: string; requested_at: string;
};

export default function DriverDashboard() {
  const [role, setRole] = useState<UserRole | undefined>();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);

  const load = useCallback(async () => {
    const user = await getUserInfo();
    setRole(user?.role as UserRole | undefined);
    if (!(user?.role === "driver" || user?.role === "admin")) {
      setLoading(false);
      return;
    }
    try {
      const base = await getBaseUrl();
      const res = await fetch(`${base}/api/rides/driver`, {
        headers: { "x-user-email": user.email },
      });
      const data = await res.json();
      setRides(Array.isArray(data.rides) ? data.rides : []);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to load rides.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [load]);

  const markComplete = async (rideId: number) => {
    const user = await getUserInfo();
    try {
      const base = await getBaseUrl();
      const res = await fetch(`${base}/api/rides/${rideId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user?.email || "",
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        Alert.alert("Error", err?.error || "Failed to complete");
        return;
      }
      await load();
    } catch {
      Alert.alert("Error", "Network error");
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <RoleGate role={role} allow={["driver","admin"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>Driver Dashboard</Text>
        {rides.length === 0 ? (
          <Text>No assigned rides yet.</Text>
        ) : (
          rides.map(r => (
            <View key={r.id} style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 0.5 }}>
              <Text style={{ fontWeight: "600" }}>Ride #{r.id}</Text>
              <Text>From: {r.origin}</Text>
              <Text>To: {r.destination}</Text>
              <Text>Status: {r.status}</Text>
              <Text>Requested: {new Date(r.requested_at).toLocaleString()}</Text>
              {r.status !== "completed" && (
                <View style={{ marginTop: 10 }}>
                  <Button title="Mark as completed" onPress={() => markComplete(r.id)} />
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </RoleGate>
  );
}
