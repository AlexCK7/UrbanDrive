// utils/secureStore.ts
import * as SecureStore from "expo-secure-store";

const KEY = "ud.user";

export type StoredUser = {
  id?: number;
  name?: string;
  email: string;
  role?: "user" | "driver" | "admin";
};

export async function saveUserInfo(user: StoredUser) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(user));
}

export async function getUserInfo(): Promise<StoredUser | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  return raw ? (JSON.parse(raw) as StoredUser) : null;
}

export async function deleteUserInfo() {
  await SecureStore.deleteItemAsync(KEY);
}

// optional helper
export async function updateUserInfo(patch: Partial<StoredUser>) {
  const cur = (await getUserInfo()) ?? ({} as StoredUser);
  const next = { ...cur, ...patch };
  await saveUserInfo(next);
  return next;
}
