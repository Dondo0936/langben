/** Public URL of the Langfuse OSS console (port 3000 locally). */
export function consoleOrigin() {
  return (
    process.env.NEXT_PUBLIC_VET_CONSOLE_URL ||
    process.env.VET_CONSOLE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function consoleProjectId() {
  return process.env.VET_CONSOLE_PROJECT_ID ?? "prj-vet-demo";
}

export function consoleSignInUrl() {
  return `${consoleOrigin()}/auth/sign-in`;
}

export function consoleProjectUrl(suffix = "") {
  const path = suffix.startsWith("/") ? suffix : suffix ? `/${suffix}` : "";
  return `${consoleOrigin()}/project/${consoleProjectId()}${path}`;
}
