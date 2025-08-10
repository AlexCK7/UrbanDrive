import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, Keyboard, SafeAreaView,
  StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import { getBaseUrl } from "../utils/tunnel";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // stored but not required for login flow
  const [role, setRole] = useState<"user" | "driver">("user");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email) {
      Alert.alert("Missing Fields", "Please fill in name and email.");
      return;
    }
    setLoading(true);
    try {
      const base = await getBaseUrl();
      const res = await fetch(`${base}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const text = await res.text();
      if (!res.ok) {
        console.warn("Signup failed:", res.status, text);
        throw new Error(`HTTP ${res.status} – ${text}`);
      }

      Alert.alert("Success", "Account created successfully! Please log in.");
      router.push("/login");
    } catch (err: any) {
      Alert.alert("Signup Error", String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={s.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>Sign Up</Text>

        <TextInput style={s.input} placeholder="Name" placeholderTextColor="#777" onChangeText={setName} value={name} />
        <TextInput style={s.input} placeholder="Email" placeholderTextColor="#777" onChangeText={setEmail} value={email} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={s.input} placeholder="Password (optional)" placeholderTextColor="#777" onChangeText={setPassword} value={password} secureTextEntry />

        <View style={s.roleRow}>
          <Text style={s.roleLabel}>Account Type:</Text>
          <TouchableOpacity style={[s.roleBtn, role === "user" && s.roleBtnActive]} onPress={() => setRole("user")}>
            <Text style={role === "user" ? s.roleTextActive : s.roleText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.roleBtn, role === "driver" && s.roleBtnActive]} onPress={() => setRole("driver")}>
            <Text style={role === "driver" ? s.roleTextActive : s.roleText}>Driver</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Create account</Text>}
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  back: { fontSize: 16, marginBottom: 20, color: "#007AFF" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 15, borderRadius: 6, fontSize: 16, color: "#000" },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  roleRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  roleLabel: { marginRight: 10, fontSize: 16, color: "#333" },
  roleBtn: { paddingVertical: 6, paddingHorizontal: 14, borderWidth: 1, borderColor: "#007AFF", borderRadius: 20, marginHorizontal: 4 },
  roleBtnActive: { backgroundColor: "#007AFF" },
  roleText: { color: "#007AFF" },
  roleTextActive: { color: "#fff" },
});
