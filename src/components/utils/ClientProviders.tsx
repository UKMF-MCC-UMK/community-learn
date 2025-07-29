"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/utils/themeProvider";
import { SessionProvider } from "next-auth/react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}