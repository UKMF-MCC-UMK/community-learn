import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import { ClientProviders } from "@/components/utils/ClientProviders";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
    title: "Community Learn",
    description: "Platform Belajar Bersama Komunitas",
};

export default async function RootLayout({ children }: { children: ReactNode }) {

    const session = await getServerSession()

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={` antialiased`}>
                <ClientProviders session={session}>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
