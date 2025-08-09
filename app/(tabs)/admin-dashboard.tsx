import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import RoleGate from "../../components/RoleGate";
import type { UserRole } from "../../utils/roles";
import { getUserInfo } from "../../utils/secureStore";
import { getBaseUrl } from "../../utils/tunnel";

type Ride = { id:number; origin:string; destination:string; status:string; requested_at:string; };
type Driver = { id:number; name:string; email:string; };

export default function AdminDashboard() {
  const [role, setRole] = useState<UserRole | undefined>();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignDriver, setAssignDriver] = useState<Record<number, string>>({});

  const load = useCallback(async () => {
    const user = await getUserInfo();
    setRole(user?.role as UserRole | undefined);
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }
    const base = await getBaseUrl();
    const [r1, r2] = await Promise.all([
      fetch(`${base}/api/rides`, { headers: { "x-user-email": user.email }}),
      fetch(`${base}/admin/drivers`, { headers: { "x-user-email": user.email }}),
    ]);
    const rd = await r1.json();
    const dd = await r2.json();
    setRides(Array.isArray(rd.rides) ? rd.rides : []);
    setDrivers(Array.isArray(dd) ? dd : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [load]);

  const handleAssign = async (rideId:number) => {
    const user = await getUserInfo();
    const base = await getBaseUrl();
    const driverEmail = assignDriver[rideId];
    if (!driverEmail) return Alert.alert("Pick a driver first");
    const res = await fetch(`${base}/api/rides/${rideId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-email": user?.email || "" },
      body: JSON.stringify({ driverEmail }),
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({}));
      return Alert.alert("Error", err?.error || "Failed to assign");
    }
    Alert.alert("Assigned", "Ride assigned successfully");
    load();
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <RoleGate role={role} allow={["admin"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={s.h1}>Admin Panel</Text>
        <Text style={s.sectionLabel}>Ride Requests</Text>
        {rides.length === 0 ? <Text>No rides yet.</Text> : rides.map(ride => (
          <View key={ride.id} style={s.card}>
            <Text style={s.cardTitle}>Ride #{ride.id}</Text>
            <Text>From: {ride.origin}</Text>
            <Text>To: {ride.destination}</Text>
            <Text>Status: {ride.status}</Text>
            <Text>Requested: {new Date(ride.requested_at).toLocaleString()}</Text>

            {ride.status === "pending" && (
              <View style={{ marginTop: 8 }}>
                <Picker
                  selectedValue={assignDriver[ride.id]}
                  onValueChange={(value: string, _index: number) =>
                  setAssignDriver(prev => ({ ...prev, [ride.id]: value }))
                  }
                  style={s.picker}
                >
                  <Picker.Item label="Select driver…" value="" />
                  {drivers.map(d => (
                  <Picker.Item key={d.id} label={d.name} value={d.email} />
                  ))}
                  </Picker>

                <Button title="Assign Driver" onPress={() => handleAssign(ride.id)} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </RoleGate>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: "700", marginBottom: 14 },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  card: { paddingBottom: 12, marginBottom: 16, borderBottomWidth: 0.5, borderColor: "#ddd" },
  cardTitle: { fontWeight: "700", marginBottom: 6 },
  picker: { height: 50, width: "100%", marginVertical: 10 },
});
