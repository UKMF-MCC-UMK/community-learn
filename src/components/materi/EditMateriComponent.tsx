"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Sidebar from "../layout/Sidebar";

interface EditMateriComponentProps {
  materiId: string;
}

export default function EditMateriComponent({ materiId }: EditMateriComponentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [contentType, setContentType] = useState("folder"); // Selalu menggunakan tipe folder (Google Drive)

  // Fetch materi data
  // Extract user ID for dependency array
  const userId = session?.user && 'id' in session.user ? session.user.id : undefined;

  // Define fetchMateri with useCallback
  const fetchMateri = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/materi/${materiId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengambil data materi");
      }

      if (result.success && result.data) {
        const materi = result.data;

        // Check if current user is the author
        if (session?.user && 'id' in session.user && session.user.id === materi.author.id) {
          setIsAuthorized(true);
          // Set form data
          setTitle(materi.title);
          setDescription(materi.description);
          setContentUrl(materi.contentUrl);
          setContentType("folder"); // Selalu menggunakan tipe folder (Google Drive) terlepas dari nilai yang ada di database
        } else {
          setIsAuthorized(false);
          setError("Anda tidak memiliki izin untuk mengedit materi ini");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat mengambil data materi");
      }
    } finally {
      setIsLoading(false);
    }
  }, [materiId, session?.user, setIsLoading, setError, setIsAuthorized, setTitle, setDescription, setContentUrl, setContentType]);

  useEffect(() => {
    // Only fetch if we have a valid user session
    if (userId) {
      fetchMateri();
    }
  }, [userId, fetchMateri]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthorized) {
      setError("Anda tidak memiliki izin untuk mengedit materi ini");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/materi/${materiId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          contentUrl,
          contentType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memperbarui materi");
      }

      setSuccess("Materi berhasil diperbarui");

      // Redirect to materi list after successful update
      setTimeout(() => {
        router.push("/dashboard/materi");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat memperbarui materi");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
          <span className="text-lg font-medium">Memuat data materi...</span>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized && !isLoading) {
    return (
      <div className="bg-red-100 border-2 border-red-400 rounded-md p-6 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
        <p className="text-red-600 mb-4">
          Anda tidak memiliki izin untuk mengedit materi ini. Hanya pembuat materi yang dapat mengedit.
        </p>
        <Button
          onClick={() => router.push("/dashboard/materi")}
          className="py-2 px-4 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-blue-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
        >
          Kembali ke Daftar Materi
        </Button>
      </div>
    );
  }

  return (
    <Sidebar >
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-[#c3bafa] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            ✏️ Edit Materi
          </h1>
          <p className="text-sm sm:text-base text-gray-700">
            Perbarui informasi materi pembelajaran
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-400 rounded-md p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-2 border-green-400 rounded-md p-4 mb-6">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-2">
                Judul Materi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
                placeholder="Masukkan judul materi"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
                placeholder="Masukkan deskripsi materi"
              />
            </div>

            {/* Content Type - Hidden, always set to "folder" */}
            <input type="hidden" id="contentType" value="folder" onChange={(e) => setContentType(e.target.value)} />

            {/* Content URL */}
            <div>
              <label htmlFor="contentUrl" className="block text-base font-medium text-gray-700 mb-2">
                URL Folder Google Drive <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="contentUrl"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                required
                className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
                placeholder="https://drive.google.com/drive/folders/..."
              />
            </div>

            {/* Tips for Google Drive Folder */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-md p-4">
              <p className="text-blue-600 text-sm">
                <strong>Tip:</strong> Masukkan URL folder Google Drive yang sudah dibagikan dengan akses &quot;Siapa saja yang memiliki link&quot;.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                onClick={() => router.push("/dashboard/materi")}
                className="py-3 px-6 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gray-200 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                disabled={isSubmitting}
              >
                Batal
              </Button>

              <Button
                type="submit"
                className="py-3 px-6 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                disabled={isSubmitting || !title || !description || !contentUrl}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}