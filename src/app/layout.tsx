"use client";
import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/themeProvider";
import { SessionProvider } from "next-auth/react";

// export const metadata: Metadata = {
//     title: "Community Learn",
//     description: "Learn with Community",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
                    rel="stylesheet"
                ></link>
                <link
                    href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                ></link>
            </head>
            <body>
                <SessionProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <>{children}</>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
