import Link from "next/link";
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
              ? "Docker Compose trên infra của bạn. Đặt VET_DEPLOYMENT=self-host."
              : "Docker Compose on your infra. Set VET_DEPLOYMENT=self-host."}
        </p>
        <h2 className="mt-10 text-xl font-semibold">Docker Compose</h2>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">
{`git clone --recurse-submodules https://origin.cursor.com/git/tiendat0936/langben.git
cd langben
cp .env.console.example .env
bash scripts/up.sh`}
        </pre>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "Marketing http://localhost:43173 · Console http://localhost:3000 — demo@vet.dev / demodemo."
            : "Marketing http://localhost:43173 · Console http://localhost:3000 — demo@vet.dev / demodemo."}
        </p>
        <h2 className="mt-10 text-xl font-semibold">{vi ? "Biến môi trường" : "Environment"}</h2>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">
{`VET_DEPLOYMENT=self-host
VET_DATA_DIR=/data
VET_PUBLIC_URL=https://vet.internal
VET_SESSION_SECRET=...`}
        </pre>
        <p className="mt-6 text-sm">
          <Link href="/docs/units" className="text-ink underline-offset-4 hover:underline">
            {vi ? "Bộ công cụ đơn vị — đơn vị không phải token" : "Units toolkit — a unit is not a token"}
          </Link>
        </p>
        <h2 className="mt-10 text-xl font-semibold">{vi ? "Dev laptop (không Docker)" : "Laptop (no Docker)"}</h2>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">
{`npm install
npm run dev`}
        </pre>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
