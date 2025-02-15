'use client';

import { useState } from 'react';
import { IoScale } from 'react-icons/io5';
import { scrapeLegalDocs } from '@/backend/server-actions/law/scraping/scrapeLegalDocs';

interface ScrapeResult {
    documents: Array<{
        url: string;
        doc_id: string;
        chunk_id: number;
        text: string;
    }>;
    totalDocuments: number;
    totalChunks: number;
}

export default function LawPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ScrapeResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await scrapeLegalDocs();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to scrape documents');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white backdrop-blur-lg rounded-lg p-8">
                <div className="text-center mb-8">
                    <IoScale className="w-12 h-12 m-5 p-2 bg-sky-500/80 text-white rounded-full mx-auto mb-2" />
                    <h1 className="text-3xl font-bold mb-2">Legal Document Scraper</h1>
                    <p className="text-base-content/70">
                        Scrape and analyze legal documents from NZHRRT
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <button
                        onClick={handleScrape}
                        disabled={isLoading}
                        className={`${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white px-6 py-3 rounded-lg transition-colors`}
                    >
                        {isLoading ? 'Scraping...' : 'Start Scraping'}
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error mb-8">
                        <p>{error}</p>
                    </div>
                )}

                {result && (
                    <div className="space-y-8">
                        <div className="stats shadow w-full">
                            <div className="stat">
                                <div className="stat-title">Total Documents</div>
                                <div className="stat-value">{result.totalDocuments}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Total Chunks</div>
                                <div className="stat-value">{result.totalChunks}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Document Chunks</h2>
                            <div className="overflow-auto max-h-[600px]">
                                {result.documents.map((doc) => (
                                    <div
                                        key={`${doc.doc_id}-${doc.chunk_id}`}
                                        className="card bg-base-200 mb-4"
                                    >
                                        <div className="card-body">
                                            <h3 className="card-title text-sm">
                                                Document: {doc.doc_id} (Chunk {doc.chunk_id})
                                            </h3>
                                            <p className="whitespace-pre-wrap text-sm">
                                                {doc.text}
                                            </p>
                                            <div className="card-actions justify-end">
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link link-primary text-xs"
                                                >
                                                    View Source
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 