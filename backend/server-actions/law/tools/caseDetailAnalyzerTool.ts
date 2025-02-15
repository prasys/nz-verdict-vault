'use server';

import { tool } from 'ai';
import { z } from 'zod';

export async function getCaseDetailAnalyzerTool() {
    return tool({
        description: 'Analyze legal cases in detail, providing comprehensive background, events, and analysis',
        parameters: z.object({
            documentId: z.string()
                .describe('The ID/reference of the legal document'),
            caseDetails: z.object({
                background: z.object({
                    context: z.string()
                        .describe('Detailed background context of the case'),
                    preEvents: z.array(z.object({
                        date: z.string(),
                        description: z.string(),
                        significance: z.string()
                    }))
                        .describe('Events leading up to the case'),
                    keyIssues: z.array(z.string())
                        .describe('Main issues to be resolved'),
                }),
                proceedings: z.object({
                    timeline: z.array(z.object({
                        date: z.string(),
                        event: z.string(),
                        details: z.string(),
                        significance: z.string().optional()
                    }))
                        .describe('Chronological timeline of the case proceedings'),
                    evidence: z.array(z.object({
                        type: z.string(),
                        description: z.string(),
                        significance: z.string()
                    }))
                        .describe('Key evidence presented'),
                    arguments: z.object({
                        applicant: z.array(z.string()),
                        respondent: z.array(z.string())
                    })
                        .describe('Main arguments from each party'),
                }),
                analysis: z.object({
                    legalPrinciples: z.array(z.object({
                        principle: z.string(),
                        application: z.string(),
                        impact: z.string()
                    }))
                        .describe('Legal principles applied and their significance'),
                    keyFindings: z.array(z.object({
                        finding: z.string(),
                        reasoning: z.string(),
                        implications: z.array(z.string())
                    }))
                        .describe('Important findings and their implications'),
                    precedentValue: z.string()
                        .describe('Value of the case as legal precedent'),
                }),
                impact: z.object({
                    immediate: z.array(z.string())
                        .describe('Immediate effects of the decision'),
                    longTerm: z.array(z.string())
                        .describe('Long-term implications'),
                    societalImpact: z.string()
                        .describe('Broader societal implications'),
                    recommendations: z.array(z.string())
                        .optional()
                        .describe('Any recommendations made by the tribunal'),
                }),
                relatedCases: z.array(z.object({
                    citation: z.string(),
                    relevance: z.string(),
                    distinction: z.string().optional()
                }))
                    .describe('Related cases and their relevance'),
            })
        }),
        execute: async ({ documentId, caseDetails }) => {
            console.log('📚 Case Detail Analysis Tool Called:', { documentId });
            return { documentId, caseDetails };
        }
    });
} 