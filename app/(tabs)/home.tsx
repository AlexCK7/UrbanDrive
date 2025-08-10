import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { deleteUserInfo, getUserInfo } from "../../utils/secureStore";
import { getBaseUrl } from "../../utils/tunnel";

export default function Home() {
  const router = useRouter();
  const [msg, setMsg] = useState<string>("Checking…");
  const [base, setBase] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    (async () => {
      const b = await getBaseUrl();
      setBase(b);
      const u = await getUserInfo();
      setName(u?.name || u?.email || "Guest");
      setRole(u?.role || "user");

      try {
        const r = await fetch(`${b}/health`);
        const j = await r.json();
        setMsg(`OK • ${j.status} • ${new Date(j.time).toLocaleTimeString()}`);
      } catch (e: any) {
        setMsg(`ERROR • ${String(e?.message || e)}`);
      }
    })();
  }, []);

  const logout = async () => {
    await deleteUserInfo();
    router.replace("/welcome");
  };

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.hi}>Hi, {name.split("@")[0]}</Text>
      <Text style={s.sub}>Role: {role}</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Backend</Text>
        <Text style={s.cardLine} numberOfLines={1}>Base: {base || "(resolving…)"}</Text>
        <View style={{ height: 6 }} />
        {msg.startsWith("Checking") ? <ActivityIndicator /> : <Text style={msg.startsWith("OK") ? s.ok : s.err}>{msg}</Text>}
      </View>

      <View style={s.grid}>
        <Tile label="Book a Ride" onPress={() => router.push("/(tabs)/ride-booking")} />
        <Tile label="Ride History" onPress={() => router.push("/(tabs)/ride-history")} />
        {(role === "driver" || role === "admin") && (
          <Tile label="Driver Dashboard" onPress={() => router.push("/(tabs)/driver-dashboard")} />
        )}
        {role === "admin" && (
          <Tile label="Admin Panel" onPress={() => router.push("/(tabs)/admin-dashboard")} />
        )}
      </View>

      <Pressable style={[s.tile, s.logout]} onPress={logout}>
        <Text style={[s.tileLabel, { color: "#fff" }]}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Tile({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={s.tile} onPress={onPress}>
      <Text style={s.tileLabel}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  hi: { fontSize: 28, fontWeight: "800" },
  sub: { color: "#666", marginTop: 2, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 14, backgroundColor: "#fafafa" },
  cardTitle: { fontWeight: "700", marginBottom: 6 },
  cardLine: { color: "#333" },
  ok: { color: "#1B873F", fontWeight: "600" },
  err: { color: "#D14343", fontWeight: "600" },

  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 16, gap: 12 },
  tile: { paddingVertical: 16, paddingHorizontal: 14, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, backgroundColor: "#fff" },
  tileLabel: { fontWeight: "700" },
  logout: { marginTop: "auto", backgroundColor: "#EF4444", borderColor: "#EF4444" },
});
