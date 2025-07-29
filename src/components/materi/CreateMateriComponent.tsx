"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

export default function CreateMateriComponent() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        contentUrl: "",
        contentType: "folder" // Selalu menggunakan tipe folder (Google Drive)
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/materi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success - redirect to materi list
                router.push('/dashboard/materi');
            } else {
                console.error('Error saving materi:', result.error);
                alert('Gagal menyimpan materi: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving materi:', error);
            alert('Gagal menyimpan materi. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sidebar>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                        ✏️ Buat Materi Baru
                    </h1>
                    <p className="text-sm sm:text-base text-gray-700">
                        Buat materi pembelajaran baru untuk komunitas
                    </p>
                </div>

                {/* Form */}
                <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-lg font-bold text-black mb-3">
                                📝 Judul Materi
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Masukkan judul materi..."
                                className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-lg font-bold text-black mb-3">
                                📄 Deskripsi
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                placeholder="Masukkan deskripsi materi..."
                                className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200 resize-none"
                            />
                        </div>

                        {/* Content Type - Hidden, always set to "folder" */}
                        <input type="hidden" id="contentType" name="contentType" value="folder" />

                        {/* Content URL */}
                        <div>
                            <label htmlFor="contentUrl" className="block text-lg font-bold text-black mb-3">
                                📁 Link Google Drive Folder
                            </label>
                            <input
                                type="url"
                                id="contentUrl"
                                name="contentUrl"
                                value={formData.contentUrl}
                                onChange={handleInputChange}
                                required
                                placeholder="https://drive.google.com/drive/folders/..."
                                className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
                            />
                            <div className="text-sm text-gray-600 mt-2">
                                <p>💡 Tip: Masukkan link folder Google Drive yang sudah dibagikan dengan akses &quot;Anyone with the link can view&quot;. Sistem akan otomatis mendeteksi PDF dan dokumen di dalam folder.</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                type="button"
                                onClick={() => router.push('/dashboard/materi')}
                                className="w-full sm:w-auto py-3 px-6 text-base sm:text-lg font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gray-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                            >
                                ❌ Batal
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.contentUrl.trim()}
                                className="w-full sm:flex-1 py-3 px-6 text-base sm:text-lg font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    "💾 Simpan Materi"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidebar>
    );
}
