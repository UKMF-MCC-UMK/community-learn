"use client";

import { useState } from "react";
import GoogleDriveFolderViewer from "./GoogleDriveFolderViewer";
import { Button } from "./ui/button";

export default function GoogleDriveDemoComponent() {
    const [showDemo, setShowDemo] = useState(false);

    // Demo URL - folder yang sudah ditest dan working
    const demoFolderUrl = "https://drive.google.com/drive/folders/1EUtm5w23JtjO1qItyp9mgkr4T1X1IavI";

    return (
        <div className="space-y-6">
            {/* Demo Header */}
            <div className="bg-[#c3bafa] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md p-6">
                <h2 className="text-2xl font-bold text-black mb-3">
                    🚀 Demo: Google Drive Folder Integration
                </h2>
                <p className="text-gray-700 mb-4">
                    Fitur ini memungkinkan parsing otomatis file PDF dari Google Drive folder dan menampilkannya dalam layout yang rapi,
                    termasuk preview PDF langsung dalam aplikasi.
                </p>

                <div className="space-y-3 text-sm text-gray-600">
                    <h3 className="font-bold text-black">✨ Fitur yang tersedia:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li>📁 Auto-parsing file PDF dari Google Drive folder</li>
                        <li>📄 Preview PDF langsung dalam modal</li>
                        <li>📏 Menampilkan ukuran file dan tanggal modifikasi</li>
                        <li>🔗 Link langsung untuk buka/download file</li>
                        <li>📱 Layout responsive untuk mobile dan desktop</li>
                    </ul>
                </div>

                <Button
                    onClick={() => setShowDemo(!showDemo)}
                    className="mt-4 px-6 py-3 text-lg font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                >
                    {showDemo ? "🙈 Sembunyikan Demo" : "👁️ Lihat Demo"}
                </Button>
            </div>

            {/* Demo Viewer */}
            {showDemo && (
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md p-6">
                    <h3 className="text-xl font-bold text-black mb-4">
                        📂 Contoh Folder: "Dasar Git dengan Github"
                    </h3>

                    <GoogleDriveFolderViewer
                        folderUrl={demoFolderUrl}
                        title="Dasar Git dengan Github (8 Juli - 2 Agustus 2025)"
                    />
                </div>
            )}

            {/* Implementation Notes */}
            <div className="bg-yellow-100 border-2 border-yellow-500 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] rounded-md p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-3">
                    💡 Implementasi Selanjutnya
                </h3>
                <div className="text-sm text-yellow-700 space-y-2">
                    <p><strong>Untuk production:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Integrasi dengan Google Drive API untuk parsing real-time</li>
                        <li>Authentication Google untuk akses folder private</li>
                        <li>Caching metadata untuk performa lebih baik</li>
                        <li>Support multiple file types (docs, sheets, slides, video)</li>
                        <li>Search & filter dalam folder</li>
                    </ul>

                    <p className="mt-3"><strong>Saat ini:</strong> Menggunakan mock data untuk demo</p>
                </div>
            </div>
        </div>
    );
}
