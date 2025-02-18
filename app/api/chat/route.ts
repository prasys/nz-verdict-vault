import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { searchLegalDocuments } from '@/backend/server-actions/law/embedding/embedLegalSummaries';
import { LEGAL_ASSISTANT_SYSTEM_MESSAGE } from '@/lib/ai/system-messages';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('Incoming messages:', messages);

    // Add system message to the start of the messages array
    const messagesWithSystem = [
      { role: 'system', content: LEGAL_ASSISTANT_SYSTEM_MESSAGE },
      ...messages
    ];

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: messagesWithSystem,
      tools: {
        legalSearch: tool({
          description: 'Search through legal documents using natural language queries and semantic embeddings. Use this to find relevant cases and then provide a natural language response incorporating the findings.',
          parameters: z.object({
            query: z.string().describe('The search query to find relevant legal documents'),
          }),
          execute: async ({ query }) => {
            console.log('Executing legal search with query:', query);
            try {
              const results = await searchLegalDocuments(query);
              console.log('Search results:', results); // Debug log

              if (!results || !Array.isArray(results)) {
                console.log('No results found or invalid format'); // Debug log
                return {
                  results: [],
                  suggestedResponse: "I couldn't find any relevant cases matching your query.\n[Debug: No results found]"
                };
              }

              // Get top 5 most relevant results
              const topResults = results.slice(0, 5).map(result => ({
                documentId: result.documentId,
                similarity: result.similarity || 0,
                analysis: {
                  title: result.analysis.title,
                  date: result.analysis.date,
                  tribunal: result.analysis.tribunal,
                  summary: result.analysis.summary,
                  keyTopics: result.analysis.keyTopics,
                  categories: result.analysis.categories,
                  decision: result.analysis.decision,
                  keyPrinciples: result.analysis.keyPrinciples
                },
                caseDetails: result.caseDetails ? {
                  background: {
                    context: result.caseDetails.background.context,
                    keyIssues: result.caseDetails.background.keyIssues,
                    preEvents: result.caseDetails.background.preEvents
                  },
                  proceedings: result.caseDetails.proceedings,
                  analysis: result.caseDetails.analysis,
                  impact: result.caseDetails.impact,
                  relatedCases: result.caseDetails.relatedCases
                } : undefined,
                relevance: generateRelevanceExplanation(result, query)
              }));

              console.log('Processed top results:', topResults); // Debug log

              interface LegalDocument {
                analysis: {
                  title: string;
                  summary: string;
                  keyTopics: string[];
                  keyPrinciples?: string[];
                  decision?: {
                    outcome: string;
                  };
                };
                similarity: number;
              }

              function generateRelevanceExplanation(result: LegalDocument, query: string): string {
                const matchTypes = [];

                // Check for direct matches in title
                if (result.analysis.title.toLowerCase().includes(query.toLowerCase())) {
                  matchTypes.push('directly addresses');
                }

                // Check for matches in key topics
                if (result.analysis.keyTopics.some((topic: string) =>
                  topic.toLowerCase().includes(query.toLowerCase()))) {
                  matchTypes.push('covers key topics related to');
                }

                // Check for matches in summary
                if (result.analysis.summary.toLowerCase().includes(query.toLowerCase())) {
                  matchTypes.push('contains relevant discussion about');
                }

                // Check for matches in key principles
                if (result.analysis.keyPrinciples?.some((principle: string) =>
                  principle.toLowerCase().includes(query.toLowerCase()))) {
                  matchTypes.push('establishes principles concerning');
                }

                let relevance = matchTypes.length > 0
                  ? `This case ${matchTypes[0]} ${query}.`
                  : `This case provides important legal principles that may apply to your query about ${query}.`;

                if (result.analysis.decision?.outcome) {
                  relevance += ` The decision ${result.analysis.decision.outcome.toLowerCase()}.`;
                }

                return relevance;
              }

              // Create suggested response in MDX format
              const suggestedResponse = topResults.length > 0
                ? `# Search Results\n\nI found ${topResults.length} relevant cases that might help answer your query about "${query}". Here's what I found:\n\n## Most Relevant Case: ${topResults[0].analysis.title}\n\n${topResults[0].relevance}\n\n${topResults[0].analysis.summary}\n\n${topResults[0].analysis.decision ? `**Decision**: ${topResults[0].analysis.decision.outcome}\n\n` : ''}${topResults.length > 1 ? `I've also found ${topResults.length - 1} other relevant cases that provide additional context and legal principles. Each case below offers different insights into your query.` : ''}`
                : "# No Results Found\n\nI couldn't find any cases that directly match your query. You might want to try rephrasing your search or exploring related legal topics.";

              const response = {
                results: topResults,
                suggestedResponse
              };

              console.log('Returning response:', response); // Debug log
              return {
                tool_results: response,
                content: suggestedResponse
              };
            } catch (error) {
              console.error('Error executing legal search:', error);
              return {
                tool_results: {
                  results: [],
                  suggestedResponse: `# Error\n\n[Debug: Error - ${error instanceof Error ? error.message : 'Unknown error'}]\n\nI encountered an error while searching for relevant cases.`
                },
                content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
              };
            }
          },
        }),
      },
    });

    const response = result.toDataStreamResponse();
    console.log('Final response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}