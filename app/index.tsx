// app/index.tsx (root auth gate)
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getUserInfo } from "../utils/secureStore";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getUserInfo();
        if (!mounted) return;
        setIsAuthed(!!u?.email);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return isAuthed ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />;
}
