"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";

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

export default function MateriListComponent() {
    const { data: session } = useSession();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [materiList, setMateriList] = useState<Materi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);

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

    const filteredMateri = materiList.filter(materi =>
        materi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materi.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle "Lihat Materi" button
    const handleViewMateri = (materi: Materi) => {
        setSelectedMateri(materi);
    };

    // Function to go back to list
    const handleBackToList = () => {
        setSelectedMateri(null);
    };

    // If a materi is selected, show the detailed view
    if (selectedMateri) {
        return (
            <Sidebar>
                <div className="space-y-6">
                    {/* Back Button */}
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleBackToList}
                            className="px-4 py-2 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gray-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                        >
                            ← Kembali ke List
                        </Button>
                    </div>

                    {/* Materi Header */}
                    <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                            📚 {selectedMateri.title}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-700 mb-4">
                            {selectedMateri.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>📅 {new Date(selectedMateri.createdAt).toLocaleDateString('id-ID')}</span>
                            <span>👤 {selectedMateri.author.username}</span>
                            <span className="px-2 py-1 bg-yellow-200 rounded-md border border-black text-xs font-bold">
                                {selectedMateri.contentType === "folder" && "📁 FOLDER"}
                                {selectedMateri.contentType === "document" && "📄 DOCUMENT"}
                                {selectedMateri.contentType === "video" && "🎥 VIDEO"}
                                {selectedMateri.contentType === "link" && "🔗 LINK"}
                            </span>
                        </div>

                        {/* Open Original Link */}
                        <div className="mb-4">
                            <a
                                href={selectedMateri.contentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-blue-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                            >
                                {selectedMateri.contentType === "folder" && "📁 Buka Google Drive Folder"}
                                {selectedMateri.contentType === "document" && "📄 Buka Google Docs"}
                                {selectedMateri.contentType === "video" && "🎥 Tonton Video"}
                                {selectedMateri.contentType === "link" && "🔗 Buka Link"}
                                <span className="text-sm">(Tab Baru)</span>
                            </a>
                        </div>
                    </div>

                    {/* Content Display */}
                    {selectedMateri.contentType === "folder" && (
                        <div className="bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                            <h2 className="text-xl font-bold text-black mb-4">📂 Struktur Folder</h2>
                            {/* Google Drive Folder Viewer */}
                            <div className="space-y-4">
                                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded-md">
                                    <p className="text-sm text-gray-700">
                                        📂 <strong>Folder konten:</strong> Berisi multiple files (PDF, dokumen, dll.). 
                                        Folder akan ditampilkan dalam struktur tree di bawah ini.
                                    </p>
                                </div>
                                
                                {/* Folder viewer component akan ditampilkan di sini */}
                                <div className="border-2 border-gray-300 rounded-md p-4 bg-gray-50">
                                    <p className="text-center text-gray-600 italic">
                                        Folder structure akan dimuat di sini...
                                    </p>
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        URL: {selectedMateri.contentUrl}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMateri.contentType === "document" && (
                        <div className="bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                            <h2 className="text-xl font-bold text-black mb-4">📄 Preview Dokumen</h2>
                            <div className="space-y-4">
                                <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded-md">
                                    <p className="text-sm text-gray-700">
                                        📄 <strong>Google Docs:</strong> Klik tombol di atas untuk membuka dokumen di Google Docs.
                                    </p>
                                </div>
                                
                                {/* Document preview would go here */}
                                <div className="border-2 border-gray-300 rounded-md p-8 bg-gray-50 text-center">
                                    <p className="text-gray-600 italic">
                                        Preview dokumen akan dimuat di sini...
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        URL: {selectedMateri.contentUrl}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMateri.contentType === "link" && (
                        <div className="bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                            <h2 className="text-xl font-bold text-black mb-4">🔗 Link External</h2>
                            <div className="space-y-4">
                                <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded-md">
                                    <p className="text-sm text-gray-700">
                                        🔗 <strong>Link External:</strong> Klik tombol di atas untuk membuka link di tab baru.
                                    </p>
                                </div>
                                
                                <div className="border-2 border-gray-300 rounded-md p-4 bg-gray-50">
                                    <p className="text-sm text-gray-600">
                                        <strong>URL:</strong> <a href={selectedMateri.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedMateri.contentUrl}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Sidebar>
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
                                            👁️ Lihat Materi
                                        </Button>

                                        {/* Secondary Actions */}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Yakin ingin menghapus materi ini?')) {
                                                        // TODO: Logic hapus materi
                                                        console.log('Delete materi:', materi.id);
                                                    }
                                                }}
                                                className="px-4 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-red-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                                            >
                                                🗑️ Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Sidebar>
    );
    }, []);

    const filteredMateri = materiList.filter(materi =>
        materi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materi.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Sidebar>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                        📚 List Materi
                    </h1>
                    <p className="text-sm sm:text-base text-gray-700">
                        Kelola dan lihat semua materi pembelajaran dengan Google Docs
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

                {/* Materi List */}
                <div className="space-y-4">
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
                                className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                                            {materi.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-700 mb-3">
                                            {materi.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                            <span>📅 {new Date(materi.createdAt).toLocaleDateString('id-ID')}</span>
                                            <span>👤 {materi.author.username}</span>
                                            <span className="px-2 py-1 bg-yellow-200 rounded-md border border-black text-xs font-bold">
                                                {materi.contentType === "folder" && "📁 FOLDER"}
                                                {materi.contentType === "document" && "📄 DOCUMENT"}
                                                {materi.contentType === "video" && "🎥 VIDEO"}
                                                {materi.contentType === "link" && "🔗 LINK"}
                                            </span>
                                        </div>

                                        {/* Content Link */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    {materi.contentType === "folder" && "📁"}
                                                    {materi.contentType === "document" && "�"}
                                                    {materi.contentType === "video" && "🎥"}
                                                    {materi.contentType === "link" && "�🔗"}
                                                </span>
                                                <a
                                                    href={materi.contentUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                                                >
                                                    {materi.contentType === "folder" && "Buka Google Drive Folder"}
                                                    {materi.contentType === "document" && "Buka Google Docs"}
                                                    {materi.contentType === "video" && "Tonton Video"}
                                                    {materi.contentType === "link" && "Buka Link"}
                                                </a>
                                                <span className="text-xs text-gray-500">(akan membuka di tab baru)</span>
                                            </div>

                                            {materi.contentType === "folder" && materi.metadata && (
                                                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded-md">
                                                    <p className="text-sm text-gray-700">
                                                        📂 <strong>Folder konten:</strong> Berisi multiple files (PDF, dokumen, dll.).
                                                        Klik link di atas untuk mengakses semua file dalam folder.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Google Drive Folder Viewer - hanya untuk contentType folder */}
                                            {materi.contentType === "folder" && (
                                                <div className="mt-4">
                                                    <GoogleDriveFolderViewer
                                                        folderUrl={materi.contentUrl}
                                                        title={`File dalam ${materi.title}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 sm:flex-col lg:flex-row">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/dashboard/materi/${materi.id}/edit`);
                                            }}
                                            className="px-4 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                                        >
                                            ✏️ Edit
                                        </Button>

                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Yakin ingin menghapus materi ini?')) {
                                                    // TODO: Logic hapus materi
                                                    console.log('Delete materi:', materi.id);
                                                }
                                            }}
                                            className="px-4 py-2 text-sm font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-red-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200"
                                        >
                                            🗑️ Hapus
                                        </Button>
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
