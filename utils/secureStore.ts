import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'user-info';

export const saveUserInfo = async (user: object) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUserInfo = async () => {
  const result = await SecureStore.getItemAsync(USER_KEY);
  return result ? JSON.parse(result) : null;
};

export const clearUserInfo = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
};
