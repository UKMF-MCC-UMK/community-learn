"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { extractGoogleDriveFolderId } from "@/lib/driveUtils";

export default function TestGoogleDrive() {
    const [folderUrl, setFolderUrl] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testGoogleDriveAPI = async () => {
        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const folderId = extractGoogleDriveFolderId(folderUrl);
            if (!folderId) {
                setError("Invalid Google Drive folder URL");
                return;
            }

            console.log("Extracted folder ID:", folderId);

            // Test dengan API endpoint
            const response = await fetch(`/api/drive/folder?folderId=${folderId}`);
            const data = await response.json();

            console.log("API Response:", data);

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || "Unknown error");
            }
        } catch (err: any) {
            console.error("Test error:", err);
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Test Google Drive API</h1>

            <div className="bg-white border-2 border-black rounded-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Test Folder Access</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Google Drive Folder URL:
                        </label>
                        <input
                            type="url"
                            value={folderUrl}
                            onChange={(e) => setFolderUrl(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/..."
                            className="w-full p-3 border-2 border-black rounded"
                        />
                    </div>

                    <Button
                        onClick={testGoogleDriveAPI}
                        disabled={loading || !folderUrl}
                        className="px-6 py-2 bg-blue-500 text-white rounded border-2 border-black"
                    >
                        {loading ? "Testing..." : "Test API"}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-2 border-red-500 rounded-md p-4 mb-6">
                    <h3 className="font-bold text-red-700">Error:</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {result && (
                <div className="bg-green-100 border-2 border-green-500 rounded-md p-4">
                    <h3 className="font-bold text-green-700 mb-2">Result:</h3>
                    <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
