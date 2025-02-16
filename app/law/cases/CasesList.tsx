import { LegalDocumentSummary } from '@/backend/server-actions/law/types';
import Link from 'next/link';
import { IoScale } from 'react-icons/io5';

interface CasesListProps {
    cases: LegalDocumentSummary[];
}

export default function CasesList({ cases }: CasesListProps) {
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

                <div className="space-y-6">
                    {cases.map((caseItem, index) => (
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
            </div>
        </div>
    );
} 