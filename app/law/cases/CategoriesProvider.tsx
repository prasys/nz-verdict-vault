'use client';

import { createContext } from 'react';

interface Category {
    name: string;
    count: number;
}

export const CategoriesContext = createContext<Category[]>([]);

interface CategoriesProviderProps {
    categories: Category[];
    children: React.ReactNode;
}

export default function CategoriesProvider({ categories, children }: CategoriesProviderProps) {
    return (
        <CategoriesContext.Provider value={categories}>
            {children}
        </CategoriesContext.Provider>
    );
} 