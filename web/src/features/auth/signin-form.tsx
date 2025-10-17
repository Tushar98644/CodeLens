"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/features/global/icons";

export function SignInForm() {
  return (
    <SignIn.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
          <SignIn.Step name="start">
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
                <Clerk.Connection name="google" asChild>
                  <Button variant="outline" disabled={isGlobalLoading}>
                    <Clerk.Loading scope="provider:google">
                      {(isLoading) =>
                        isLoading ? (
                          <Spinner />
                        ) : (
                          <>
                            <Icons.google />
                            <span className="ml-2">Continue with Google</span>
                          </>
                        )
                      }
                    </Clerk.Loading>
                  </Button>
                </Clerk.Connection>

                <Clerk.Connection name="github" asChild>
                  <Button variant="outline" disabled={isGlobalLoading}>
                    <Clerk.Loading scope="provider:github">
                      {(isLoading) =>
                        isLoading ? (
                          <Spinner />
                        ) : (
                          <>
                            <Icons.github />
                            <span className="ml-2">Continue with Github</span>
                          </>
                        )
                      }
                    </Clerk.Loading>
                  </Button>
                </Clerk.Connection>
              </div>
            </div>
          </SignIn.Step>
        )}
      </Clerk.Loading>
    </SignIn.Root>
  );
}