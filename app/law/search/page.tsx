'use client';

import { useState } from 'react';
import { IoScale, IoSearch, IoBookmark } from 'react-icons/io5';
import { searchLegalDocuments } from '@/backend/server-actions/law/embedding/embedLegalSummaries';
import Link from 'next/link';

interface Analysis {
    title: string;
    date: string;
    tribunal: string;
    summary: string;
    keyTopics: string[];
    categories?: string[];
    decision?: {
        outcome: string;
    };
}

interface SearchResult {
    similarity: number;
    documentId: string;
    url: string;
    analysis: Analysis;
}

interface SearchResponse {
    similarity: number;
    documentId: string;
    url: string;
    analysis: Analysis;
}

const SUGGESTED_QUERIES = [
    "Privacy breaches in government departments",
    "Workplace sexual harassment cases",
    "Racial discrimination in employment",
    "Information request delays and privacy",
    "Strike out applications in discrimination cases",
    "Restaurant service discrimination",
    "Age discrimination in professional associations",
    "Privacy rights in law enforcement"
];

export default function LegalSearchPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const searchResults = await searchLegalDocuments(query) as SearchResponse[];
            console.log('Search Results:', searchResults); // Debug log
            const transformedResults: SearchResult[] = searchResults.map(result => ({
                similarity: result.similarity,
                documentId: result.documentId,
                url: result.url,
                analysis: result.analysis
            }));
            console.log('Transformed Results:', transformedResults); // Debug log
            setResults(transformedResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during search');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedQuery = (query: string) => {
        setQuery(query);
        searchLegalDocuments(query)
            .then(searchResults => {
                const transformedResults: SearchResult[] = searchResults.map(result => ({
                    similarity: result.similarity,
                    documentId: result.documentId,
                    url: result.url,
                    analysis: result.analysis
                }));
                setResults(transformedResults);
            })
            .catch(err => setError(err instanceof Error ? err.message : 'An error occurred during search'));
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 animate-[pulse_2s_ease-in-out_infinite] mb-6">
                        <IoScale className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 text-emerald-800">Legal Case Search</h1>
                    <p className="text-gray-600">
                        Search through New Zealand Human Rights Review Tribunal cases using AI
                    </p>
                </div>

                <form onSubmit={handleSearch} className="mb-12">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Describe the legal issue or topic..."
                            className="w-full px-6 py-4 text-lg rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`absolute right-2 px-6 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 ${isLoading ? 'opacity-70' : ''}`}
                            disabled={isLoading || !query.trim()}
                        >
                            {isLoading ? (
                                'Searching...'
                            ) : (
                                <>
                                    <IoSearch className="w-5 h-5" />
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mb-12">
                    <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-emerald-800">
                        <IoBookmark className="w-4 h-4" />
                        Suggested Searches
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_QUERIES.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestedQuery(suggestion)}
                                className="px-4 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 transition-colors border border-emerald-200"
                                disabled={isLoading}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="relative overflow-hidden rounded-lg bg-red-50 border border-red-200 p-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span className="text-red-800">{error}</span>
                        </div>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="space-y-6" key="search-results">
                        {results.map((result, index) => (
                            <div
                                key={`${result.documentId}-${index}`}
                                className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_30px_-12px_rgba(0,0,0,0.15)] transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                                                <IoScale className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {result.analysis.title}
                                            </h2>
                                        </div>
                                        <span className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-full font-medium">
                                            {(result.similarity * 100).toFixed(1)}% match
                                        </span>
                                    </div>

                                    <p className="mt-4 text-gray-600">
                                        {result.analysis.summary}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Topics</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {result.analysis.keyTopics.map((topic, i) => (
                                                    <span key={`${result.documentId}-topic-${i}`} className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {result.analysis.categories?.map((category, i) => (
                                                    <span key={`${result.documentId}-category-${i}`} className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                                                        {category.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {result.analysis.decision && (
                                        <div className="mt-6">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Decision</h3>
                                            <p className="text-gray-600">{result.analysis.decision.outcome}</p>
                                        </div>
                                    )}

                                    <div className="flex justify-end items-center gap-4 mt-6">
                                        <Link
                                            href={`/law/cases/${result.documentId}`}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                            onClick={() => console.log('Clicking link for document:', result.documentId)}
                                        >
                                            View Detailed Analysis
                                        </Link>
                                        <a
                                            href={result.url}
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
                )}

                {query && !isLoading && results.length === 0 && (
                    <div className="relative overflow-hidden rounded-lg bg-gray-50 border border-gray-200 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-medium">No matching cases found.</p>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 