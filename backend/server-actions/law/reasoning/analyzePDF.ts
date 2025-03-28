// backend/server-actions/law/reasoning/analyzePDF.ts
import { parsePDF } from '@/lib/pdfParser';
import { analyzeNarrative, identifyFramework, generateReasoning } from '@/lib/ai/legalAnalyzer';
import { AIToolError, ErrorCode, handleAIToolError } from '@/lib/error/errorHandler';

export async function uploadAndAnalyzePDF(file: File) {
  try {
    // Parse the PDF
    const text = await parsePDF(file);

    // Analyze components
    const narrative = await analyzeNarrative(text);
    const framework = await identifyFramework(text);
    const { reasoning, recommendation } = await generateReasoning(narrative, framework);

    return {
      narrative,
      framework,
      reasoning,
      recommendation,
    };
  } catch (error) {
    if (error instanceof AIToolError) {
      throw error;
    }
    throw new AIToolError(
      'Failed to analyze PDF',
      ErrorCode.AI_REQUEST_FAILED,
      { timestamp: Date.now(), input: file.name }
    );
  }
}