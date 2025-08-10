// app.config.js
import "dotenv/config";

export default () => ({
  expo: {
    name: "UrbanDrive",
    slug: "UrbanDrive",
    scheme: "urbandrive",
    extra: {
      // Expo reads .env / .env.local and we pass the value into the bundle here.
      // The backend start script writes .env.local with EXPO_PUBLIC_BASE_URL.
      EXPO_PUBLIC_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL ?? "",
    },
  },
});
