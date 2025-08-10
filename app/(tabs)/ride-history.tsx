// app/(tabs)/ride-history.tsx
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import { getUserInfo } from "../../utils/secureStore";
import { getBaseUrl } from "../../utils/tunnel";

export default function RideHistoryScreen() {
  const [rides, setRides] = useState<any[]>([]);
  const [shareEmails, setShareEmails] = useState<{ [id: number]: string }>({});

  const fetchHistory = async () => {
    const user = await getUserInfo();
    if (!user?.email) return;
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/rides/user`, {
      headers: { "x-user-email": user.email },
    });
    const txt = await res.text();
    if (!res.ok) {
      Alert.alert("Error", `HTTP ${res.status}: ${txt}`);
      return;
    }
    const data = JSON.parse(txt);
    setRides(Array.isArray(data.rides) ? data.rides : []);
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleShare = async (rideId: number) => {
    const friendEmail = shareEmails[rideId];
    if (!friendEmail) return Alert.alert("Friend email required");
    const user = await getUserInfo();
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/rides/${rideId}/share`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-email": user?.email || "" },
      body: JSON.stringify({ friendEmail }),
    });
    const txt = await res.text();
    if (!res.ok) return Alert.alert("Error", `HTTP ${res.status}: ${txt}`);
    Alert.alert("Ride shared");
    fetchHistory();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Your Ride History</Text>
      {rides.length === 0 ? (
        <Text>No rides found.</Text>
      ) : (
        rides.map((ride) => (
          <View key={ride.id} style={{ marginBottom: 15 }}>
            <Text>{ride.origin} ➜ {ride.destination} ({ride.status})</Text>
            {ride.status === "pending" && (
              <>
                <TextInput
                  style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 4, marginVertical: 8 }}
                  placeholder="Enter friend's email to share"
                  value={shareEmails[ride.id] || ""}
                  onChangeText={(t) => setShareEmails((p) => ({ ...p, [ride.id]: t }))}
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
