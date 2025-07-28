"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function TestFolderAPI() {
    const [folderUrl, setFolderUrl] = useState("");
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testAPI = async () => {
        if (!folderUrl) {
            setError("Masukkan URL folder Google Drive");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Extract folder ID from URL
            const folderId = extractGoogleDriveFolderId(folderUrl);
            console.log("Extracted folder ID:", folderId);

            if (!folderId) {
                setError("URL tidak valid. Gunakan format: https://drive.google.com/drive/folders/FOLDER_ID");
                return;
            }

            // Test API endpoint
            const response = await fetch(`/api/drive/folder?folderId=${folderId}`);
            const data = await response.json();

            console.log("API Response:", data);
            setResult(data);

            if (!response.ok) {
                setError(data.error || "API request failed");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to extract folder ID
    const extractGoogleDriveFolderId = (url: string): string | null => {
        const patterns = [
            /\/drive\/folders\/([a-zA-Z0-9-_]+)/,
            /\/drive\/u\/\d+\/folders\/([a-zA-Z0-9-_]+)/,
            /id=([a-zA-Z0-9-_]+)/,
            /^([a-zA-Z0-9-_]+)$/ // Direct ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    };

    return (
        <div className="space-y-6 p-6">
            <div className="bg-[#c3bafa] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md p-6">
                <h2 className="text-2xl font-bold text-black mb-4">
                    🔧 Test Google Drive API
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">
                            URL Google Drive Folder:
                        </label>
                        <input
                            type="text"
                            value={folderUrl}
                            onChange={(e) => setFolderUrl(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
                            className="w-full py-2 px-3 border-2 border-black rounded-md"
                        />
                    </div>

                    <Button
                        onClick={testAPI}
                        disabled={isLoading}
                        className="px-6 py-3 text-lg font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? "Testing..." : "🧪 Test API"}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-2 border-red-500 rounded-md p-4">
                    <h3 className="font-bold text-red-800">❌ Error:</h3>
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {result && (
                <div className="bg-white border-2 border-black rounded-md p-6">
                    <h3 className="font-bold text-black mb-4">📋 API Response:</h3>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div className="bg-yellow-100 border-2 border-yellow-500 rounded-md p-4">
                <h3 className="font-bold text-yellow-800 mb-2">💡 Tips:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Pastikan folder Google Drive bisa diakses publik</li>
                    <li>• Atau pastikan service account punya akses ke folder</li>
                    <li>• Cek apakah .env sudah diisi dengan benar</li>
                </ul>
            </div>
        </div>
    );
}
