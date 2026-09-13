import React from "react";
import { SplashScreen } from "@/src/components/ui/splash-screen";
import { ActionButton } from "@/src/components/ActionButton";

export function SessionsOnboarding() {
  return (
    <SplashScreen
      title="Bạn chưa dùng phiên"
      description="Phiên gom các vết thuộc cùng một workflow hoặc hội thoại."
    >
      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-bold">Bắt đầu dùng phiên</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Thêm <code>sessionId</code> vào vết để gom chúng thành một phiên.
        </p>
        <ActionButton
          href="https://langfuse.com/docs/observability/features/sessions"
          variant="default"
        >
          Đọc docs
        </ActionButton>
      </div>
    </SplashScreen>
  );
}
