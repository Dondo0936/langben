import type { ObservationType, TraceStatus } from "./types";

/** Console Kênh renders on the server (Docker TZ is UTC). Pin Vietnam local. */
export const DISPLAY_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function formatTime(iso: string, lang: "vi" | "en" = "vi") {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    hourCycle: "h23",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(d);
}

export function formatDuration(ms: number, lang: "vi" | "en" = "vi") {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(2)} s`;
  return `${(ms / 60_000).toFixed(1)} ${lang === "en" ? "min" : "phút"}`;
}

export function latencyOf(start: string, end: string | null) {
  if (!end) return null;
  return new Date(end).getTime() - new Date(start).getTime();
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 4 }).format(n);
}

export function formatVnd(usd: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(usd * 25000);
}

export function statusLabel(status: TraceStatus, lang: "vi" | "en") {
  if (lang === "en") return status;
  if (status === "ok") return "ổn";
  if (status === "error") return "lỗi";
  return "chưa rõ";
}

export function typeLabel(type: ObservationType, lang: "vi" | "en") {
  const vi: Record<ObservationType, string> = {
    generation: "Lần sinh",
    span: "Span",
    tool: "Công cụ",
    "channel.inbound": "Kênh vào",
    "channel.outbound": "Kênh ra",
    nlu: "NLU",
    "speech.asr": "ASR",
    "speech.tts": "TTS",
  };
  return lang === "vi" ? vi[type] : type;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function previewJson(value: unknown, max = 140) {
  if (value == null) return "—";
  if (typeof value === "string") return value.length > max ? `${value.slice(0, max)}…` : value;
  try {
    const s = JSON.stringify(value);
    return s.length > max ? `${s.slice(0, max)}…` : s;
  } catch {
    return String(value);
  }
}
