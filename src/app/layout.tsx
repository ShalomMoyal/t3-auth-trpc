import "@/styles/globals.css";

import { type Metadata } from "next";
import { headers } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
