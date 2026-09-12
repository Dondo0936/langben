import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { consoleProjectUrl, consoleSignInUrl } from "@/lib/console-target";

export function ChannelShell({
  children,
  embed,
  title,
}: {
  children: React.ReactNode;
  embed: boolean;
  title: string;
}) {
  if (embed) {
    return <div className="console min-h-dvh bg-paper p-4 text-ink">{children}</div>;
  }
  return (
    <div className="console min-h-dvh bg-paper text-ink">
      <header className="flex h-12 items-center justify-between border-b border-line bg-black px-4">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="text-sm font-semibold">Vết</span>
          <span className="text-muted">/</span>
          <span className="text-sm">{title}</span>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href={consoleProjectUrl("/channels")} className="text-muted hover:text-ink">
            Console
          </Link>
          <Link href={consoleSignInUrl()} className="text-muted hover:text-ink">
            Đăng nhập
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4">{children}</main>
    </div>
  );
}
