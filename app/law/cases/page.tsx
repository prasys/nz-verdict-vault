import fs from 'fs/promises';
import path from 'path';
import { LegalDocumentSummary } from '@/backend/server-actions/law/types';
import CasesList from './CasesList';

async function getCases(): Promise<LegalDocumentSummary[]> {
    const summariesPath = path.join(process.cwd(), 'data', 'legal-summaries.json');
    const summariesJson = await fs.readFile(summariesPath, 'utf-8');
    return JSON.parse(summariesJson);
}

export default async function CasesPage() {
    const cases = await getCases();
    return <CasesList cases={cases} />;
}
