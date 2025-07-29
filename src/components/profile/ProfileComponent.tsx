"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import NotificationContainer from "@/components/utils/NotificationContainer";

export default function ProfileComponent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { notifications, removeNotification, showError, showSuccess } = useNotification();

  // Form state
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State untuk data profil
  const [profileData, setProfileData] = useState({
    createdAt: "",
    materiCount: 0
  });

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.username || "");

      // Ambil data profil dari API
      const fetchProfileData = async () => {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            // Update session dengan data dari API
            if (session.user) {
              session.user.createdAt = data.createdAt;
              session.user.materiCount = data.materiCount;
            }
            setProfileData({
              createdAt: data.createdAt || "",
              materiCount: data.materiCount || 0
            });
          } else {
            console.error("Failed to fetch profile data, status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password baru
    if (newPassword && newPassword !== confirmPassword) {
      showError("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    // Validasi password baru minimal 6 karakter
    if (newPassword && newPassword.length < 6) {
      showError("Password baru harus minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    try {
      // Buat objek data yang akan dikirim
      const updateData: { currentPassword?: string; newPassword?: string } = {};

      // Hanya tambahkan password jika user ingin mengubahnya
      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      // Kirim request ke API
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      // Reset form password
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showSuccess("Profil berhasil diperbarui");
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui profil";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Profil Pengguna</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>

      <div className="bg-[#c3bafa] p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username (read-only) */}
          <div>
            <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              disabled
              className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">Username tidak dapat diubah</p>
          </div>

          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-base font-medium text-gray-700 mb-2">
              Password Saat Ini
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
              placeholder="Masukkan password saat ini"
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-base font-medium text-gray-700 mb-2">
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
              placeholder="Masukkan password baru"
            />
            <p className="text-sm text-gray-500 mt-1">Minimal 6 karakter</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-3 px-4 text-base font-medium rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-200"
              placeholder="Konfirmasi password baru"
            />
          </div>

          {/* User Stats */}
          <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-medium text-gray-700 mb-4 text-lg">Informasi Akun</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm text-gray-500 mb-1">Tanggal Bergabung</p>
                <p className="text-black font-medium text-lg">
                  {profileData.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '-'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm text-gray-500 mb-1">Jumlah Materi Dibuat</p>
                <p className="text-black font-medium text-lg">{profileData.materiCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="py-3 px-6 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gray-200 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
              disabled={isLoading}
            >
              Kembali
            </Button>

            <Button
              type="submit"
              className="py-3 px-6 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
              disabled={isLoading || (!currentPassword && !newPassword)}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
