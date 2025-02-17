import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '@/backend/server-actions/law/types';
import CasesList from './CasesList';
import { SearchParams } from './types';

async function getCases(searchParams: SearchParams): Promise<LegalDocumentSummary[]> {
    const summariesPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
    const summariesJson = await fs.readFile(summariesPath, 'utf-8');
    const cases: LegalDocumentSummary[] = JSON.parse(summariesJson);

    return cases.filter(caseItem => {
        const matchesQuery = !searchParams.q ||
            caseItem.analysis.title.toLowerCase().includes(searchParams.q.toLowerCase()) ||
            caseItem.analysis.summary.toLowerCase().includes(searchParams.q.toLowerCase()) ||
            caseItem.analysis.keyTopics.some(topic =>
                topic.toLowerCase().includes(searchParams.q.toLowerCase())
            );

        const matchesCategory = !searchParams.category ||
            caseItem.analysis.categories?.some(category =>
                category.toLowerCase() === searchParams.category.toLowerCase()
            );

        const matchesDate = !searchParams.date ||
            caseItem.analysis.date.includes(searchParams.date);

        return matchesQuery && matchesCategory && matchesDate;
    });
}

export default async function CasesPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const cases = await getCases(searchParams);
    return <CasesList cases={cases} searchParams={searchParams} />;
}
