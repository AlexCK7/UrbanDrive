// app/(tabs)/home.tsx  (replace the contents temporarily)
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getBaseUrl } from "../../utils/tunnel";

export default function Home() {
  const [msg, setMsg] = useState("Checking…");
  const [base, setBase] = useState<string>("");

  useEffect(() => {
    (async () => {
      const b = await getBaseUrl();
      setBase(b);
      try {
        const r = await fetch(`${b}/health`);
        const j = await r.json();
        setMsg(`OK: ${JSON.stringify(j)}`);
      } catch (e: any) {
        setMsg(`ERROR: ${String(e?.message || e)}`);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>Base: {base || "(resolving…)"}</Text>
      {msg.startsWith("Checking") ? <ActivityIndicator /> : <Text>{msg}</Text>}
    </View>
  );
}
