"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps {
    children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: "🏠" },
        { href: "/dashboard/materi", label: "List Materi", icon: "📚" },
        { href: "/dashboard/materi/create", label: "Buat Materi", icon: "✏️" },
        { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    ];

    const isActive = (href: string) => pathname === href;

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="min-h-screen bg-[#f1c995] flex">
            {/* Mobile menu button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#c3bafa] border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
                <span className="text-xl">☰</span>
            </button>

            {/* Sidebar */}
            <div
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#c3bafa] border-r-4 border-black shadow-[8px_0px_0px_0px_rgba(0,0,0,1)] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:h-screen lg:sticky lg:top-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b-2 border-black flex-shrink-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-black">
                            Dashboard
                        </h1>
                        {session && (
                            <p className="text-sm text-gray-700 mt-1">
                                Welcome, {session.user?.username || "User"}!
                            </p>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-md border-2 border-black font-bold transition-all duration-200 ${isActive(item.href)
                                            ? "bg-yellow-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]"
                                            : "bg-white hover:bg-yellow-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                            }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-black">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t-2 border-black flex-shrink-0">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-400 hover:bg-red-500 text-black font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 lg:ml-0 min-h-screen overflow-y-auto">
                <main className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
