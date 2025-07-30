"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import EcourseViewer from "@/components/materi/EcourseViewer";
import { DriveItem } from "@/lib/driveUtils";

interface Materi {
    id: string;
    title: string;
    description: string;
    contentUrl: string;
    contentType: string;
    metadata?: string | {
        folderTree?: DriveItem[];
        structure?: DriveItem[];
        rootFolder?: {
            children?: DriveItem[];
            id?: string;
            name?: string;
            mimeType?: string;
            isFolder?: boolean;
            webViewLink?: string;
            modifiedTime?: string;
        };
    }; // Can be string or object
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
}

export default function MateriListComponent() {
    const { data: session } = useSession();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [materiList, setMateriList] = useState<Materi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
    const [isEcourseView, setIsEcourseView] = useState(false);

    // Function to fetch materi from database
    const fetchMateri = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/materi');
            const result = await response.json();

            if (response.ok && result.success) {
                // Parse metadata if it's a string
                const parsedData = result.data.map((item: Materi) => {
                    if (typeof item.metadata === 'string') {
                        try {
                            // Cek apakah string kosong atau null
                            if (!item.metadata || item.metadata.trim() === '') {
                                item.metadata = { folderTree: [] };
                                return item;
                            }

                            const parsedMetadata = JSON.parse(item.metadata);
                            // Cek semua kemungkinan struktur metadata
                            let folderTreeData = [];

                            if (parsedMetadata && parsedMetadata.folderTree) {
                                if (Array.isArray(parsedMetadata.folderTree)) {
                                    // Format: { folderTree: [...] }
                                    folderTreeData = parsedMetadata.folderTree;
                                } else if (parsedMetadata.folderTree.structure && Array.isArray(parsedMetadata.folderTree.structure)) {
                                    // Format: { folderTree: { structure: [...] } }
                                    folderTreeData = parsedMetadata.folderTree.structure;
                                } else if (parsedMetadata.folderTree.rootFolder && parsedMetadata.folderTree.rootFolder.children) {
                                    // Format: { folderTree: { rootFolder: { children: [...] } } }
                                    folderTreeData = parsedMetadata.folderTree.rootFolder.children || [];
                                }
                            } else if (parsedMetadata.structure && Array.isArray(parsedMetadata.structure)) {
                                // Format: { structure: [...] }
                                folderTreeData = parsedMetadata.structure;
                            } else if (parsedMetadata.rootFolder && parsedMetadata.rootFolder.children) {
                                // Format: { rootFolder: { children: [...] } }
                                folderTreeData = parsedMetadata.rootFolder.children || [];
                            } else if (Array.isArray(parsedMetadata)) {
                                // Format: [...]
                                folderTreeData = parsedMetadata;
                            }

                            item.metadata = { folderTree: folderTreeData };
                        } catch (e) {
                            item.metadata = { folderTree: [] };
                            console.error("Failed to parse metadata for item:", item.id);
                            console.error("Error details:", e);
                            console.error("Raw metadata that failed:", item.metadata);
                        }
                    } else if (item.metadata && !item.metadata.folderTree) {
                        // Pastikan folderTree ada dan berupa array
                        item.metadata = { folderTree: Array.isArray(item.metadata) ? item.metadata : [] };
                    } else if (!item.metadata) {
                        // Jika metadata null/undefined
                        item.metadata = { folderTree: [] };
                    }
                    return item;
                });
                setMateriList(parsedData);
            } else {
                console.error('Error fetching materi:', result.error);
            }
        } catch (error) {
            console.error('Error fetching materi:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch materi when component mounts
    useEffect(() => {
        fetchMateri();
    }, []);

    const filteredMateri = materiList.filter(materi =>
        materi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materi.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle "Lihat Materi" button
    const handleViewMateri = (materi: Materi) => {
        setSelectedMateri(materi);
        if (materi.contentType === 'folder') {
            setIsEcourseView(true);
        } else {
            // For non-folder types, open the link in a new tab
            window.open(materi.contentUrl, '_blank');
        }
    };

    // Function to close e-course view
    const handleCloseEcourse = () => {
        setIsEcourseView(false);
        setSelectedMateri(null);
    };

    // If e-course view is active, render the EcourseViewer
    if (isEcourseView && selectedMateri && selectedMateri.contentType === 'folder') {
        const folderTree = typeof selectedMateri.metadata === 'object' && selectedMateri.metadata?.folderTree ? selectedMateri.metadata.folderTree : [];

        // Pastikan folderTree adalah array
        const validFolderTree = Array.isArray(folderTree) ? folderTree : [];

        return (
            <EcourseViewer
                materi={selectedMateri}
                folderTree={validFolderTree}
                onClose={handleCloseEcourse}
            />
        );
    }


    // Default view - list of materi
    return (
        <Sidebar>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                        📚 List Materi
                    </h1>
                    <p className="text-sm sm:text-base text-gray-700">
                        Pilih materi pembelajaran yang ingin dipelajari
                    </p>
                </div>

                {/* Search and Actions */}
                <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                        <div className="flex-1 w-full sm:max-w-md">
                            <input
                                type="text"
                                placeholder="Cari materi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
                            />
                        </div>

                        <Button
                            onClick={() => router.push("/dashboard/materi/create")}
                            className="w-full sm:w-auto py-3 px-6 text-base sm:text-lg font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                        >
                            ✏️ Buat Materi Baru
                        </Button>
                    </div>
                </div>

                {/* Materi List - E-Course Style */}
                <div className="grid gap-4 sm:gap-6">
                    {isLoading ? (
                        <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-8 text-center">
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
                                <span className="text-lg font-medium text-black">Memuat materi...</span>
                            </div>
                        </div>
                    ) : filteredMateri.length === 0 ? (
                        <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-8 text-center">
                            <p className="text-lg font-medium text-gray-600">
                                {searchTerm ? `Tidak ada materi yang cocok dengan "${searchTerm}"` : "Belum ada materi"}
                            </p>
                        </div>
                    ) : (
                        filteredMateri.map((materi) => (
                            <div
                                key={materi.id}
                                className="bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md overflow-hidden hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                            >
                                {/* Course Card Header */}
                                <div className="bg-[#c3bafa] p-4 sm:p-6 border-b-2 border-black">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                                                {materi.title}
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-700 mb-3">
                                                {materi.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                <span>📅 {new Date(materi.createdAt).toLocaleDateString('id-ID')}</span>
                                                <span>👤 {materi.author.username}</span>
                                                <span className="px-2 py-1 bg-yellow-200 rounded-md border border-black text-xs font-bold">
                                                    {materi.contentType === "folder" && "📁 FOLDER"}
                                                    {materi.contentType === "document" && "📄 DOCUMENT"}
                                                    {materi.contentType === "video" && "🎥 VIDEO"}
                                                    {materi.contentType === "link" && "🔗 LINK"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Card Actions */}
                                <div className="p-4 sm:p-6 bg-white">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                                        {/* Main Action Button */}
                                        <Button
                                            onClick={() => handleViewMateri(materi)}
                                            className="flex-1 py-3 px-6 text-base sm:text-lg font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                                        >
                                            Lihat Materi
                                        </Button>

                                        {/* Secondary Actions - Only show for author */}
                                        {session?.user && 'id' in session.user && session.user.id === materi.author.id && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/dashboard/materi/${materi.id}/edit`);
                                                    }}
                                                    className="px-4 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-blue-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                                                >
                                                    ✏️ Edit
                                                </Button>

                                                <Button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Yakin ingin menghapus materi ini?')) {
                                                            try {
                                                                setIsLoading(true);
                                                                const response = await fetch(`/api/materi/${materi.id}`, {
                                                                    method: 'DELETE',
                                                                });

                                                                const result = await response.json();

                                                                if (response.ok && result.success) {
                                                                    // Refresh materi list after successful deletion
                                                                    await fetchMateri();
                                                                } else {
                                                                    console.error('Error deleting materi:', result.error);
                                                                    alert(`Gagal menghapus materi: ${result.error || 'Terjadi kesalahan'}`);
                                                                }
                                                            } catch (error) {
                                                                console.error('Error deleting materi:', error);
                                                                alert('Gagal menghapus materi: Terjadi kesalahan');
                                                            } finally {
                                                                setIsLoading(false);
                                                            }
                                                        }
                                                    }}
                                                    className="px-4 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-red-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                                                >
                                                    🗑️ Hapus
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Sidebar>
    );
}
