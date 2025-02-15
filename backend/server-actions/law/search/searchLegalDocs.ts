'use server';

import { LegalDocumentSummary } from '../types';
import legalSummaries from '@/data/legal-summaries.json';
import embeddedSummaries from '@/data/embedded-summaries.json';

interface EmbeddedSummary {
    documentId: string;
    combinedText: string;
    embedding: number[];
}

export async function searchLegalDocuments(query: string): Promise<LegalDocumentSummary[]> {
    console.log('Searching for:', query);

    // For now, do a simple text search
    // TODO: Implement vector similarity search using embeddings
    const searchTerms = query.toLowerCase().split(' ');

    const results = legalSummaries
        .filter(doc => {
            const searchText = [
                doc.analysis.title,
                doc.analysis.summary,
                ...doc.analysis.keyTopics,
                doc.caseDetails.background.context
            ].join(' ').toLowerCase();

            return searchTerms.some(term => searchText.includes(term));
        })
        .map(doc => {
            // Find corresponding embedding
            const embeddedDoc = embeddedSummaries.find(
                e => e.documentId === doc.documentId
            ) as EmbeddedSummary;

            // Calculate simple relevance score based on term frequency
            const relevanceScore = searchTerms.reduce((score, term) => {
                const termFrequency = (embeddedDoc?.combinedText.toLowerCase().match(new RegExp(term, 'g')) || []).length;
                return score + termFrequency;
            }, 0);

            // Create highlighted text snippet
            const highlightedText = embeddedDoc?.combinedText
                .split('\n')
                .find(line =>
                    searchTerms.some(term =>
                        line.toLowerCase().includes(term)
                    )
                ) || '';

            return {
                ...doc,
                relevanceScore,
                highlightedText
            };
        })
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return results;
} 