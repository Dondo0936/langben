import { Button } from "@/src/components/ui/button";
import { LibraryBig, LifeBuoy } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Separator } from "@/src/components/ui/separator";
import { useUiCustomization } from "@/src/ee/features/ui-customization/useUiCustomization";

export function IntroSection(_props: { onStartForm: () => void }) {
  const uiCustomization = useUiCustomization();

  return (
    <div className="mt-1 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-base font-bold">
          <LibraryBig className="h-4 w-4" /> Tài liệu
        </div>
        <p className="text-muted-foreground text-sm">
          Console này là Langfuse OSS. Đọc hướng dẫn, khái niệm và API để tự
          vận hành Vết.
        </p>

        <Button asChild variant="outline">
          <a
            href={
              uiCustomization?.documentationHref ?? "https://langfuse.com/docs"
            }
            target="_blank"
            rel="noopener"
          >
            Xem tài liệu
          </a>
        </Button>
      </div>

      <Separator />

      {uiCustomization?.supportHref ? (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-base font-bold">
              <LifeBuoy className="h-4 w-4" /> Hỗ trợ
            </div>
            <p className="text-muted-foreground text-sm">
              Tài liệu chưa đủ thì mở kênh hỗ trợ của bản cài này.
            </p>
            <Button variant="outline" asChild>
              <a
                href={uiCustomization.supportHref}
                target="_blank"
                rel="noopener"
              >
                Mở hỗ trợ
              </a>
            </Button>
            {uiCustomization.feedbackHref ? (
              <Button variant="outline" asChild>
                <a
                  href={uiCustomization.feedbackHref}
                  target="_blank"
                  rel="noopener"
                >
                  Gửi góp ý
                </a>
              </Button>
            ) : null}
          </div>
          <Separator />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-base font-bold">
              <LifeBuoy className="h-4 w-4" /> Hỗ trợ cộng đồng
            </div>
            <p className="text-muted-foreground text-sm">
              Vết tự vận hành không có Ask AI hay Community Hours của Langfuse
              Cloud. Hỏi trên GitHub của Langfuse OSS.
            </p>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/langfuse/langfuse/issues"
                target="_blank"
                rel="noopener"
              >
                <SiGithub className="mr-2 h-4 w-4" /> GitHub Langfuse OSS
              </a>
            </Button>
          </div>
          <Separator />
        </>
      )}
    </div>
  );
}
