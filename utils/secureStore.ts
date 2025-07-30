import * as SecureStore from 'expo-secure-store';

export const saveUserInfo = async (user: { name: string; email: string; id: number }) => {
  await SecureStore.setItemAsync('user', JSON.stringify(user));
};

export const getUserInfo = async () => {
  const result = await SecureStore.getItemAsync('user');
  return result ? JSON.parse(result) : null;
};

export async function clearUserInfo() {
  await SecureStore.deleteItemAsync('user');
}