import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tự vận hành" };

const composeSnippet = `git submodule update --init --recursive
cp .env.console.example .env
bash scripts/up.sh`;

const envSnippet = `NEXTAUTH_URL=http://localhost:3000
VET_PUBLIC_URL=http://localhost:43173
LANGFUSE_INIT_USER_EMAIL=demo@vet.dev
LANGFUSE_INIT_USER_PASSWORD=demodemo
LANGFUSE_INIT_PROJECT_PUBLIC_KEY=pk-lf-vet-demo
LANGFUSE_INIT_PROJECT_SECRET_KEY=sk-lf-vet-demo`;

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
            ? "Chạy overlay Vết trên Langfuse OSS. Dữ liệu ở infra của bạn. Một lệnh là docker compose: marketing :43173 và console :3000 trên máy bạn."
            : "Run the Vết overlay on Langfuse OSS. Data stays on your infra. One command is docker compose: marketing :43173 and the console :3000 on your machine."}
        </p>

        <h2 className="mt-10 text-xl font-semibold">{vi ? "Một lệnh" : "One command"}</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "scripts/up.sh gắn overlay, build vet-console:local, rồi docker compose up. Lần đầu mất vài phút vì compile overlay console."
            : "scripts/up.sh applies the overlay, builds vet-console:local, then runs docker compose up. The first run takes a few minutes while the console overlay compiles."}
        </p>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">{composeSnippet}</pre>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "Marketing http://localhost:43173. Console http://localhost:3000. Tài khoản local: demo@vet.dev / demodemo. Khóa ingest Langfuse: pk-lf-vet-demo / sk-lf-vet-demo."
            : "Marketing http://localhost:43173. Console http://localhost:3000. Local login: demo@vet.dev / demodemo. Langfuse ingest keys: pk-lf-vet-demo / sk-lf-vet-demo."}
        </p>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "Compose giới hạn log json-file 20MB mỗi service. ClickHouse in nhiều stdout. Không giới hạn thì đĩa đầy."
            : "Compose caps json-file logs at 20MB per service. ClickHouse prints a lot of stdout. Without a cap the disk fills up."}
        </p>

        <h2 className="mt-10 text-xl font-semibold">{vi ? "Biến môi trường" : "Environment"}</h2>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-sm">{envSnippet}</pre>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "File đầy đủ là .env.console.example. Copy thành .env rồi sửa. Compose đã đặt VET_DEPLOYMENT=self-host cho marketing. Đặt tunnel vào .env, đừng export VET_PUBLIC_URL trong shell. Tunnel chết thì fixture và webhook OA/Bot gãy. Gửi thử trên Kênh gọi loopback :43173, không đi ra tunnel. Zalo Bot: dán Secret Token (không phải Bot Token) và URL https:// đầy đủ."
            : "The full file is .env.console.example. Copy it to .env and edit. Compose already sets VET_DEPLOYMENT=self-host on marketing. Put a tunnel in .env. Do not export VET_PUBLIC_URL in the shell. A dead tunnel breaks fixtures and live OA/Bot webhooks. Gửi thử on Channels posts to loopback :43173 and does not use the tunnel. Zalo Bot: paste Secret Token (not Bot Token) and a full https:// webhook URL."}
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
