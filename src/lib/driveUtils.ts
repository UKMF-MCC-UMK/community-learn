// src/lib/driveUtils.ts

// Tipe data ini aman untuk dibagikan antara server dan client.
export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime?: string;
  isFolder: boolean;
  parentId?: string;
  children?: DriveItem[];
  webViewLink?: string;
}

export interface FolderStructure {
  rootFolder: DriveItem;
  allItems: DriveItem[];
  pdfFiles: DriveItem[];
  folderTree: DriveItem[];
}

/**
 * Membuat URL embed untuk file Google Drive.
 * Aman digunakan di client.
 * @param fileId ID file Google Drive.
 * @returns URL untuk disematkan dalam iframe.
 */
export function createEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Mengekstrak ID folder dari URL Google Drive.
 * Aman digunakan di client.
 * @param url URL folder Google Drive.
 * @returns ID folder atau null.
 */
export function extractGoogleDriveFolderId(url: string): string | null {
  const folderRegex = /\/folders\/([a-zA-Z0-9-_]+)/;
  const match = url.match(folderRegex);
  return match ? match[1] : null;
}

/**
 * Memformat ukuran file menjadi format yang mudah dibaca.
 * Aman digunakan di client.
 * @param bytes Ukuran dalam bytes.
 * @returns String yang diformat (e.g., "1.23 MB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Memformat tanggal menjadi string lokal.
 * Aman digunakan di client.
 * @param dateString String tanggal ISO.
 * @returns String tanggal yang diformat (e.g., "28 Juli 2025").
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
