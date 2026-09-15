import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Scores" };

export default async function ScoresDocsPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <p className="eyebrow">{vi ? "Tài liệu · Scores" : "Docs · Scores"}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Scores</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {vi
            ? "Nhãn chất lượng gắn vào một lượt agent (ví dụ helpful 0/1)."
            : "A quality label on one agent turn (example: helpful 0/1)."}
        </p>
        <p className="mt-3 text-sm">
          <Link href="/docs" className="text-ink underline-offset-4 hover:underline">
            {vi ? "← Tài liệu" : "← Docs"}
          </Link>
        </p>

        <section className="mt-10 space-y-3 text-sm text-muted">
          <h2 className="text-lg font-semibold text-ink">
            {vi ? "Bảng trống" : "Empty table"}
          </h2>
          <p>
            {vi
              ? "Gửi thử trên Kênh chỉ ghi phiên. Score xuất hiện sau khi bạn gắn nhãn vào một lượt, hoặc ingest ghi score cùng traceId."
              : "Try-send (Gửi thử) on Channels writes a session. A score appears after you label a turn, or ingest writes one on the same traceId."}
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm text-muted">
          <h2 className="text-lg font-semibold text-ink">{vi ? "Gắn score" : "Attach"}</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              {vi
                ? "Console → Phiên → mở lượt → thêm score."
                : "Console → Sessions → open a turn → add a score."}
            </li>
            <li>
              {vi
                ? "Cài đặt dự án → Cấu hình score để đặt tên (helpful, đúng/sai, …). Bộ đánh giá agent ghi score nếu bạn bật."
                : "Project settings → Score configs for names. Agent evals write scores if enabled."}
            </li>
          </ol>
        </section>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
