"use client";

import { useState } from 'react';
import { DriveItem, createEmbedUrl } from '@/lib/driveUtils';
import FolderTreeViewer from './FolderTreeViewer';
import { Button } from './ui/button';

interface EcourseViewerProps {
    materi: {
        id: string;
        title: string;
        description: string;
        contentUrl: string;
        contentType: string;
    };
    folderTree: DriveItem[];
    onClose: () => void;
}

export default function EcourseViewer({ materi, folderTree, onClose }: EcourseViewerProps) {
    const [selectedFile, setSelectedFile] = useState<DriveItem | null>(null);

    const handleFileSelect = (file: DriveItem) => {
        if (!file.isFolder) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b-2 border-black bg-[#c3bafa] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-2xl font-bold text-black">{materi.title}</h1>
                <Button
                    onClick={onClose}
                    className="px-4 py-2 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-red-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                >
                    X Tutup
                </Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar with Folder Tree */}
                <aside className="w-1/4 min-w-[300px] h-full overflow-y-auto p-4 border-r-2 border-black bg-gray-50">
                    <h2 className="text-lg font-bold mb-4">Daftar Isi</h2>
                    <FolderTreeViewer
                        items={folderTree}
                        onFileSelect={handleFileSelect}
                        selectedFileId={selectedFile?.id}
                    />
                </aside>

                {/* Main Content Viewer */}
                <main className="flex-1 h-full p-4 overflow-y-auto">
                    {selectedFile ? (
                        <iframe
                            src={createEmbedUrl(selectedFile.id)}
                            className="w-full h-full border-2 border-black rounded-md"
                            title={selectedFile.name}
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                            <p className="text-lg">Pilih file dari daftar isi untuk ditampilkan.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
