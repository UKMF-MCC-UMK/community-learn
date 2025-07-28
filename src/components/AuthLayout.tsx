import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-8 bg-[#f1c995] px-4">
                <div className="w-full max-w-md bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
