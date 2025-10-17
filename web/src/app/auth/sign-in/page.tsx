import { Suspense } from "react";
import Link from "next/link";
import { Icons } from "@/features/global/icons";
import { SignInForm } from "@/features/auth/signin-form";
import { Spinner } from "@/components/ui/spinner";

const SignInPage = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        {/* Header */}
        <div className="flex w-full items-center justify-center py-8">
          <Link href="/" className="flex items-center gap-x-2">
            <Icons.logo className="h-7 w-7" />
            <h1 className="text-xl font-medium tracking-tight">Code Lens</h1>
          </Link>
        </div>

        <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
          <SignInForm />
        </Suspense>

        {/* Footer */}
        <div className="mt-auto flex w-full flex-col items-center gap-6 pt-8">
          <p className="px-8 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex w-full items-center justify-center border-t border-border/80 py-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="font-medium text-primary hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;