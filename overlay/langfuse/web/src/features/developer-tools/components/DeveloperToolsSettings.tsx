import Header from "@/src/components/layouts/header";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";

const REPO = "https://github.com/Dondo0936/langben";

export function DeveloperToolsSettings({ projectId }: { projectId: string }) {
  return (
    <div>
      <Header title="MCP và CLI" />
      <p className="text-muted-foreground mb-6 text-sm">
        Khóa pk/sk ở Khóa API. Base URL ingest là Tên host của console này. Không
        dùng MCP/CLI Cloud Langfuse.
      </p>
      <Card className="p-4">
        <p className="text-primary mb-4 text-sm">
          SDK và ingest trỏ <code>http://localhost:3000</code> (hoặc host bạn
          deploy). Chi tiết nằm trên GitHub.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary">
            <Link href={`/project/${projectId}/settings/api-keys`}>
              Mở khóa API
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={REPO} target="_blank" rel="noopener">
              GitHub ↗
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
