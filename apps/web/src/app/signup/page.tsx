import { getLang } from "@/lib/get-lang";
import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const lang = await getLang();
  return <SignupForm lang={lang} />;
}
