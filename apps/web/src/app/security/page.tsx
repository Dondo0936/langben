import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bảo mật" };

export default async function SecurityPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">{vi ? "Bảo mật & PII" : "Security & PII"}</h1>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>
            {vi
              ? "Khóa ingest và OTLP so khớp SHA-256 (timing-safe). Khóa Anthropic của Playground chỉ ở server. Không có bí mật NEXT_PUBLIC_."
              : "Ingest/OTLP keys are SHA-256 compared timing-safe. The Playground Anthropic key stays server-side. No NEXT_PUBLIC_ secrets."}
          </li>
          <li>
            {vi
              ? "Bí mật webhook kênh được lưu để xác thực chữ ký; API console không trả secret. Payload lưu như nhận được. Chưa redact PII, chưa xóa audio Viettel. Hãy giảm PII phía bot trước khi gửi."
              : "Channel webhook secrets are stored for signature verification and are not returned by the console API. Payloads are stored as received; this build does not redact phone/email/address or drop Viettel audio. Minimize PII at the bot."}
          </li>
          <li>
            {vi
              ? "Zalo OA bắt MAC; hook không chữ ký hoặc sai chữ ký trả 401."
              : "Zalo OA MAC is enforced; unsigned or invalid hooks return 401."}
          </li>
          <li>
            {vi
              ? "Production bắt buộc VET_SESSION_SECRET. Đặt biến này. Đừng để placeholder."
              : "Production requires VET_SESSION_SECRET. Set it; do not leave the placeholder."}
          </li>
        </ul>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
