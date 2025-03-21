// Remove 'use server' from the top of the file

import { getCaseById } from '@/backend/server-actions/law/cases/getCaseById';
import { notFound } from 'next/navigation';
import { CaseDetailView } from './CaseDetailView';

// Change from interface to type and include searchParams
type PageProps = {
    params: { id: string };
    searchParams?: Record<string, string | string[] | undefined>;
}

export default async function CaseDetailPage({
    params,
}: PageProps) {
    const caseData = await getCaseById(params.id);

    if (!caseData) {
        notFound();
    }

    return <CaseDetailView caseData={caseData} />;
}

// Rest of your code remains the same