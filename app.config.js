// app.config.js
export default {
  expo: {
    name: "UrbanDrive",
    slug: "urbandrive",
    version: "1.0.0",
    scheme: "urbandrive",
    extra: {
      // Primary (recommended)
      EXPO_PUBLIC_BASE_URL:
        process.env.EXPO_PUBLIC_BASE_URL ?? "http://localhost:3001",

      // Back-compat with your older code
      BASE_URL: process.env.EXPO_PUBLIC_BASE_URL ?? "http://localhost:3001",
    },
  },
};
