"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/utils/themeProvider";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export function ClientProviders({ children, session }: { children: ReactNode, session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}