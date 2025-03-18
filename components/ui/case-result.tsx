import React from 'react';
import { CaseCard } from './case-card';
import { AnimateFadeUp, AnimateFadeIn } from '@/components/shared/animations';

interface LegalSearchResult {
    documentId: string;
    similarity: number;
    relevance: string;
    analysis: {
        title: string;
        date: string;
        tribunal: string;
        summary: string;
        keyTopics: string[];
        categories?: string[];
        decision?: {
            outcome: string;
            reasoning?: string;
            implications?: string[];
        };
        keyPrinciples?: string[];
    };
    caseDetails?: {
        background: {
            context?: string;
            keyIssues?: string[];
            preEvents?: Array<{
                date: string;
                description: string;
                significance?: string;
            }>;
        };
    };
}

interface CaseResultProps {
    result: LegalSearchResult;
    isMainResult?: boolean;
    showSummary?: boolean;
}

export const CaseResult: React.FC<CaseResultProps> = ({ result, isMainResult, showSummary = true }) => {
    return (
        <AnimateFadeUp delay={isMainResult ? 0 : 0.2}>
            <div className="space-y-4 mb-10">
                {isMainResult && showSummary && (
                    <AnimateFadeIn delay={0.1}>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">{result.analysis.title}</h2>
                            <div className="mt-2 text-gray-600">
                                <p><strong>Date:</strong> {result.analysis.date}</p>
                                <p><strong>Tribunal:</strong> {result.analysis.tribunal}</p>
                                <p><strong>Decision:</strong> {result.analysis.decision?.outcome}</p>
                            </div>
                        </div>
                    </AnimateFadeIn>
                )}

                <AnimateFadeIn delay={0.2}>
                    <CaseCard
                        documentId={result.documentId}
                        title={result.analysis.title}
                        date={result.analysis.date}
                        tribunal={result.analysis.tribunal}
                        summary={result.analysis.summary}
                        decision={{
                            outcome: result.analysis.decision?.outcome || '',
                            reasoning: result.analysis.decision?.reasoning || '',
                            implications: result.analysis.decision?.implications || []
                        }}
                        keyIssues={result.caseDetails?.background?.keyIssues || []}
                        keyPrinciples={result.analysis.keyPrinciples || []}
                    />
                </AnimateFadeIn>

                {result.relevance && (
                    <AnimateFadeIn delay={0.3}>
                        <div className="mt-2 text-emerald-700">
                            <p>{result.relevance}</p>
                        </div>
                    </AnimateFadeIn>
                )}
            </div>
        </AnimateFadeUp>
    );
}; 