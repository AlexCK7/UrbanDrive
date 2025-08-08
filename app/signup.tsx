// app/signup.tsx (outside of tabs)
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Keyboard,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, TouchableWithoutFeedback,
  View
} from 'react-native';
import { BASE_URL } from '../utils/constants';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'driver'>('user');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
      }
      Alert.alert('Success', 'Account created successfully!');
      router.push('/login');
    } catch (err:any) {
      Alert.alert('Error', err.message || 'Signup failed. Try again later.');
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
        <Text style={styles.title}>Sign Up</Text>

        <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#777" onChangeText={setName} value={name} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#777" onChangeText={setEmail} value={email} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#777" onChangeText={setPassword} value={password} secureTextEntry />

        {/* Role selector */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Account Type:</Text>
          <TouchableOpacity style={[styles.roleButton, role === 'user' && styles.roleButtonActive]} onPress={() => setRole('user')}>
            <Text style={role === 'user' ? styles.roleButtonTextActive : styles.roleButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleButton, role === 'driver' && styles.roleButtonActive]} onPress={() => setRole('driver')}>
            <Text style={role === 'driver' ? styles.roleButtonTextActive : styles.roleButtonText}>Driver</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
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
  roleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  roleLabel: { marginRight: 10, fontSize: 16, color: '#333' },
  roleButton: { paddingVertical: 6, paddingHorizontal: 14, borderWidth: 1, borderColor: '#007AFF', borderRadius: 20, marginHorizontal: 4 },
  roleButtonActive: { backgroundColor: '#007AFF' },
  roleButtonText: { color: '#007AFF' },
  roleButtonTextActive: { color: '#fff' },
});
