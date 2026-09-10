import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mã nguồn mở" };

export default async function OpenSourcePage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">{vi ? "Mã nguồn mở trước, Cloud sau" : "Open source first, Cloud optional"}</h1>
        <p className="mt-4 text-muted">
          {vi
            ? "Cùng một repo MIT chạy ba cách: tự host OSS, tự host Enterprise, hoặc Vết Cloud. Đổi hướng bằng biến môi trường hoặc endpoint — không fork product."
            : "One MIT repo, three ways to run: OSS self-host, Enterprise self-host, or Vết Cloud. Switch with env / endpoints — not a product fork."}
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="px-3 py-2" />
                <th className="px-3 py-2">{vi ? "Tự host OSS" : "OSS self-host"}</th>
                <th className="px-3 py-2">{vi ? "Tự host Enterprise" : "Enterprise self-host"}</th>
                <th className="px-3 py-2">Vết Cloud</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                [vi ? "Tính năng sản phẩm" : "Product features", "✓", "✓", "✓"],
                [vi ? "Add-on doanh nghiệp" : "Enterprise add-ons", "—", "✓", "✓"],
                [vi ? "Dịch vụ managed" : "Fully managed", "—", "—", "✓"],
                [vi ? "Ai host" : "Who hosts", vi ? "Bạn" : "You", vi ? "Bạn" : "You", vi ? "Chúng tôi" : "We do"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-line">
                  {row.map((c) => (
                    <td key={c} className="px-3 py-2">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-sm text-muted">
          {vi
            ? "LICENSE là MIT. NOTICE ghi rõ UI console lấy cảm hứng IA từ Langfuse MIT — không copy wordmark, logo, hay mã ee/."
            : "LICENSE is MIT. NOTICE states the console IA is inspired by Langfuse MIT — no wordmark, logo, or ee/ code."}
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/self-host" className="rounded-full bg-ink px-4 py-2 text-sm text-highlight">
            docker compose up
          </Link>
          <Link href="/pricing" className="rounded-full border border-line px-4 py-2 text-sm">
            {vi ? "Giá Cloud" : "Cloud pricing"}
          </Link>
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
