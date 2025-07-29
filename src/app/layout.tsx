import "./globals.css";
import { ReactNode } from "react";
import { Roboto_Mono } from "next/font/google";
import { Metadata } from "next";
import { ClientProviders } from "@/components/utils/ClientProviders";

export const metadata: Metadata = {
    title: "Community Learn",
    description: "Platform Belajar Bersama Komunitas",
};

const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={`${robotoMono.className} antialiased`}>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
