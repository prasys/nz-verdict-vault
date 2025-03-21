// Remove any 'use server' directive that might be at the top

import { getCaseById } from '@/backend/server-actions/law/cases/getCaseById';
import { notFound } from 'next/navigation';
import { CaseDetailView } from './CaseDetailView';

// Remove the custom PageProps type entirely

export default async function CaseDetailPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams?: Record<string, string | string[] | undefined>;
}) {
    const caseData = await getCaseById(params.id);

    if (!caseData) {
        notFound();
    }

    return <CaseDetailView caseData={caseData} />;
}