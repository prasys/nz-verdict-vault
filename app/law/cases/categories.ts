
import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '@/backend/server-actions/law/types';

export async function getCategories() {
    const summariesPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
    const summariesJson = await fs.readFile(summariesPath, 'utf-8');
    const cases: LegalDocumentSummary[] = JSON.parse(summariesJson);

    const categoryMap = new Map<string, number>();

    cases.forEach(caseItem => {
        caseItem.analysis.categories?.forEach(category => {
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });
    });

    return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
} 