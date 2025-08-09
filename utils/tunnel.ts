// utils/tunnel.ts
import Constants from "expo-constants";
import { Platform } from "react-native";

let memo: string | undefined;

export async function getBaseUrl(): Promise<string> {
  if (memo) return memo;

  // 1) Try Expo extra
  const extra = ((Constants as any).expoConfig?.extra ?? {}) as Record<string, any>;
  const fromEnv: string | undefined = extra.EXPO_PUBLIC_BASE_URL ?? extra.BASE_URL;

  if (fromEnv?.length) {
    memo = fromEnv;
    return fromEnv; // <- return the concrete string
  }

  // 2) Try backend /health (optional)
  try {
    const fallbackHealth = "https://d62be48f0379.ngrok-free.app/health";
    const resp = await fetch(fallbackHealth);
    const data = await resp.json();
    if (typeof data?.baseUrl === "string" && data.baseUrl.length > 0) {
      memo = data.baseUrl;
      return data.baseUrl; // <- return the concrete string
    }
  } catch {
    // ignore
  }

  // 3) Last resort (emulator/device defaults)
  const fallback =
    Platform.select({
      ios: "http://localhost:3001",
      android: "http://10.0.2.2:3001",
      default: "http://localhost:3001",
    }) ?? "http://localhost:3001";

  memo = fallback;
  return fallback; // <- return the concrete string
}
