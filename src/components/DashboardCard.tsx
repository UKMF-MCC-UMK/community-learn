"use client";

import { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    value?: string | number;
    icon?: string;
    description?: string;
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function DashboardCard({
    title,
    value,
    icon,
    description,
    children,
    onClick,
    className = "",
}: DashboardCardProps) {
    const baseClasses = `
    bg-[#c3bafa]
    border-2 sm:border-4
    border-black
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
    rounded-md
    p-4 sm:p-6
    transition-all
    duration-200
    ${onClick ? 'cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] sm:hover:translate-x-[3px] sm:hover:translate-y-[3px]' : ''}
    ${className}
  `;

    return (
        <div className={baseClasses} onClick={onClick}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-black">{title}</h3>
                {icon && <span className="text-2xl sm:text-3xl">{icon}</span>}
            </div>

            {/* Value */}
            {value !== undefined && (
                <div className="mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-4xl font-bold text-black">
                        {value}
                    </span>
                </div>
            )}

            {/* Description */}
            {description && (
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                    {description}
                </p>
            )}

            {/* Custom content */}
            {children && <div className="mt-3 sm:mt-4">{children}</div>}
        </div>
    );
}
