import { IoScale, IoCalendarOutline, IoDocumentTextOutline, IoBookmarkOutline } from 'react-icons/io5';
import Link from 'next/link';

interface CaseCardProps {
    title: string;
    date: string;
    tribunal: string;
    summary: string;
    documentId: string;
    relevance?: string;
    decision?: {
        outcome: string;
    };
    keyIssues?: string[];
    keyPrinciples?: string[];
}

export function CaseCard({
    title,
    date,
    tribunal,
    summary,
    documentId,
    relevance,
    decision,
    keyIssues,
    keyPrinciples
}: CaseCardProps) {
    return (
        <div className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_30px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                            <IoScale className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <Link href={`/law/cases/${documentId}`} className="group">
                                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                    {title}
                                </h2>
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <IoCalendarOutline className="h-4 w-4" />
                                    {date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <IoDocumentTextOutline className="h-4 w-4" />
                                    {tribunal}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {relevance && (
                    <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-md border border-emerald-100">
                        {relevance}
                    </div>
                )}

                <p className="mt-4 text-gray-600">
                    {summary}
                </p>

                {(keyIssues || keyPrinciples) && (
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        {keyIssues && keyIssues.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Issues</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {keyIssues.map((issue, i) => (
                                        <li key={i} className="text-gray-600 text-sm">{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {keyPrinciples && keyPrinciples.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Principles</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {keyPrinciples.map((principle, i) => (
                                        <li key={i} className="text-gray-600 text-sm">{principle}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {decision && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <h4 className="text-sm font-semibold text-amber-800 mb-2">Decision</h4>
                        <p className="text-gray-600">{decision.outcome}</p>
                    </div>
                )}

                <div className="flex justify-end items-center gap-4 mt-6">
                    <Link
                        href={`/law/cases/${documentId}`}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <IoBookmarkOutline className="h-4 w-4" />
                        View Detailed Analysis
                    </Link>
                </div>
            </div>
        </div>
    );
} 