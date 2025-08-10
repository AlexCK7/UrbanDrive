import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, Keyboard, SafeAreaView,
  StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import { saveUserInfo } from "../utils/secureStore";
import { getBaseUrl } from "../utils/tunnel";

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const canGoBack = navigation?.canGoBack?.() ?? false;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // currently unused by backend login
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const base = await getBaseUrl();

      // Backend login is email-only (creates user if missing)
      const res = await fetch(`${base}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      if (!res.ok) {
        console.warn("Login failed:", res.status, text);
        throw new Error(`HTTP ${res.status} – ${text}`);
      }
      let data: any;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      await saveUserInfo(data.user);
      Alert.alert("Welcome", `Logged in as ${data.user?.name ?? email}`);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert("Login Error", String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={s.container}>
        {canGoBack && (
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.back}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={s.title}>Login</Text>
        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor="#777"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {/* Password field kept for future parity; ignored by backend */}
        <TextInput
          style={s.input}
          placeholder="Password (optional)"
          placeholderTextColor="#777"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={s.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Login</Text>}
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={{ textAlign: "center", color: "#007AFF" }}>No account? Sign up</Text>
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
});
