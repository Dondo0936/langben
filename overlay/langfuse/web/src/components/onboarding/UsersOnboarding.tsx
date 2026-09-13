import React from "react";
import { SplashScreen } from "@/src/components/ui/splash-screen";
import { ActionButton } from "@/src/components/ActionButton";

export function UsersOnboarding() {
  return (
    <SplashScreen
      title="Bạn chưa theo dõi người dùng"
      description="Khi gắn user ID vào vết, bạn đối chiếu được chi phí, đánh giá và các chỉ số LLM khác theo từng người."
    >
      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-bold">Bắt đầu theo dõi người dùng</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Thêm <code>userId</code> vào vết để bắt đầu.
        </p>
        <ActionButton
          href="https://langfuse.com/docs/observability/features/users"
          variant="default"
        >
          Đọc docs
        </ActionButton>
      </div>
    </SplashScreen>
  );
}
