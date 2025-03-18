'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/shared/sidebar'
import CategoriesProvider from '@/app/law/cases/CategoriesProvider'
import { getCategories } from '@/app/law/cases/actions'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])

    useEffect(() => {
        if (pathname.startsWith('/law/cases')) {
            getCategories().then(setCategories)
        }
    }, [pathname])

    if (pathname.startsWith('/law/cases')) {
        return (
            <CategoriesProvider categories={categories}>
                <Sidebar categories={categories}>{children}</Sidebar>
            </CategoriesProvider>
        )
    }

    return <Sidebar>{children}</Sidebar>
} 