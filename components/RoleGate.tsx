// components/RoleGate.tsx
import React from "react";
import { View } from "react-native";
import type { UserRole } from "../utils/roles";
import Unauthorized from "./Unauthorized";

type Props = {
  role: UserRole | undefined;
  allow: UserRole[];
  children: React.ReactNode;
  compact?: boolean;
};

export default function RoleGate({ role, allow, children, compact }: Props) {
  if (!role || !allow.includes(role)) {
    return <Unauthorized compact={compact} />;
  }
  return <View style={{ flex: 1 }}>{children}</View>;
}
