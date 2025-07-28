"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Still loading

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
    }, [status, router]);

    if (status === "loading") {
        return <LoadingSpinner />;
    }

    if (status === "unauthenticated") {
        return <LoadingSpinner />;
    }

    return <>{children}</>;
}
