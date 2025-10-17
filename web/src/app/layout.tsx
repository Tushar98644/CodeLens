import type { Metadata } from "next";

import "./globals.css";
import { AppProvider } from "@/providers/app-provider";

export const metadata: Metadata = {
  title: "Code Lens",
  description: "AI powered reviews for your code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
          <AppProvider>
            {children}
          </AppProvider>
      </body>
    </html>
  );
}
