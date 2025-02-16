import { LegalDocumentSummary } from '@/backend/server-actions/law/types';
import { IoScale } from 'react-icons/io5';
import Link from 'next/link';

function CaseNotFound() {
    return (
        <div className="min-h-screen p-8 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Case Not Found</h1>
                <Link href="/law/search" className="btn btn-primary">
                    Back to Search
                </Link>
            </div>
        </div>
    );
}

export function CaseDetailView({ caseData }: { caseData: LegalDocumentSummary }) {
    if (!caseData) return <CaseNotFound />;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <IoScale className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h1 className="text-3xl font-bold mb-2">{caseData.analysis.title}</h1>
                    <p className="text-base-content/70">{caseData.analysis.date} - {caseData.analysis.tribunal}</p>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Summary Card */}
                    <section className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-4xl mx-auto p-6">
                        <button className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white">
                            ×
                        </button>
                        <div className="header p-5">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 animate-[pulse_2s_ease-in-out_infinite]">
                                <IoScale className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div className="mt-3 text-center">
                                <h2 className="text-emerald-800 text-lg font-semibold">Case Summary</h2>
                                <p className="mt-2 text-gray-600 text-sm text-start">{caseData.analysis.summary}</p>
                                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                    {caseData.analysis.keyTopics.map((topic, i) => (
                                        <span key={i} className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-md">{topic}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <button className="w-full rounded-md bg-emerald-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-emerald-700 transition-colors">
                                    View Full Details
                                </button>
                                <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors">
                                    Download Summary
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Background Section */}
                    <section className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-4xl mx-auto p-6">
                        <div className="header p-5">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 animate-[pulse_2s_ease-in-out_infinite]">
                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-blue-800 text-lg font-semibold text-center">Background</h2>
                                <p className="mt-2 text-gray-600">
                                    {caseData.caseDetails?.background.context || caseData.analysis.summary}
                                </p>

                                {caseData.caseDetails?.background.preEvents && (
                                    <>
                                        <h3 className="font-semibold mb-2 mt-4">Key Events Leading to the Case</h3>
                                        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                                            {caseData.caseDetails.background.preEvents.map((event, i) => (
                                                <li key={i}>
                                                    <hr />
                                                    <div className="timeline-middle">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className={`timeline-${i % 2 === 0 ? 'start' : 'end'} md:mb-10 ${i % 2 === 0 ? 'md:text-end' : ''}`}>
                                                        <time className="font-mono italic text-primary">{event.date}</time>
                                                        <div className="text-lg font-black">{event.description}</div>
                                                        {event.significance && (
                                                            <div className="text-base-content/70">{event.significance}</div>
                                                        )}
                                                    </div>
                                                    <hr />
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {(caseData.caseDetails?.background.keyIssues || !caseData.caseDetails) && (
                                    <>
                                        <h3 className="font-semibold mt-4 mb-2">Key Issues</h3>
                                        <ul className="list-disc list-inside">
                                            {caseData.caseDetails?.background.keyIssues ? (
                                                caseData.caseDetails.background.keyIssues.map((issue, i) => (
                                                    <li key={i} className="text-gray-600">{issue}</li>
                                                ))
                                            ) : (
                                                <>
                                                    <li className="text-gray-600">Whether Mr. McKee&apos;s comments about Mr. Singh&apos;s Indian accent constituted racial harassment</li>
                                                    <li className="text-gray-600">Impact of insisting Indian staff speak English in the workplace</li>
                                                    <li className="text-gray-600">Whether the behavior created a hostile work environment</li>
                                                    <li className="text-gray-600">Appropriate damages for humiliation, loss of dignity, and injury to feelings</li>
                                                </>
                                            )}
                                        </ul>
                                    </>
                                )}

                                {!caseData.caseDetails && caseData.analysis.keyPrinciples && (
                                    <>
                                        <h3 className="font-semibold mt-4 mb-2">Key Principles</h3>
                                        <ul className="list-disc list-inside">
                                            {caseData.analysis.keyPrinciples.map((principle, i) => (
                                                <li key={i} className="text-gray-600">{principle}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Proceedings Section */}
                    {caseData.caseDetails?.proceedings && (
                        <section className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-4xl mx-auto p-6">
                            <div className="header p-5">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 animate-[pulse_2s_ease-in-out_infinite]">
                                    <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <div className="mt-3">
                                    <h2 className="text-purple-800 text-lg font-semibold text-center">Proceedings</h2>

                                    {caseData.caseDetails.proceedings.timeline && (
                                        <div className="mt-4">
                                            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                                                {caseData.caseDetails.proceedings.timeline.map((item, i) => (
                                                    <li key={i}>
                                                        <hr />
                                                        <div className="timeline-middle">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className={`timeline-${i % 2 === 0 ? 'start' : 'end'} md:mb-10 ${i % 2 === 0 ? 'md:text-end' : ''}`}>
                                                            <time className="font-mono italic text-primary">{item.date}</time>
                                                            <div className="text-lg font-black">{item.event}</div>
                                                            <div className="text-base">{item.details}</div>
                                                            {item.significance && (
                                                                <div className="text-base-content/70">{item.significance}</div>
                                                            )}
                                                        </div>
                                                        <hr />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {caseData.caseDetails.proceedings.evidence && caseData.caseDetails.proceedings.evidence.length > 0 && (
                                        <>
                                            <h3 className="font-semibold mt-6 mb-3 text-purple-700">Evidence Presented</h3>
                                            <div className="grid gap-4">
                                                {caseData.caseDetails.proceedings.evidence.map((item, i) => (
                                                    <div key={i} className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                                                        <h4 className="font-medium text-purple-800">{item.type}</h4>
                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                        <p className="mt-1 text-sm text-purple-600">{item.significance}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {caseData.caseDetails.proceedings.arguments && (
                                        <>
                                            <h3 className="font-semibold mt-6 mb-3 text-purple-700">Arguments</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {caseData.caseDetails.proceedings.arguments.applicant && (
                                                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                                                        <h4 className="font-medium text-purple-800 mb-2">Applicant&apos;s Arguments</h4>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {caseData.caseDetails.proceedings.arguments.applicant.map((arg, i) => (
                                                                <li key={i} className="text-gray-600">{arg}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {caseData.caseDetails.proceedings.arguments.respondent && (
                                                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                                                        <h4 className="font-medium text-purple-800 mb-2">Respondent&apos;s Arguments</h4>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {caseData.caseDetails.proceedings.arguments.respondent.map((arg, i) => (
                                                                <li key={i} className="text-gray-600">{arg}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Analysis & Impact Section */}
                    {(caseData.caseDetails?.analysis || caseData.analysis.decision) && (
                        <section className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-4xl mx-auto p-6">
                            <div className="header p-5">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 animate-[pulse_2s_ease-in-out_infinite]">
                                    <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div className="mt-3">
                                    <h2 className="text-amber-800 text-lg font-semibold text-center">Analysis & Impact</h2>

                                    {caseData.analysis.decision && (
                                        <>
                                            <h3 className="font-semibold mt-6 mb-3 text-amber-700">Decision</h3>
                                            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                                                <h4 className="font-medium text-amber-800">Outcome</h4>
                                                <p className="mt-1 text-gray-600">{caseData.analysis.decision.outcome}</p>
                                                {caseData.analysis.decision.reasoning && (
                                                    <>
                                                        <h4 className="font-medium text-amber-800 mt-4">Reasoning</h4>
                                                        <p className="mt-1 text-gray-600">{caseData.analysis.decision.reasoning}</p>
                                                    </>
                                                )}
                                                {caseData.analysis.decision.implications && (
                                                    <>
                                                        <h4 className="font-medium text-amber-800 mt-4">Implications</h4>
                                                        <ul className="list-disc list-inside mt-2">
                                                            {caseData.analysis.decision.implications.map((implication, i) => (
                                                                <li key={i} className="text-gray-600">{implication}</li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {caseData.caseDetails?.analysis?.legalPrinciples && (
                                        <>
                                            <h3 className="font-semibold mt-6 mb-3 text-amber-700">Legal Principles</h3>
                                            <div className="grid gap-4">
                                                {caseData.caseDetails.analysis.legalPrinciples.map((principle, i) => (
                                                    <div key={i} className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                                                        <h4 className="font-medium text-amber-800">{principle.principle}</h4>
                                                        <p className="mt-1 text-gray-600">{principle.application}</p>
                                                        <p className="mt-1 text-sm text-amber-600">{principle.impact}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {caseData.caseDetails?.impact && (
                                        <div className="mt-6 space-y-4">
                                            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                                                <h3 className="font-semibold text-amber-800 mb-3">Impact</h3>
                                                <div className="space-y-4">
                                                    {caseData.caseDetails.impact.immediate && caseData.caseDetails.impact.immediate.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium text-amber-700">Immediate Effects</h4>
                                                            <ul className="list-disc list-inside mt-2 space-y-1">
                                                                {caseData.caseDetails.impact.immediate.map((effect, i) => (
                                                                    <li key={i} className="text-gray-600">{effect}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {caseData.caseDetails.impact.longTerm && caseData.caseDetails.impact.longTerm.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium text-amber-700">Long-term Implications</h4>
                                                            <ul className="list-disc list-inside mt-2 space-y-1">
                                                                {caseData.caseDetails.impact.longTerm.map((effect, i) => (
                                                                    <li key={i} className="text-gray-600">{effect}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Related Cases Section */}
                    {caseData.caseDetails?.relatedCases && caseData.caseDetails.relatedCases.length > 0 && (
                        <section className="relative overflow-hidden rounded-lg bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-4xl mx-auto p-6">
                            <div className="header p-5">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 animate-[pulse_2s_ease-in-out_infinite]">
                                    <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                </div>
                                <div className="mt-3">
                                    <h2 className="text-indigo-800 text-lg font-semibold text-center">Related Cases</h2>
                                    <div className="mt-4 grid gap-4">
                                        {caseData.caseDetails.relatedCases.map((case_, i) => (
                                            <div key={i} className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                                                <h3 className="font-medium text-indigo-800">{case_.citation}</h3>
                                                <p className="mt-1 text-gray-600">{case_.relevance}</p>
                                                {case_.distinction && (
                                                    <p className="mt-1 text-sm text-indigo-600">{case_.distinction}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-center mt-8 space-x-4">
                    <Link
                        href={caseData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                        Read Full Case
                    </Link>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium shadow-sm hover:bg-gray-50 transition-colors">
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
} 