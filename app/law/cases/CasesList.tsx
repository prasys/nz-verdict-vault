'use client';

import { LegalDocumentSummary } from '@/backend/server-actions/law/types';
import Link from 'next/link';
import { IoScale, IoSearch, IoStatsChart, IoList, IoTime } from 'react-icons/io5';
import { SearchParams } from './types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useContext,Suspense } from 'react';
import CategoriesList from '@/components/ui/categories-list';
import { CategoriesContext } from './CategoriesProvider';

interface CasesListProps {
    cases: LegalDocumentSummary[];
    totalCases: number;
    searchParams: SearchParams;
}

function CasesListContent({ cases: initialCases, totalCases, searchParams }: CasesListProps) {
    const router = useRouter();
    const params = useSearchParams();
    const [displayedCases, setDisplayedCases] = useState(initialCases);
    const [isLoading, setIsLoading] = useState(false);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    const categories = useContext(CategoriesContext);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = formData.get('q')?.toString() || '';
        const category = formData.get('category')?.toString() || '';
        const date = formData.get('date')?.toString() || '';

        const searchParams = new URLSearchParams();
        if (q) searchParams.set('q', q);
        if (category) searchParams.set('category', category);
        if (date) searchParams.set('date', date);

        router.push(`/law/cases?${searchParams.toString()}`);
    };

    const loadMore = async () => {
        setIsLoading(true);
        try {
            // Construct the URL with existing search params
            const params = new URLSearchParams(searchParams as Record<string, string>);
            params.set('skip', displayedCases.length.toString());
            params.set('limit', '10');

            const response = await fetch(`/api/cases?${params.toString()}`);
            const newCases = await response.json();

            setDisplayedCases(prev => [...prev, ...newCases]);
        } catch (error) {
            console.error('Error loading more cases:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get statistics
    const keyTopics = Array.from(new Set(
        initialCases.flatMap(c => c.analysis.keyTopics)
    )).sort();

    const topicCount = keyTopics.map(topic => ({
        name: topic,
        count: initialCases.filter(c => c.analysis.keyTopics.includes(topic)).length
    })).sort((a, b) => b.count - a.count);

    const years = Array.from(new Set(
        initialCases.map(c => parseInt(c.analysis.date.split(' ')[2] || '0'))
    )).sort((a, b) => b - a);

    const yearCount = years.map(year => ({
        year,
        count: initialCases.filter(c => c.analysis.date.includes(year.toString())).length
    }));

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 animate-[pulse_2s_ease-in-out_infinite] mb-6">
                        <IoScale className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 text-emerald-800">Legal Cases</h1>
                    <p className="text-gray-600">
                        Browse through New Zealand Human Rights Review Tribunal cases
                    </p>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <button
                        onClick={() => setIsStatsModalOpen(true)}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                                <IoStatsChart className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Cases</p>
                                <p className="text-2xl font-bold text-gray-900">{totalCases}</p>
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => setIsStatsModalOpen(true)}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                                <IoList className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => setIsStatsModalOpen(true)}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                                <IoTime className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Latest Year</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.max(...years)}
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Stats Modal */}
                <dialog
                    id="stats_modal"
                    className={`modal ${isStatsModalOpen ? 'modal-open' : ''}`}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsStatsModalOpen(false);
                    }}
                >
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-2xl mb-6 text-emerald-800">Detailed Statistics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Categories Section */}
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Categories</h4>
                                <CategoriesList
                                    categories={categories}
                                    variant="main"
                                    initialDisplayCount={10}
                                />
                            </div>

                            {/* Key Topics Section */}
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Key Topics</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {topicCount.map(({ name, count }) => (
                                        <div key={name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-gray-700">{name}</span>
                                            <span className="font-medium text-emerald-600">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="md:col-span-2">
                                <h4 className="font-semibold text-lg mb-4">Cases by Year</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {yearCount.map(({ year, count }) => (
                                        <div key={year} className="p-3 bg-gray-50 rounded text-center">
                                            <div className="text-lg font-medium text-emerald-600">{count}</div>
                                            <div className="text-sm text-gray-600">{year}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsStatsModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="q"
                                placeholder="Search cases..."
                                defaultValue={params.get('q') || ''}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <select
                            name="category"
                            defaultValue={params.get('category') || ''}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.name} value={category.name}>
                                    {category.name.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="date"
                            placeholder="Filter by year..."
                            defaultValue={params.get('date') || ''}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {displayedCases.map((caseItem, index) => (
                        <div
                            key={`${caseItem.documentId}-${index}`}
                            className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_30px_-12px_rgba(0,0,0,0.15)] transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                                            <IoScale className="h-5 w-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {caseItem.analysis.title}
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                {caseItem.analysis.date} - {caseItem.analysis.tribunal}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-gray-600">
                                    {caseItem.analysis.summary}
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Topics</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {caseItem.analysis.keyTopics.map((topic, i) => (
                                                <span key={`${caseItem.documentId}-topic-${i}`} className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {caseItem.analysis.categories?.map((category, i) => (
                                                <span key={`${caseItem.documentId}-category-${i}`} className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                                                    {category.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {caseItem.analysis.decision && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Decision</h3>
                                        <p className="text-gray-600">{caseItem.analysis.decision.outcome}</p>
                                    </div>
                                )}

                                <div className="flex justify-end items-center gap-4 mt-6">
                                    <Link
                                        href={`/law/cases/${caseItem.documentId}`}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                    >
                                        View Detailed Analysis
                                    </Link>
                                    <a
                                        href={caseItem.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        Read Full Case
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {displayedCases.length < totalCases && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={isLoading}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : `Show More (${totalCases - displayedCases.length} remaining)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// This is the main component that wraps CasesListContent in Suspense
export default function CasesList(props: CasesListProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen p-4 md:p-8 flex justify-center items-center">
                <div className="animate-pulse text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-6">
                        <IoScale className="w-8 h-8 text-emerald-500 opacity-50" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 text-emerald-800 opacity-50">Loading cases...</h1>
                </div>
            </div>
        }>
            <CasesListContent {...props} />
        </Suspense>
    );
}
