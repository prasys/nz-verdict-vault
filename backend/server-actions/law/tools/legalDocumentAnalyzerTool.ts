'use server';

import { tool } from 'ai';
import { z } from 'zod';

const LegalDocumentSummarySchema = z.object({
    documentId: z.string(),
    url: z.string(),
    analysis: z.object({
        title: z.string(),
        date: z.string(),
        tribunal: z.string(),
        summary: z.string(),
        keyTopics: z.array(z.string()),
        decision: z.object({
            outcome: z.string(),
            reasoning: z.string(),
            implications: z.array(z.string())
        }),
        parties: z.object({
            applicant: z.string(),
            respondent: z.string(),
            otherParties: z.array(z.string()).optional()
        }),
        keyPrinciples: z.array(z.string()),
        relevantLegislation: z.array(z.string()),
        categories: z.array(z.string())
    })
});

export async function getLegalDocumentAnalyzerTool() {
    return tool({
        description: 'Analyze and summarize legal documents with structured output including key decisions, topics, and implications',
        parameters: LegalDocumentSummarySchema,
        execute: async (args: z.infer<typeof LegalDocumentSummarySchema>) => {
            console.log('📚 Legal Document Analysis Tool Called:', { documentId: args.documentId, url: args.url });
            return args;
        }
    });
} 