import { useMemo } from "react";
import { useLangfuseCloudRegion } from "@/src/features/organizations/hooks";
import { env } from "@/src/env.mjs";
import type { NavigationItem } from "@/src/components/layouts/utilities/routes";

export function useLayoutMetadata(
  activePathName: string | undefined,
  _navigation: NavigationItem[],
) {
  const { region } = useLangfuseCloudRegion();

  return useMemo(() => {
    const basePath = env.NEXT_PUBLIC_BASE_PATH ?? "";
    const title = activePathName ? `${activePathName} | Vết` : "Vết";
    const faviconPath =
      region === "DEV" ? `${basePath}/icon-dev.svg` : `${basePath}/icon.svg`;

    return {
      title,
      faviconPath,
      favicon256Path: `${basePath}/icon256.png`,
      appleTouchIconPath: `${basePath}/apple-touch-icon.png`,
    };
  }, [activePathName, region]);
}
