// utils/tunnel.ts
import Constants from "expo-constants";
import { Platform } from "react-native";

let memo: string | undefined;

export async function getBaseUrl(): Promise<string> {
  if (memo) return memo;

  const extra = ((Constants as any).expoConfig?.extra ?? {}) as Record<string, any>;
  const fromExtra: string | undefined = extra.EXPO_PUBLIC_BASE_URL || extra.BASE_URL;

  if (typeof fromExtra === "string" && fromExtra.length > 0) {
    memo = fromExtra.replace(/\/$/, ""); // trim trailing slash
    console.log("[UrbanDrive] BASE =", memo);
    return memo;
  }

  // Last resort — emulator/simulator only; will not work on a physical phone
  memo = Platform.select({
    android: "http://10.0.2.2:3001",
    ios: "http://localhost:3001",
    default: "http://localhost:3001",
  })!;
  console.warn("[UrbanDrive] No EXPO_PUBLIC_BASE_URL set; using emulator default:", memo);
  return memo;
}
