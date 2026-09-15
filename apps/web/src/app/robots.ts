import type { MetadataRoute } from "next";
import { isPlatformSurface } from "@/lib/platform-surface";

/** Previews already send `x-robots-tag: noindex`. Keep this allow-all so a promoted production build is indexable. */
export default function robots(): MetadataRoute.Robots {
  if (isPlatformSurface()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" } };
}
