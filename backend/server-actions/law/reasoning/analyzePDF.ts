// backend/server-actions/law/reasoning/analyzePDF.ts
'use server';
import { parsePDF } from '@/lib/pdfParser';
import { analyzeNarrative, identifyFramework, generateReasoning } from '@/lib/ai/legalAnalyzer';
import { AIToolError, ErrorCode } from '@/lib/error/errorHandler';

export async function uploadAndAnalyzePDF(file: File) {
  try {
    const text = await parsePDF(file);
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