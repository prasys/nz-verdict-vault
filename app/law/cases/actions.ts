'use server';

import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '@/backend/server-actions/law/types';
import { SearchParams } from './types';

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

export async function getCases(searchParams: SearchParams): Promise<LegalDocumentSummary[]> {
    const summariesPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
    const summariesJson = await fs.readFile(summariesPath, 'utf-8');
    const cases: LegalDocumentSummary[] = JSON.parse(summariesJson);

    return cases.filter(caseItem => {
        const matchesQuery = !searchParams.q ||
            caseItem.analysis.title.toLowerCase().includes(searchParams.q?.toLowerCase() || '') ||
            caseItem.analysis.summary.toLowerCase().includes(searchParams.q?.toLowerCase() || '') ||
            caseItem.analysis.keyTopics.some(topic =>
                topic.toLowerCase().includes(searchParams.q?.toLowerCase() || '')
            );

        const matchesCategory = !searchParams.category ||
            caseItem.analysis.categories?.some(category =>
                category.toLowerCase() === searchParams.category?.toLowerCase()
            );

        const matchesDate = !searchParams.date ||
            caseItem.analysis.date.includes(searchParams.date);

        return matchesQuery && matchesCategory && matchesDate;
    });
} 