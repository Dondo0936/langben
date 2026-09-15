import { Card } from "@/src/components/ui/card";
import { CodeView } from "@/src/components/ui/CodeJsonViewer";
import Header from "@/src/components/layouts/header";
import { useUiCustomization } from "@/src/ee/features/ui-customization/useUiCustomization";
import { env } from "@/src/env.mjs";

export function HostNameProject() {
  const uiCustomization = useUiCustomization();
  return (
    <div>
      <Header title="Tên host" />
      <Card className="mb-4 p-3">
        <div className="">
          <div className="mb-2 text-sm">
            Base URL khi ingest vết vào console này.
          </div>
          <CodeView
            content={`${uiCustomization?.hostname ?? window.origin}${env.NEXT_PUBLIC_BASE_PATH ?? ""}`}
          />
        </div>
      </Card>
    </div>
  );
}
