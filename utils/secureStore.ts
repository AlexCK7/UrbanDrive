// utils/secureStore.ts
import * as SecureStore from 'expo-secure-store';

export async function saveUserInfo(name: string, email: string) {
  await SecureStore.setItemAsync('userName', name);
  await SecureStore.setItemAsync('userEmail', email);
}

export async function getUserInfo() {
  const name = await SecureStore.getItemAsync('userName');
  const email = await SecureStore.getItemAsync('userEmail');
  return { name, email };
}

export async function clearUserInfo() {
  await SecureStore.deleteItemAsync('userName');
  await SecureStore.deleteItemAsync('userEmail');
}
