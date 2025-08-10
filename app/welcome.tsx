import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.container}>
      <Text style={s.logo}>UrbanDrive</Text>
      <Text style={s.tag}>Plan meetups. Share routes. Ride together.</Text>

      <View style={{ height: 24 }} />

      <TouchableOpacity style={s.primary} onPress={() => router.push("/login")}>
        <Text style={s.primaryText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.secondary} onPress={() => router.push("/signup")}>
        <Text style={s.secondaryText}>Create account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  logo: { fontSize: 36, fontWeight: "800", textAlign: "center" },
  tag: { textAlign: "center", marginTop: 8, color: "#666" },
  primary: { backgroundColor: "#007AFF", padding: 14, borderRadius: 10, alignItems: "center" },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondary: { padding: 14, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#007AFF", marginTop: 10 },
  secondaryText: { color: "#007AFF", fontWeight: "700", fontSize: 16 },
});
