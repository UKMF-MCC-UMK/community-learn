"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import FolderTreeViewer from "./FolderTreeViewer";
import {
    extractGoogleDriveFolderId,
    createEmbedUrl,
    formatFileSize,
    formatDate,
    DriveItem,
    FolderStructure
} from "@/lib/driveUtils";

interface GoogleDriveFolderViewerProps {
    folderUrl: string;
    title: string;
}

export default function GoogleDriveFolderViewer({ folderUrl, title }: GoogleDriveFolderViewerProps) {
    const [folderStructure, setFolderStructure] = useState<FolderStructure | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<DriveItem | null>(null);
    const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

    useEffect(() => {
        const loadFolderContents = async () => {
            try {
                const folderId = extractGoogleDriveFolderId(folderUrl);
                if (!folderId) {
                    setError("URL Google Drive folder tidak valid");
                    return;
                }

                // Menggunakan API endpoint untuk mengambil struktur folder
                const response = await fetch(`/api/drive/folder?folderId=${folderId}`);
                const result = await response.json();

                if (response.ok && result.success) {
                    setFolderStructure(result.data.structure);
                } else {
                    setError(result.error || "Gagal memuat konten folder");
                }
            } catch (err) {
                setError("Gagal memuat konten folder");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadFolderContents();
    }, [folderUrl]);

    if (isLoading) {
        return (
            <div className="bg-[#c3bafa] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md p-6">
                <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
                    <span className="font-medium text-black">Memuat struktur folder...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-2 border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] rounded-md p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">❌</span>
                    <h3 className="font-bold text-red-800">Error</h3>
                </div>
                <p className="text-red-700">{error}</p>
                <Button
                    onClick={() => window.open(folderUrl, '_blank')}
                    className="mt-4 px-4 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                >
                    📁 Buka Folder Langsung
                </Button>
            </div>
        );
    }

    if (!folderStructure) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-[#c3bafa] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-black mb-1">📁 {title}</h3>
                        <p className="text-sm text-gray-600">
                            {folderStructure.pdfFiles.length} file PDF | {folderStructure.folderTree.length} folder
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setViewMode(viewMode === 'tree' ? 'list' : 'tree')}
                            className="px-3 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                        >
                            {viewMode === 'tree' ? '📋 List View' : '🌳 Tree View'}
                        </Button>
                        <Button
                            onClick={() => window.open(folderUrl, '_blank')}
                            className="px-3 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                        >
                            📂 Buka Folder
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left: Folder Tree */}
                <div className="lg:col-span-1">
                    <FolderTreeViewer
                        items={folderStructure.folderTree}
                        onFileSelect={setSelectedFile}
                        selectedFileId={selectedFile?.id}
                    />
                </div>

                {/* Right: Content View */}
                <div className="lg:col-span-2">
                    {selectedFile ? (
                        <div className="bg-white border-2 border-black rounded-md overflow-hidden">
                            {/* File Header */}
                            <div className="bg-[#c3bafa] border-b-2 border-black p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-black">{selectedFile.name}</h4>
                                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                            {selectedFile.size && <span>📏 {formatFileSize(selectedFile.size)}</span>}
                                            {selectedFile.modifiedTime && <span>📅 {formatDate(selectedFile.modifiedTime)}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => window.open(selectedFile.webViewLink, '_blank')}
                                            className="px-3 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-blue-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                                        >
                                            � Buka
                                        </Button>
                                        <Button
                                            onClick={() => setSelectedFile(null)}
                                            className="px-3 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-red-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                                        >
                                            ❌
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* PDF Preview */}
                            {selectedFile.mimeType === "application/pdf" && (
                                <div className="h-96 p-4">
                                    <iframe
                                        src={createEmbedUrl(selectedFile.id)}
                                        className="w-full h-full border border-gray-300 rounded"
                                        title={selectedFile.name}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        // Default view - PDF list
                        <div className="bg-white border-2 border-black rounded-md">
                            <div className="bg-[#c3bafa] border-b-2 border-black p-4">
                                <h4 className="font-bold text-black">📄 Semua File PDF</h4>
                            </div>
                            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                                {folderStructure.pdfFiles.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Tidak ada file PDF ditemukan
                                    </div>
                                ) : (
                                    folderStructure.pdfFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-200"
                                            onClick={() => setSelectedFile(file)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">📄</span>
                                                <div>
                                                    <div className="font-medium text-black text-sm">{file.name}</div>
                                                    <div className="flex gap-3 text-xs text-gray-600">
                                                        {file.size && <span>📏 {formatFileSize(file.size)}</span>}
                                                        {file.modifiedTime && <span>📅 {formatDate(file.modifiedTime)}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFile(file);
                                                    }}
                                                    className="px-2 py-1 text-xs font-bold rounded border border-black bg-green-200 text-black hover:bg-green-300"
                                                >
                                                    👁️
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(file.webViewLink, '_blank');
                                                    }}
                                                    className="px-2 py-1 text-xs font-bold rounded border border-black bg-blue-200 text-black hover:bg-blue-300"
                                                >
                                                    📥
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
