import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteFx } from "@/components/brand/SiteFx";
import { getLang } from "@/lib/get-lang";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Vết — Quan sát LLM cho bot Việt Nam",
    template: "%s · Vết",
  },
  description:
    "Nền tảng observability mã nguồn mở cho bot Zalo, FPT.AI, Viettel, Lark, Google Chat và .NET. Tự vận hành trên infra của bạn (MIT).",
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <div className="space-stars" aria-hidden />
        <SiteFx />
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
