'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';
import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '../types';

if (!process.env.OPENAI_API_KEY2) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY2
});

interface EmbeddedDocument extends LegalDocumentSummary {
    embedding: number[];
    combinedText: string; // Text that was embedded
}

export async function embedLegalSummaries() {
    // Read the summaries file
    const summariesPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
    const summariesJson = await fs.readFile(summariesPath, 'utf-8');
    const summaries: LegalDocumentSummary[] = JSON.parse(summariesJson);

    // Prepare text for embedding
    const documentsToEmbed = summaries.map(summary => {
        // Combine relevant fields into a single text for embedding
        const combinedText = `
            Title: ${summary.analysis.title}
            Summary: ${summary.analysis.summary}
            Topics: ${summary.analysis.keyTopics.join(', ')}
            Decision: ${summary.analysis.decision.outcome}
            Principles: ${summary.analysis.keyPrinciples.join(', ')}
            Categories: ${summary.analysis.categories.join(', ')}
        `.trim();

        return {
            ...summary,
            combinedText
        };
    });

    // Generate embeddings
    const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: documentsToEmbed.map(doc => doc.combinedText),
    });

    // Combine summaries with their embeddings
    const embeddedDocuments: EmbeddedDocument[] = documentsToEmbed.map((doc, i) => ({
        ...doc,
        embedding: embeddings[i],
    }));

    // Save embedded documents
    const outputPath = path.join(process.cwd(), 'data', 'embedded-summaries.json');
    await fs.writeFile(outputPath, JSON.stringify(embeddedDocuments, null, 2));

    return embeddedDocuments;
}

export async function searchLegalDocuments(query: string) {
    // Read embedded documents
    const embeddedPath = path.join(process.cwd(), 'data', 'embedded-summaries.json');
    const embeddedJson = await fs.readFile(embeddedPath, 'utf-8');
    const documents: EmbeddedDocument[] = JSON.parse(embeddedJson);

    // Generate embedding for query
    const { embedding: queryEmbedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: query,
    });

    // Calculate similarities and rank results
    const results = documents
        .map(doc => {
            const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
            return { ...doc, similarity };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10); // Get top 5 results

    return results;
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
} 