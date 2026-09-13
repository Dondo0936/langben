import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tự vận hành" };

const composeSnippet = `git submodule update --init --recursive
cp .env.console.example .env
bash scripts/up.sh`;

const envSnippet = `VET_DEPLOYMENT=self-host
VET_DATA_DIR=/data
VET_PUBLIC_URL=https://vet.internal
VET_SESSION_SECRET=...`;

export default async function SelfHostPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <p className="eyebrow">{vi ? "Docker Compose · MIT" : "Docker Compose · MIT"}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {vi ? "Tự vận hành Vết" : "Self-host Vết"}
        </h1>
        <p className="mt-4 text-muted">
          {vi
            ? "Chạy overlay Vết trên Langfuse OSS. Dữ liệu ở infra của bạn. Đặt VET_DEPLOYMENT=self-host."
            : "Run the Vết overlay on Langfuse OSS. Data stays on your infra. Set VET_DEPLOYMENT=self-host."}
        </p>

        <h2 className="mt-10 text-xl font-semibold">{vi ? "Một lệnh" : "One command"}</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "scripts/up.sh gắn overlay, build vet-console:local, rồi docker compose up."
            : "scripts/up.sh applies the overlay, builds vet-console:local, then runs docker compose up."}
        </p>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">{composeSnippet}</pre>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "Marketing http://localhost:43173. Console http://localhost:3000. Tài khoản local: demo@vet.dev / demodemo."
            : "Marketing http://localhost:43173. Console http://localhost:3000. Local login: demo@vet.dev / demodemo."}
        </p>

        <h2 className="mt-10 text-xl font-semibold">{vi ? "Biến môi trường" : "Environment"}</h2>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">{envSnippet}</pre>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "Production bắt buộc VET_SESSION_SECRET. Đừng để placeholder."
            : "Production requires VET_SESSION_SECRET. Do not leave the placeholder."}
        </p>

        <h2 className="mt-10 text-xl font-semibold">{vi ? "Dev laptop, không Docker" : "Laptop, no Docker"}</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "Chỉ chạy marketing và webhook. Console Langfuse cần Docker."
            : "This starts marketing and webhooks only. The Langfuse console needs Docker."}
        </p>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">{`npm install
npm run dev`}</pre>

        <p className="mt-8 text-sm">
          <Link href="/docs" className="text-ink underline-offset-4 hover:underline">
            {vi ? "Tài liệu" : "Docs"}
          </Link>
          {" · "}
          <Link href="/docs/units" className="text-ink underline-offset-4 hover:underline">
            {vi ? "Đơn vị là gì" : "What a unit is"}
          </Link>
        </p>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
