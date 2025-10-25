import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const LandingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    redirect('/dashboard')
  );
};

export default LandingPage;
