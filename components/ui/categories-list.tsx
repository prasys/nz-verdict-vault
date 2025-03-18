'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface Category {
    name: string;
    count: number;
}

interface CategoriesListProps {
    categories: Category[];
    variant?: 'sidebar' | 'main';
    showCount?: boolean;
    initialDisplayCount?: number;
}

export default function CategoriesList({
    categories,
    variant = 'sidebar',
    showCount = true,
    initialDisplayCount = 5
}: CategoriesListProps) {
    const [showAll, setShowAll] = useState(false);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category')?.toLowerCase();

    const displayedCategories = showAll ? categories : categories.slice(0, initialDisplayCount);

    if (variant === 'sidebar') {
        return (
            <div className="space-y-2">
                {displayedCategories.map((category) => {
                    const isActive = currentCategory === category.name.toLowerCase();
                    return (
                        <a
                            key={category.name}
                            href={`/law/cases?${new URLSearchParams({
                                ...Object.fromEntries(searchParams.entries()),
                                category: isActive ? '' : category.name
                            }).toString()}`}
                            className={`
                                group flex items-center justify-between rounded-md px-3 py-2 text-sm
                                ${isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"}
                            `}
                        >
                            <span className="group-hover:text-current">
                                {category.name}
                            </span>
                            {showCount && (
                                <span className={`
                                    rounded-full px-2.5 py-0.5 text-xs font-medium
                                    ${isActive
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-600"}
                                `}>
                                    {category.count}
                                </span>
                            )}
                        </a>
                    );
                })}
                {categories.length > initialDisplayCount && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-full mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        {showAll ? 'Show Less' : `Show ${categories.length - initialDisplayCount} More Categories`}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {displayedCategories.map((category) => (
                <div key={category.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-700">{category.name.replace('_', ' ')}</span>
                    {showCount && (
                        <span className="font-medium text-emerald-600">{category.count}</span>
                    )}
                </div>
            ))}
            {categories.length > initialDisplayCount && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                    {showAll ? 'Show Less' : `Show ${categories.length - initialDisplayCount} More Categories`}
                </button>
            )}
        </div>
    );
} 