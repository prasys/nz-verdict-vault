import { IoArrowForward, IoCalendarOutline, IoScaleOutline } from 'react-icons/io5';
import Link from 'next/link';

interface CaseCardProps {
    documentId: string;
    title: string;
    date: string;
    tribunal: string;
    summary: string;
    relevance?: string;
    decision?: {
        outcome: string;
        reasoning?: string;
        implications?: string[];
    };
    keyIssues?: string[];
    keyPrinciples?: string[];
}

export function CaseCard({
    documentId,
    title,
    date,
    tribunal,
    summary,
    relevance,
    decision,
    keyIssues,
    keyPrinciples,
}: CaseCardProps) {
    return (
        <div className="bg-white my-10 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <IoCalendarOutline className="h-4 w-4" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <IoScaleOutline className="h-4 w-4" />
                            <span>{tribunal}</span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <p className="text-gray-700">{summary}</p>

                {/* Relevance */}
                {relevance && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-md p-4">
                        <p className="text-emerald-700 text-sm">{relevance}</p>
                    </div>
                )}

                {/* Decision */}
                {decision && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Decision</h4>
                        <p className="text-gray-700 text-sm bg-red-200 border font-bold border-red-300 inline-block text-red-700 rounded-full p-2">{decision.outcome}</p>
                    </div>
                )}

                {/* Key Issues */}
                {keyIssues && keyIssues.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Key Issues</h4>
                        <div className="flex flex-wrap gap-2">
                            {keyIssues.map((issue, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                >
                                    {issue}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Key Principles */}
                {keyPrinciples && keyPrinciples.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Key Principles</h4>
                        <div className="flex flex-wrap gap-2">
                            {keyPrinciples.map((principle, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100"
                                >
                                    {principle}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* View Full Case Link */}
                <Link
                    href={`/law/cases/${documentId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors mt-4"
                >
                    View Full Case Analysis
                    <IoArrowForward className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
} 