function hostedOnVercel() {
  return Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV);
}

/** Public URL of the Langfuse OSS console (port 3000 locally). */
export function consoleOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_VET_CONSOLE_URL || process.env.VET_CONSOLE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (hostedOnVercel()) return "";
  return "http://localhost:3000";
}

/** Homepage tour when this deployment does not host a console. */
export function marketingDemoHref() {
  const origin = consoleOrigin();
  if (!origin) return "/#san-pham";
  return `${origin}/traces`;
}

export function consoleProjectId() {
  return process.env.VET_CONSOLE_PROJECT_ID ?? "prj-vet-demo";
}

export function consoleSignInUrl() {
  const origin = consoleOrigin();
  if (!origin) return "/self-host";
  return `${origin}/auth/sign-in`;
}

export function consoleProjectUrl(suffix = "") {
  const origin = consoleOrigin();
  const path = suffix.startsWith("/") ? suffix : suffix ? `/${suffix}` : "";
  if (!origin) return "/self-host";
  return `${origin}/project/${consoleProjectId()}${path}`;
}
