"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/features/global/icons";

export function SignInForm() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleSignIn = async (provider: "google" | "github") => {
    setLoadingProvider(provider);

    console.log(`Initiating sign-in with ${provider}...`);
    setLoadingProvider(null);
  };

  const isGlobalLoading = loadingProvider !== null;

  return (
    <div className="flex w-full flex-col items-center gap-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight">
          Sign in to Kairo
        </h2>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Please sign in to continue.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button
          variant="outline"
          disabled={isGlobalLoading}
          onClick={() => handleSignIn("google")}
        >
          {loadingProvider === "google" ? (
            <Spinner />
          ) : (
            <>
              <Icons.google />
              <span className="ml-2">Continue with Google</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          disabled={isGlobalLoading}
          onClick={() => handleSignIn("github")}
        >
          {loadingProvider === "github" ? (
            <Spinner />
          ) : (
            <>
              <Icons.github />
              <span className="ml-2">Continue with Github</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}