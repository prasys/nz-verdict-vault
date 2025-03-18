'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
    Bars3Icon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    XMarkIcon,
    MagnifyingGlassCircleIcon,
    FunnelIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CategoriesList from '../ui/categories-list'

interface SidebarProps {
    children: React.ReactNode;
    categories?: Array<{
        name: string;
        count: number;
    }>;
}

interface SidebarNavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface ChatItem {
    id: number;
    title: string;
    preview: string;
    date: string;
    datetime: string;
}

interface RecentCase {
    id: string;
    title: string;
    date: string;
    category: string;
}

const sidebarNavigation: SidebarNavigationItem[] = [
    { name: 'Chat', href: '/law/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Search', href: '/law/search', icon: MagnifyingGlassCircleIcon },
    { name: 'Cases', href: '/law/cases', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
]

const previousChats: ChatItem[] = [
    {
        id: 1,
        title: 'Contract Analysis',
        preview: 'Analysis of employment contract terms and conditions...',
        date: '1d ago',
        datetime: '2024-03-27T16:35',
    },
    {
        id: 2,
        title: 'Legal Research',
        preview: 'Research on recent employment law changes...',
        date: '2d ago',
        datetime: '2024-03-26T16:35',
    },
]

const recentCases: RecentCase[] = [
    {
        id: 'case-001',
        title: 'Smith v. Company Ltd',
        date: 'Mar 28, 2024',
        category: 'Employment',
    },
    {
        id: 'case-002',
        title: 'Privacy Commissioner v. Tech Corp',
        date: 'Mar 27, 2024',
        category: 'Privacy',
    },
    {
        id: 'case-003',
        title: 'Jones v. Department',
        date: 'Mar 26, 2024',
        category: 'Discrimination',
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ children, categories = [] }: SidebarProps) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Determine which section is active based on the current path
    const currentSection = pathname.split('/')[2] || 'chat'

    const handleCasesSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const query = formData.get('q')?.toString()

        // Maintain existing params while updating the search query
        const params = new URLSearchParams(searchParams.toString())
        if (query) {
            params.set('q', query)
        } else {
            params.delete('q')
        }

        router.push(`/law/cases?${params.toString()}`)
    }

    // Dynamic sidebar content based on current section
    const renderSidebarContent = () => {
        switch (currentSection) {
            case 'search':
                return (
                    <>
                        {/* Search header */}
                        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-4">
                            <div className="flex flex-1 gap-x-4">
                                <form className="relative flex flex-1" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search legal documents
                                    </label>
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Search legal documents..."
                                        type="search"
                                        name="search"
                                    />
                                </form>
                            </div>
                            <button
                                type="button"
                                className="rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-500"
                            >
                                <span className="sr-only">Advanced search</span>
                                <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Recent searches */}
                        <div className="px-4 py-6">
                            <h2 className="text-sm font-semibold text-gray-700">Recent Searches</h2>
                            <div className="mt-3 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {['Employment law', 'Privacy breach', 'Discrimination cases', 'Human rights'].map((term) => (
                                        <button
                                            key={term}
                                            className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                                        >
                                            <MagnifyingGlassIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Search filters */}
                        <div className="px-4 py-6">
                            <h2 className="text-sm font-semibold text-gray-700">Search Filters</h2>
                            <div className="mt-3 space-y-4">
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <label
                                            key={category.name}
                                            className="flex items-center space-x-3"
                                        >
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <span className="text-sm text-gray-600">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )
            case 'cases':
                return (
                    <>
                        {/* Cases header */}
                        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-4">
                            <div className="flex flex-1 gap-x-4">
                                <form className="relative flex flex-1" onSubmit={handleCasesSearch}>
                                    <label htmlFor="search-field" className="sr-only">
                                        Search cases
                                    </label>
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Search cases..."
                                        type="search"
                                        name="q"
                                        defaultValue={searchParams.get('q') || ''}
                                    />
                                </form>
                            </div>
                            <button
                                type="button"
                                className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-500"
                            >
                                <span className="sr-only">Filter cases</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Categories section */}
                        <div className="px-4 py-6">
                            <h2 className="text-sm font-semibold text-gray-700">Categories</h2>
                            <div className="mt-3">
                                <CategoriesList categories={categories} />
                            </div>
                        </div>

                        {/* Recent cases section */}
                        <div className="px-4 py-6">
                            <h2 className="text-sm font-semibold text-gray-700">Recent Cases</h2>
                            <div className="mt-3 space-y-4">
                                {recentCases.map((caseItem) => (
                                    <a
                                        key={caseItem.id}
                                        href={`/law/cases/${caseItem.id}`}
                                        className="block rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <p className="text-sm font-medium text-gray-900">{caseItem.title}</p>
                                        <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
                                            <span>{caseItem.date}</span>
                                            <span>•</span>
                                            <span>{caseItem.category}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </>
                )
            default:
                return (
                    <>
                        {/* Search header */}
                        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-4">
                            <div className="flex flex-1 gap-x-4">
                                <form className="relative flex flex-1" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search conversations
                                    </label>
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Search conversations..."
                                        type="search"
                                        name="search"
                                    />
                                </form>
                            </div>
                            <button
                                type="button"
                                className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-500"
                            >
                                <span className="sr-only">New chat</span>
                                <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Previous chats list */}
                        <nav className="flex-1 overflow-y-auto">
                            <ul role="list" className="divide-y divide-gray-200">
                                {previousChats.map((chat) => (
                                    <li
                                        key={chat.id}
                                        className="relative bg-white px-6 py-5 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between space-x-3">
                                            <div className="min-w-0 flex-1">
                                                <a href="#" className="block focus:outline-none">
                                                    <span className="absolute inset-0" aria-hidden="true" />
                                                    <p className="truncate text-sm font-medium text-gray-900">{chat.title}</p>
                                                    <p className="truncate text-sm text-gray-500">{chat.preview}</p>
                                                </a>
                                            </div>
                                            <time
                                                dateTime={chat.datetime}
                                                className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                                            >
                                                {chat.date}
                                            </time>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </>
                )
        }
    }

    return (
        <div className="flex h-full">
            {/* Narrow sidebar with icons */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
                    <div className="flex flex-1 flex-col overflow-y-auto">
                        {/* Logo */}
                        <div className="flex h-16 shrink-0 items-center justify-center bg-gray-900">
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                                alt="Your Company"
                            />
                        </div>
                        {/* Sidebar icons */}
                        <nav aria-label="Sidebar" className="flex flex-1 flex-col space-y-3 p-3">
                            {sidebarNavigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.href.includes(currentSection)
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-400 hover:bg-gray-700',
                                        'group flex items-center rounded-lg p-2 text-sm font-medium'
                                    )}
                                >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    <span className="sr-only">{item.name}</span>
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Previous conversations sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-20 lg:z-50 lg:block lg:w-96 lg:overflow-y-auto lg:border-r lg:border-gray-200 lg:bg-white">
                <div className="flex h-full flex-col">
                    {renderSidebarContent()}
                </div>
            </div>

            {/* Mobile menu */}
            <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-75" />

                <div className="fixed inset-0 z-50 flex">
                    <DialogPanel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Mobile nav content */}
                        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                            <nav className="flex-1 space-y-1 bg-white px-2">
                                {sidebarNavigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            item.href.includes(currentSection)
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                            'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                                        )}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.href.includes(currentSection)
                                                    ? 'text-gray-500'
                                                    : 'text-gray-400 group-hover:text-gray-500',
                                                'mr-3 h-6 w-6 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Main content */}
            <div className="flex-1 lg:pl-[464px]">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <main className="h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="px-4 py-8 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
