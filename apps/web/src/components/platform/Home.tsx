import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { consoleOrigin, consoleProjectUrl, consoleSignInUrl } from "@/lib/console-target";
import { getLang } from "@/lib/get-lang";

export async function PlatformHome() {
  const lang = await getLang();
  const vi = lang === "vi";
  const consoleUrl = consoleOrigin() || "http://localhost:3000";
  return (
    <main className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-xl flex-col justify-center px-4 py-16">
      <Wordmark />
      <p className="eyebrow mt-8">{vi ? "Tự vận hành · MIT" : "Self-host · MIT"}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {vi ? "Kênh, lộ trình, webhook" : "Channels, routes, webhooks"}
      </h1>
      <p className="mt-4 text-muted">
        {vi
          ? "Console ở cổng 3000. Webhook Zalo, Lark và Google Chat lấy từ trang Kênh."
          : "The console is on port 3000. Copy Zalo, Lark, and Google Chat webhooks from Channels."}
      </p>
      <div className="mt-8 flex flex-col gap-3 text-sm">
        <Link href={consoleSignInUrl()} className="btn-solid w-fit">
          {vi ? "Mở console" : "Open console"}
        </Link>
        <a href={consoleUrl} className="font-mono text-muted">
          {consoleUrl}
        </a>
        <Link href="/app/channels" className="text-ink underline-offset-4 hover:underline">
          {vi ? "Kênh trên máy này" : "Channels on this host"}
        </Link>
        <Link href={consoleProjectUrl("/channels")} className="text-ink underline-offset-4 hover:underline">
          {vi ? "Kênh trong console" : "Channels in the console"}
        </Link>
        <Link href={consoleProjectUrl("/lo-trinh")} className="text-ink underline-offset-4 hover:underline">
          {vi ? "Lộ trình" : "Routes"}
        </Link>
      </div>
    </main>
  );
}
