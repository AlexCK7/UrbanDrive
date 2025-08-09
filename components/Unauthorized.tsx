// components/Unauthorized.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Unauthorized({ compact }: { compact?: boolean }) {
  return (
    <View style={compact ? styles.compact : styles.container}>
      <Text style={styles.title}>Access denied</Text>
      <Text style={styles.subtitle}>You are not authorized to view this page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 6,
  },
  compact: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#d32f2f",
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
  },
});
