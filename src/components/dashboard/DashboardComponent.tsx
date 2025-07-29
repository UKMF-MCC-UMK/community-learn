"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";
import Sidebar from "@/components/layout/Sidebar";

interface Materi {
    id: string;
    title: string;
    description: string;
    contentUrl: string;
    contentType: string;
    metadata?: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
}

export default function DashboardComponent() {
    const { data: session } = useSession();
    const router = useRouter();
    const [materiList, setMateriList] = useState<Materi[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch materi from database
    useEffect(() => {
        const fetchMateri = async () => {
            try {
                const response = await fetch('/api/materi');
                const result = await response.json();

                if (response.ok && result.success) {
                    setMateriList(result.data);
                } else {
                    console.error('Error fetching materi:', result.error);
                }
            } catch (error) {
                console.error('Error fetching materi:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMateri();
    }, []);

    return (
        <Sidebar>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                        Welcome to Your Dashboard! 👋
                    </h1>
                    <p className="text-sm sm:text-base text-gray-700">
                        Hello {session?.user?.username || "User"}, here&apos;s what&apos;s happening with your account today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <DashboardCard
                        title="Total Materi"
                        value={isLoading ? "..." : materiList.length.toString()}
                        icon="📚"
                        description="Materi tersedia"
                        onClick={() => router.push("/dashboard/materi")}
                    />

                    <DashboardCard
                        title="Materi Baru"
                        value={isLoading ? "..." : materiList.filter(m => {
                            const today = new Date();
                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                            return new Date(m.createdAt) > weekAgo;
                        }).length.toString()}
                        icon="✨"
                        description="Minggu ini"
                    />
                </div>
            </div>
        </Sidebar>
    );
}
