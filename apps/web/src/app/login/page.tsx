import { Suspense } from "react";
import { getLang } from "@/lib/get-lang";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const lang = await getLang();
  return (
    <Suspense>
      <LoginForm lang={lang} />
    </Suspense>
  );
}
