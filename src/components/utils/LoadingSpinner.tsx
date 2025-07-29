"use client";

export default function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-[#f1c995] flex items-center justify-center">
            <div className="bg-[#c3bafa] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-md p-8">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
                    <span className="text-xl font-bold text-black">Loading...</span>
                </div>
            </div>
        </div>
    );
}
