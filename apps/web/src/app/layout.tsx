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

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:43173";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vết · Quan sát mọi bước đi của Agent",
    template: "%s · Vết",
  },
  description:
    "Từ tin nhắn Zalo đến câu trả lời, bạn nhìn thấy agent đi từng bước. Tự vận hành trên infra của bạn (MIT).",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Vết · Quan sát mọi bước đi của Agent",
    description:
      "Từ tin nhắn Zalo đến câu trả lời, bạn nhìn thấy agent đi từng bước. Tự vận hành trên infra của bạn (MIT).",
    locale: "vi_VN",
    type: "website",
  },
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
