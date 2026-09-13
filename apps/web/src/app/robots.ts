import type { MetadataRoute } from "next";

/** Previews already send `x-robots-tag: noindex`. Keep this allow-all so a promoted production build is indexable. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
