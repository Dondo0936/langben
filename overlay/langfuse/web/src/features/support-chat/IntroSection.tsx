import { Button } from "@/src/components/ui/button";
import { LifeBuoy } from "lucide-react";
import { SiGithub } from "react-icons/si";

const REPO = "https://github.com/Dondo0936/langben";
const ISSUES = `${REPO}/issues`;

export function IntroSection(_props?: { onStartForm?: () => void }) {
  return (
    <div className="mt-1 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-base font-bold">
          <LifeBuoy className="h-4 w-4" /> Hỗ trợ
        </div>
        <p className="text-muted-foreground text-sm">
          Vết tự vận hành. Mở issue hoặc đọc README trên GitHub.
        </p>
        <Button variant="outline" asChild>
          <a href={ISSUES} target="_blank" rel="noopener">
            <SiGithub className="mr-2 h-4 w-4" /> GitHub Issues
          </a>
        </Button>
        <Button variant="ghost" asChild>
          <a href={REPO} target="_blank" rel="noopener">
            <SiGithub className="mr-2 h-4 w-4" /> github.com/Dondo0936/langben
          </a>
        </Button>
      </div>
    </div>
  );
}
