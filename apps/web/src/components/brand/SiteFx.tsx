"use client";

import { usePathname } from "next/navigation";
import { SpaceField } from "./SpaceField";

export function SiteFx() {
  const pathname = usePathname();
  if (pathname.startsWith("/app")) return null;
  return (
    <>
      <SpaceField />
      <div className="site-grain" />
    </>
  );
}
