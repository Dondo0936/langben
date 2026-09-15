import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteFx } from "@/components/brand/SiteFx";
import { getLang } from "@/lib/get-lang";
import { isPlatformSurface } from "@/lib/platform-surface";

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

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const vi = lang !== "en";
  const platform = isPlatformSurface();
  if (platform) {
    return {
      title: "Vết",
      description: vi
        ? "Kênh, Lộ trình và webhook. Console trên cổng 3000."
        : "Channels, routes, and webhooks. Console on port 3000.",
      robots: { index: false, follow: false },
      icons: { icon: "/logo.svg" },
    };
  }
  const title = vi ? "Vết · Quan sát mọi bước đi của Agent" : "Vết · Watch every step the agent takes";
  const description = vi
    ? "Từ tin nhắn Zalo đến câu trả lời, bạn nhìn thấy agent đi từng bước. Tự vận hành trên infra của bạn (MIT)."
    : "From the Zalo message to the reply, you see each step the agent takes. Self-host on your infra (MIT).";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s · Vết" },
    description,
    icons: { icon: "/logo.svg" },
    openGraph: {
      title,
      description,
      locale: vi ? "vi_VN" : "en_US",
      type: "website",
    },
  };
}

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
