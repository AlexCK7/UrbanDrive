# 🚗 UrbanDrive — Social Ride Sharing & Route Coordination

UrbanDrive is a mobile-first app that helps friends plan meetups, coordinate pickups, and view shared ride routes. Users are assigned roles (`rider`, `driver`, or `admin`) with role-specific dashboards.

---

## 📦 Backend Setup

```bash
cd urbandrive-server
npm install
./start-dev.sh
```

Backend runs on `http://localhost:3001`. Make sure your `.env` file is configured properly (see `.env.example`).

---

## 📱 Frontend Setup (Expo)

```bash
cd UrbanDrive
npm install
npx expo start --tunnel
```

You can test on your phone using Expo Go or on emulators.

---

## 👥 Roles and Access

| Role    | Access |
|---------|--------|
| User    | Book rides, see ride history |
| Driver  | See assigned rides |
| Admin   | View all rides, assign drivers, manage users |

---

## 💡 Features

- Secure login/signup (role-based)
- Header-based auth via `x-user-email`
- Persistent session using Expo SecureStore
- Mobile-friendly UI with native loading states and alerts
- Admin dashboard to view and assign rides
- Driver & User dashboards with real-time data
- Polished UI with route-based navigation (`expo-router`)
- Pull-to-refresh and error handling (where needed)

---

## 📁 Folder Structure

```bash
UrbanDrive/
├── app/
│   ├── login.tsx
│   ├── signup.tsx
│   ├── home.tsx
│   ├── ride-booking.tsx
│   ├── ride-history.tsx
│   ├── driver-dashboard.tsx
│   ├── admin-dashboard.tsx
│   └── index.tsx
├── utils/
│   ├── constants.ts
│   └── secureStore.ts
```

---

## ✅ Next Steps

- [ ] Finalize admin-dashboard
- [ ] Polish feedback & UI
- [ ] Add final README polish
- [ ] Resume + Portfolio integration

---

## 👤 Built with ❤️ by Taiga