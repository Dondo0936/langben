import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function DiemDocsRedirect() {
  redirect("/docs/scores");
}
