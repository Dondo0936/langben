import type { ChannelType, RouteDef } from "./types";

const INBOUND: Array<[string, ChannelType]> = [
  ["lark", "lark"],
  ["googlechat", "gchat"],
  ["gchat", "gchat"],
  ["msteams", "msteams"],
  ["zalo", "zalo_oa"],
];

/** First inbound channel on the seeded pipeline. */
export function channelTypeForRoute(route: RouteDef): ChannelType | null {
  for (const step of route.steps) {
    const s = step.toLowerCase();
    for (const [needle, type] of INBOUND) {
      if (s.includes(needle)) return type;
    }
  }
  const blob = `${route.id} ${route.name}`.toLowerCase();
  if (blob.includes("viettel")) return "viettel";
  if (blob.includes("fpt")) return "fpt";
  return null;
}
