'use server';

import { callOpenAi } from '../../services/ai';
import { getLegalDocumentAnalyzerTool } from '../tools/legalDocumentAnalyzerTool';
import { getCaseDetailAnalyzerTool } from '../tools/caseDetailAnalyzerTool';
import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '../types';

const SCRAPING_CONFIG = {
    baseUrl: "http://www.nzlii.org/nz/cases/NZHRRT/2024/",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "http://www.google.com"
    },
    relativeLinks: [
        "../2024/1.html",
        "../2024/2.html",
        "../2024/3.html",
        "../2024/4.html",
        "../2024/7.html",
        "../2024/8.html",
        "../2024/9.html",
        "../2024/10.html",
        "../2024/11.html",
        "../2024/12.html",
        "../2024/13.html",
        "../2024/15.html",
        "../2024/16.html",
        "../2024/17.html",
        "../2024/19.html",
        "../2024/20.html",
        "../2024/21.html",
        "../2024/22.html",
        "../2024/24.html",
        "../2024/25.html",
        "../2024/26.html",
        "../2024/28.html",
        "../2024/37.html",
        "../2024/38.html",
        "../2024/39.html",
        "../2024/41.html",
        "../2024/46.html",
        "../2024/47.html",
        "../2024/48.html",
        "../2024/49.html",
        "../2024/52.html",
        "../2024/54.html",
        "../2024/59.html",
        "../2024/63.html",
        "../2024/64.html",
        "../2024/66.html",
        "../2024/67.html",
        "../2024/68.html",
        "../2024/69.html",
        // … additional links …
    ]
};

export async function summarizeLegalDocuments(): Promise<LegalDocumentSummary[]> {
    const summaries: LegalDocumentSummary[] = [];
    const analyzerTool = await getLegalDocumentAnalyzerTool();
    const detailAnalyzerTool = await getCaseDetailAnalyzerTool();

    // Process each URL directly
    for (const relativeLink of SCRAPING_CONFIG.relativeLinks) {
        const url = SCRAPING_CONFIG.baseUrl + relativeLink.replace("../2024/", "");
        const docId = relativeLink.split('/').pop()?.replace('.html', '') || '';

        try {
            console.log(`\n🔄 Starting processing of document ${docId}...`);

            const response = await fetch(url, { headers: SCRAPING_CONFIG.headers });
            if (!response.ok) {
                console.warn(`Skipping ${url} - received status ${response.status}`);
                continue;
            }
            const html = await response.text();

            // Extract and clean text
            const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            const fullText = bodyMatch?.[1]
                ?.replace(/<[^>]+>/g, ' ')
                ?.replace(/&nbsp;/g, ' ')
                ?.replace(/\s+/g, ' ')
                ?.trim() || "";

            console.log(`📝 Document length: ${fullText.length} characters`);

            // Generate summary using OpenAI
            console.log(`🤖 Generating initial summary for ${docId}...`);
            const { toolCalls } = await callOpenAi({
                tools: { analyze: analyzerTool },
                prompt: `Analyze this legal document and provide a structured summary: ${fullText}`,
            });

            if (!toolCalls?.[0]?.args) {
                throw new Error(`Failed to get summary for document ${docId}`);
            }

            const summary = toolCalls[0].args as LegalDocumentSummary;
            summaries.push(summary);
            console.log(`✅ Successfully generated summary for document ${docId}`);

            // Add detailed analysis
            console.log(`🔍 Generating detailed analysis for ${docId}...`);
            const { toolCalls: detailToolCalls } = await callOpenAi({
                tools: { analyze: detailAnalyzerTool },
                prompt: `Provide a comprehensive analysis of this legal case: ${fullText}`,
            });

            if (!detailToolCalls?.[0]?.args) {
                throw new Error(`Failed to get detailed analysis for document ${docId}`);
            }

            const detailedAnalysis = detailToolCalls[0].args;
            summaries[summaries.length - 1].caseDetails = detailedAnalysis.caseDetails;
            console.log(`✅ Added detailed analysis for document ${docId}`);

            // Save after each successful document processing
            await saveSummaries(summaries);
            console.log(`💾 Saved progress - ${summaries.length} documents processed so far`);

        } catch (error) {
            console.error(`❌ Error processing document ${docId}:`, error);
        }
    }

    console.log(`\n🎉 Finished processing all documents. Total successful: ${summaries.length}`);
    return summaries;
}

async function saveSummaries(summaries: LegalDocumentSummary[]) {
    const outputPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(summaries, null, 2));
}