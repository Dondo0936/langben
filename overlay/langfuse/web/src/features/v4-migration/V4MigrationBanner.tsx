/* eslint-disable @repo/no-null-render */
/** Langfuse Cloud v4 banner. Hidden on Vết (pinned v4.33.0). */

export function useV4MigrationBannerState(_enabled: boolean) {
  return { projectsNeedingMigration: 0, totalProjects: 0 };
}

export function V4MigrationBanner(_props: {
  projectsNeedingMigration: number;
  totalProjects: number;
}) {
  return null;
}
