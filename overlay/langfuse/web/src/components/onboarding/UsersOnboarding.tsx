import React from "react";
import { SplashScreen } from "@/src/components/ui/splash-screen";

export function UsersOnboarding() {
  return (
    <SplashScreen
      title="Chưa gắn người dùng"
      description="Webhook Zalo / Lark / Chat đã gắn userId vào phiên. Mở Phiên để xem."
    />
  );
}
