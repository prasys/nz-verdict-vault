'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { cosineSimilarity, embed, embedMany, generateText } from 'ai';
import { scrapeLegalDocs } from '../scraping/scrapeLegalDocs';
import { AI_CONFIG } from '@/lib/config';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = createOpenAI({
    apiKey: AI_CONFIG.OPENAI_API_KEY,
    baseURL: AI_CONFIG.OPENAI_BASE_URL
});

export async function analyzeLegalDocsWithEmbeddings(query: string) {
    try {
        // Pre-process the query to make it more detailed
        const { text: enhancedQuery } = await generateText({
            model: openai(AI_CONFIG.CHAT_MODEL),
            prompt: `You are a legal research assistant. Convert this user query into a more detailed and specific question that will help find relevant legal documents. Consider both direct and indirect relationships to the topic.

Original query: "${query}"

Instructions:
1. Identify key legal concepts and related terms
2. Include alternative phrasings
3. Consider property rights, contracts, disputes if relevant
4. Add relevant legal terminology

Enhanced query:`,
        });

        // Fetch and process the legal documents
        const { documents } = await scrapeLegalDocs();
        const chunks = documents.map(doc => doc.text);

        // Create embeddings for all chunks
        const { embeddings } = await embedMany({
            model: openai.embedding('text-embedding-3-small'),
            values: chunks,
        });

        // Create in-memory database with document metadata
        const db = embeddings.map((embedding, i) => ({
            embedding,
            value: chunks[i],
            metadata: {
                url: documents[i].url,
                doc_id: documents[i].doc_id,
                chunk_id: documents[i].chunk_id
            }
        }));

        // Create embedding for the enhanced query
        const { embedding: queryEmbedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: enhancedQuery,
        });

        // Find most relevant context with similarity scores
        const matches = db
            .map(item => ({
                text: item.value,
                embedding: item.embedding,
                similarity: cosineSimilarity(queryEmbedding, item.embedding),
                metadata: item.metadata
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        const context = matches.map(m => m.text).join('\n\n');

        // Generate main answer with better fallback handling
        const { text: answer } = await generateText({
            model: openai('gpt-4o-mini'),
            prompt: `You are a legal assistant analyzing New Zealand Human Rights Review Tribunal cases. Answer the following question based on the provided legal context.

Context:
${context}

Question: ${query}

Instructions:
1. If the context contains directly relevant information, provide a detailed answer
2. If the context contains indirectly relevant information (e.g., related legal principles, similar cases, or relevant procedures), explain how it might be applicable
3. If no relevant information is found, suggest:
   - Related legal areas to explore
   - Alternative search terms
   - Other potential legal resources
   
Your response should be helpful even when exact matches aren't found.`,
        });

        // Generate enhanced summary of document relevance
        const { text: summary } = await generateText({
            model: openai(AI_CONFIG.CHAT_MODEL),
            prompt: `You are a legal research assistant. Analyze these search results and provide a detailed summary of their relevance to the query.
                     
Query: "${query}"
Enhanced Query: "${enhancedQuery}"

Documents found (with similarity scores):
${matches.map(m => `- Document ${m.metadata.doc_id} (${(m.similarity * 100).toFixed(1)}% similar)`).join('\n')}

Please analyze:
1. Direct Relevance: [Explain any directly relevant findings]
2. Indirect Relevance: [Identify related legal principles or procedures]
3. Knowledge Gaps: [Identify what information is missing]

Format your response like this:

"Based on the search results: [Key findings and their relevance]

Related findings: [Indirect connections or potentially useful information]

Note: [Important context about limitations or suggestions for better results]"`,
        });

        return {
            answer,
            summary,
            enhancedQuery,
            relevantContext: context,
            matches: matches,
        };
    } catch (error) {
        console.error('Error in legal embedding analysis:', error);
        throw error;
    }
} 