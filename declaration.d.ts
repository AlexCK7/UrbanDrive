// declaration.d.ts
declare module "*.svg" {
  import * as React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "@react-native-picker/picker";

declare global {
  type UserRole = "user" | "driver" | "admin";
}
