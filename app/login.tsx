import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Keyboard, SafeAreaView,
  StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { BASE_URL } from '../utils/constants';
import { saveUserInfo } from '../utils/secureStore';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }
      const data = await res.json();
      await saveUserInfo(data.user);  // only store the user object
      Alert.alert('Welcome', `Logged in as ${data.user.name}`);
      router.replace('/home');
    } catch (err) {
      console.error(err);
      Alert.alert('Login Error', 'Invalid credentials or network issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Login</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#777"
          onChangeText={setEmail} value={email} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#777"
          onChangeText={setPassword} value={password} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  back: { fontSize: 16, marginBottom: 20, color: '#007AFF' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 6, fontSize: 16, color: '#000' },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
});
