"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";
import { Button } from "./ui/button";

interface Item {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    category: string;
}

export default function ItemsComponent() {
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([
        {
            id: 1,
            title: "Sample Item 1",
            description: "This is a sample item description",
            createdAt: "2025-01-28",
            category: "General"
        },
        {
            id: 2,
            title: "Sample Item 2",
            description: "Another sample item",
            createdAt: "2025-01-27",
            category: "Important"
        },
        {
            id: 3,
            title: "Sample Item 3",
            description: "Third sample item",
            createdAt: "2025-01-26",
            category: "Archive"
        }
    ]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        title: "",
        description: "",
        category: "General"
    });

    const handleCreateItem = (e: React.FormEvent) => {
        e.preventDefault();
        const item: Item = {
            id: items.length + 1,
            title: newItem.title,
            description: newItem.description,
            category: newItem.category,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setItems([item, ...items]);
        setNewItem({ title: "", description: "", category: "General" });
        setIsCreateModalOpen(false);
    };

    const handleDeleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                            Your Items 📝
                        </h1>
                        <p className="text-sm sm:text-base text-gray-700">
                            Manage your collection of items
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full sm:w-auto py-3 px-6 text-base sm:text-lg font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-400 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                    >
                        ➕ Add New Item
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <DashboardCard
                        title="Total Items"
                        value={items.length}
                        icon="📊"
                        description="Items in collection"
                    />

                    <DashboardCard
                        title="Categories"
                        value="3"
                        icon="🏷️"
                        description="Different categories"
                    />

                    <DashboardCard
                        title="Recent"
                        value="2"
                        icon="🆕"
                        description="Added this week"
                    />
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md p-4 sm:p-6 transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg sm:text-xl font-bold text-black">
                                    {item.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-bold rounded border border-black ${item.category === 'Important' ? 'bg-red-200' :
                                        item.category === 'Archive' ? 'bg-gray-200' : 'bg-blue-200'
                                    }`}>
                                    {item.category}
                                </span>
                            </div>

                            <p className="text-sm sm:text-base text-gray-700 mb-4">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm text-gray-500">
                                    {item.createdAt}
                                </span>

                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="px-3 py-1 text-sm font-bold bg-red-400 text-black border border-black rounded hover:bg-red-500 transition-colors"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {items.length === 0 && (
                    <DashboardCard title="No Items Yet" icon="📭">
                        <p className="text-gray-700 mb-4">
                            You haven't created any items yet. Get started by adding your first item!
                        </p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="py-2 px-4 text-base font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-400 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                        >
                            ➕ Create Your First Item
                        </Button>
                    </DashboardCard>
                )}
            </div>

            {/* Create Item Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#c3bafa] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-md p-6 w-full max-w-md">
                        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
                            Create New Item
                        </h2>

                        <form onSubmit={handleCreateItem} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Item Title"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border-b-2 border-black bg-transparent focus:outline-none font-bold text-black placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <textarea
                                    placeholder="Item Description"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border-2 border-black bg-white rounded focus:outline-none text-black placeholder-gray-600 resize-none"
                                />
                            </div>

                            <div>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-black bg-white rounded focus:outline-none font-bold text-black"
                                >
                                    <option value="General">General</option>
                                    <option value="Important">Important</option>
                                    <option value="Archive">Archive</option>
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2 px-4 font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gray-300 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    className="flex-1 py-2 px-4 font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-green-400 text-black hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
