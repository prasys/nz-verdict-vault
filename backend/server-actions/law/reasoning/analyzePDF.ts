// backend/server-actions/law/reasoning/analyzePDF.ts
'use server';
import { parsePDF } from '@/lib/pdfParser';
import { analyzeNarrative, identifyFramework, generateReasoning } from '@/lib/ai/legalAnalyzer';
import { AIToolError, ErrorCode } from '@/lib/error/errorHandler';

export async function uploadAndAnalyzePDF(file: File) {
  try {
    console.log('Starting PDF analysis for file:', file.name);
    const text = await parsePDF(file);
    console.log('PDF parsed successfully, text length:', text.length);

    const narrative = await analyzeNarrative(text);
    console.log('Narrative analyzed:', narrative);

    const framework = await identifyFramework(text);
    console.log('Framework identified:', framework);

    const { reasoning, recommendation } = await generateReasoning(narrative, framework);
    console.log('Reasoning and recommendation generated:', { reasoning, recommendation });

    return {
      narrative,
      framework,
      reasoning,
      recommendation,
    };
  } catch (error) {
    console.error('Error in uploadAndAnalyzePDF:', error);
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