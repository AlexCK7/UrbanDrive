# 🚗 UrbanDrive — Mobile Client (Expo)

UrbanDrive is the mobile client for the UrbanDrive rides platform. It supports **User**, **Driver**, and **Admin** roles with role-aware screens and actions.

---

## 🧰 Prerequisites
- Node 18+
- Expo CLI (via `npx expo`)
- iOS Simulator / Android Emulator / Expo Go app

---

## 🛠 Setup

```bash
npm install
```

Create a local env file to point the app at your API:

```ini
# .env.local (at project root)
EXPO_PUBLIC_BASE_URL=http://localhost:3001
```

> When using a tunnel (ngrok/localtunnel), set `EXPO_PUBLIC_BASE_URL` to the public URL, e.g. `https://<subdomain>.ngrok-free.app`.

---

## ▶️ Run

```bash
npx expo start --clear --tunnel
```
- Scan the QR with Expo Go (Android) or Camera (iOS).
- The app discovers `EXPO_PUBLIC_BASE_URL` via `Constants.expoConfig.extra` (no `process.env` shim needed).

---

## 🔐 Roles

- **User** – book rides, view history, share rides.
- **Driver** – view assigned rides, complete rides.
- **Admin** – view all rides, assign drivers.

Role is stored after login in SecureStore and used to conditionally show tabs and actions.

---

## 🗂 Structure (key files)

```
app/
  (tabs)/
    home.tsx            # Dashboard with role-aware quick actions
    ride-booking.tsx
    ride-history.tsx
    driver-dashboard.tsx
    admin-dashboard.tsx
components/
  RoleGate.tsx
  Unauthorized.tsx
utils/
  secureStore.ts
  tunnel.ts
  roles.ts
app.config.js
```

---

## 🧪 Smoke Tests (API)

Use the backend repository’s `scripts/smoke.sh` to validate the API locally or via ngrok, then run the app pointing to that base URL.

---

## 🧭 Configuration

`app.config.js` exposes the base URL to the app:

```js
export default {
  expo: {
    name: "UrbanDrive",
    slug: "urbandrive",
    version: "1.0.0",
    scheme: "urbandrive",
    extra: {
      EXPO_PUBLIC_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL ?? "http://localhost:3001",
    },
  },
};
```

---

## 📌 Notes
- Layout warnings from `expo-router` usually mean non-`<Screen />` children were placed under a tab layout. Keep each tab file as a screen component.
- Keep the tunnel URL current; if it changes, update `.env.local`.

---

## ✅ Status
This client is **stable** for the Milestone‑1 feature set and ready to demo.