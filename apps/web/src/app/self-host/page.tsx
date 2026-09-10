import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tự vận hành" };

export default async function SelfHostPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">
          {vi ? "Tự vận hành Vết" : "Self-host Vết"}
        </h1>
        <p className="mt-4 text-muted">
          {vi
            ? "Cùng image với Cloud. Đặt VET_DEPLOYMENT=self-host — ẩn billing, không giới hạn đơn vị."
            : "Same image as Cloud. Set VET_DEPLOYMENT=self-host — billing UI hides, units unlimited."}
        </p>
        <h2 className="mt-10 text-xl font-semibold">Docker Compose</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-sm text-highlight">
{`git clone https://github.com/vet-dev/vet.git
cd vet
docker compose up --build`}
        </pre>
        <p className="mt-3 text-sm text-muted">http://localhost:43173 — {vi ? "console tiếng Việt, dữ liệu seed sẵn." : "Vietnamese console, seeded traces."}</p>
        <h2 className="mt-10 text-xl font-semibold">{vi ? "Biến môi trường" : "Environment"}</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-sm text-highlight">
{`VET_DEPLOYMENT=self-host
VET_DATA_DIR=/data
VET_PUBLIC_URL=https://vet.internal
VET_SESSION_SECRET=...`}
        </pre>
        <h2 className="mt-10 text-xl font-semibold">{vi ? "Dev laptop (không Docker)" : "Laptop (no Docker)"}</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-sm text-highlight">
{`npm install
npm run dev`}
        </pre>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
