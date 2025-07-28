import { google } from 'googleapis';
import { DriveItem, FolderStructure } from './driveUtils';

// Validasi environment variables
if (!process.env.GOOGLE_CLIENT_EMAIL) {
  throw new Error('GOOGLE_CLIENT_EMAIL is not set in environment variables');
}

if (!process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error('GOOGLE_PRIVATE_KEY is not set in environment variables');
}

if (!process.env.GOOGLE_PROJECT_ID) {
  throw new Error('GOOGLE_PROJECT_ID is not set in environment variables');
}

// Konfigurasi Google Auth (SERVER-SIDE ONLY)
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

// Implementasi nyata dari parseFolderContents (SERVER-SIDE ONLY)
export async function parseFolderContents(folderId: string): Promise<{
  structure: FolderStructure;
  error?: string;
}> {
  try {
    console.log("🔍 Attempting to access Google Drive folder:", folderId);
    console.log("🔑 Service account email:", process.env.GOOGLE_CLIENT_EMAIL);
    console.log("🔑 Project ID:", process.env.GOOGLE_PROJECT_ID);
    console.log("🔑 Private key exists:", !!process.env.GOOGLE_PRIVATE_KEY);

    // 1. Dapatkan informasi folder root
    const rootFolderRes = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, webViewLink, modifiedTime',
    });

    console.log("✅ Root folder response status:", rootFolderRes.status);
    console.log("📁 Root folder data:", rootFolderRes.data);

    if (rootFolderRes.status !== 200 || !rootFolderRes.data) {
      return { structure: {} as FolderStructure, error: "Folder tidak ditemukan atau tidak dapat diakses." };
    }

    const rootFolderData = rootFolderRes.data;
    const allItems: DriveItem[] = [];

    // Fungsi rekursif untuk mengambil semua item dalam folder
    async function fetchItemsRecursive(currentFolderId: string, parentId?: string) {
      console.log("🔍 Fetching items for folder:", currentFolderId);

      const res = await drive.files.list({
        q: `'${currentFolderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, parents)',
        pageSize: 1000, // Ambil hingga 1000 item
      });

      console.log(`📂 Found ${res.data.files?.length || 0} items in folder ${currentFolderId}`);

      if (!res.data.files) return;

      for (const file of res.data.files) {
        const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
        const driveItem: DriveItem = {
          id: file.id!,
          name: file.name!,
          mimeType: file.mimeType!,
          size: Number(file.size) || 0,
          modifiedTime: file.modifiedTime!,
          isFolder,
          parentId: parentId || folderId,
          webViewLink: file.webViewLink!,
        };
        allItems.push(driveItem);

        if (isFolder) {
          await fetchItemsRecursive(file.id!, file.id!);
        }
      }
    }

    // Mulai proses rekursif dari folder root
    await fetchItemsRecursive(folderId, folderId);

    // Tambahkan folder root ke daftar item
    const rootDriveItem: DriveItem = {
      id: rootFolderData.id!,
      name: rootFolderData.name!,
      mimeType: rootFolderData.mimeType!,
      isFolder: true,
      webViewLink: rootFolderData.webViewLink!,
      modifiedTime: rootFolderData.modifiedTime!,
    };
    allItems.unshift(rootDriveItem); // Tambahkan di awal

    // Build tree structure
    const buildTree = (currentParentId: string): DriveItem[] => {
      return allItems
        .filter(item => item.parentId === currentParentId)
        .map(item => ({
          ...item,
          children: item.isFolder ? buildTree(item.id) : undefined,
        }));
    };

    const folderTree = buildTree(folderId);
    const pdfFiles = allItems.filter(item => item.mimeType === 'application/pdf');

    return {
      structure: {
        rootFolder: {
          ...rootDriveItem,
          children: folderTree,
        },
        allItems,
        pdfFiles,
        folderTree,
      },
    };

  } catch (err: any) {
    console.error("Error parsing Google Drive folder:", err);
    let errorMessage = "Terjadi kesalahan saat mengakses Google Drive API.";
    if (err.response?.data?.error?.message) {
      errorMessage += ` Pesan: ${err.response.data.error.message}`;
    }
    return { structure: {} as FolderStructure, error: errorMessage };
  }
}
