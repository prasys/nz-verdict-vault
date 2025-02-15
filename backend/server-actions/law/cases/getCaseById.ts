'use server';

import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '../types';

export async function getCaseById(id: string): Promise<LegalDocumentSummary | null> {
    try {
        const summariesPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
        const summariesJson = await fs.readFile(summariesPath, 'utf-8');
        const summaries: LegalDocumentSummary[] = JSON.parse(summariesJson);

        return summaries.find(s => s.documentId === id) ?? null;
    } catch (error) {
        console.error('Error fetching case:', error);
        return null;
    }
} 