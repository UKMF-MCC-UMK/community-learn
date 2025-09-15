"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DriveItem, formatFileSize } from "@/lib/driveUtils";

interface FolderTreeViewerProps {
    items: DriveItem[];
    onFileSelect?: (file: DriveItem) => void;
    selectedFileId?: string;
}

interface FolderTreeItemProps {
    item: DriveItem;
    level: number;
    onFileSelect?: (file: DriveItem) => void;
    selectedFileId?: string;
}

function FolderTreeItem({ item, level, onFileSelect, selectedFileId }: FolderTreeItemProps) {
    const [isExpanded, setIsExpanded] = useState(false); // Auto expand first 2 levels

    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
    const isSelected = selectedFileId === item.id;

    return (
        <div className="select-none">
            {/* Item Row */}
            <div
                className={`
          flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-all duration-200
          ${isSelected ? 'bg-yellow-200 border-2 border-yellow-500' : 'hover:bg-gray-100'}
          ${level > 0 ? 'ml-' + (level * 4) : ''}
        `}
                onClick={() => {
                    if (item.isFolder && hasChildren) {
                        setIsExpanded(!isExpanded);
                    } else if (!item.isFolder && onFileSelect) {
                        onFileSelect(item);
                    }
                }}
            >
                {/* Expand/Collapse Icon */}
                {hasChildren && (
                    <span className="text-sm font-bold w-4 flex justify-center">
                        {isExpanded ? '📂' : '📁'}
                    </span>
                )}

                {/* File/Folder Icon */}
                <span className="text-lg">
                    {item.isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
                </span>

                {/* Name */}
                <span className={`flex-1 text-sm ${item.isFolder ? 'font-bold' : 'font-medium'} text-black`}>
                    {item.name}
                </span>

                {/* Size (for files only) */}
                {!item.isFolder && item.size && (
                    <span className="text-xs text-gray-500">
                        {formatFileSize(item.size)}
                    </span>
                )}

                {/* External link button */}
                {item.webViewLink && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.webViewLink, '_blank');
                        }}
                        className="px-2 py-1 text-xs font-bold rounded border border-black shadow-sm bg-blue-200 text-black hover:bg-blue-300 transition-all duration-200"
                    >
                        🔗
                    </Button>
                )}
            </div>

            {/* Children (if expanded) */}
            {hasChildren && isExpanded && item.children && (
                <div className="ml-4 border-l-2 border-gray-200 pl-2">
                    {Array.isArray(item.children) && item.children.slice().reverse().map((child: DriveItem) => (
                        <FolderTreeItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                            onFileSelect={onFileSelect}
                            selectedFileId={selectedFileId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FolderTreeViewer({ items, onFileSelect, selectedFileId }: FolderTreeViewerProps) {
    // Pastikan items adalah array
    const validItems = Array.isArray(items) ? items : [];

    return (
        <div className="bg-white border-2 border-black rounded-md overflow-hidden">
            {/* Header */}
            <div className="bg-[#c3bafa] border-b-2 border-black p-3">
                <h3 className="font-bold text-black flex items-center gap-2">
                    🗂️ Struktur Folder
                </h3>
            </div>

            {/* Tree Content */}
            <div className="p-2 max-h-96 overflow-y-auto">
                {validItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Tidak ada konten ditemukan
                    </div>
                ) : (
                    validItems.slice().reverse().map((item) => (
                        <FolderTreeItem
                            key={item.id}
                            item={item}
                            level={0}
                            onFileSelect={onFileSelect}
                            selectedFileId={selectedFileId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
