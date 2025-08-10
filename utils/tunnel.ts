// utils/tunnel.ts
import Constants from "expo-constants";
import { Platform } from "react-native";

let memo: string | undefined;

export async function getBaseUrl(): Promise<string> {
  if (memo) return memo;

  // 1) From env (written to UrbanDrive/.env.local by backend script)
  const fromEnv = ((globalThis as any)?.process?.env?.EXPO_PUBLIC_BASE_URL as string) || undefined;

  // 2) From app.config extra
  const extra = ((Constants as any)?.expoConfig?.extra ?? {}) as Record<string, any>;
  const fromExtra: string | undefined = extra.EXPO_PUBLIC_BASE_URL || extra.BASE_URL;

  const raw = fromEnv || fromExtra;
  if (typeof raw === "string" && raw.length > 0) {
    memo = raw.replace(/\/$/, "");
    console.log("[UrbanDrive] BASE =", memo);
    return memo;
  }

  // 3) Fallbacks (emulators/simulators only)
  memo = Platform.select({
    android: "http://10.0.2.2:3001",
    ios: "http://localhost:3001",
    default: "http://localhost:3001",
  })!;
  console.warn("[UrbanDrive] No EXPO_PUBLIC_BASE_URL set; using emulator default:", memo);
  return memo;
}
