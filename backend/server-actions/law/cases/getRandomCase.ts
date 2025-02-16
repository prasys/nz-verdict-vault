'use server';

import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '../types';

export async function getRandomCase(): Promise<LegalDocumentSummary> {
    try {
        const summariesPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
        const summariesJson = await fs.readFile(summariesPath, 'utf-8');
        const summaries: LegalDocumentSummary[] = JSON.parse(summariesJson);

        // Get a random case
        const randomIndex = Math.floor(Math.random() * summaries.length);
        return summaries[randomIndex];
    } catch (error) {
        console.error('Error fetching random case:', error);
        throw new Error('Failed to fetch random case');
    }
} 