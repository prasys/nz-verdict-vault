// Remove any 'use server' directive that might be at the top

import { getCaseById } from '@/backend/server-actions/law/cases/getCaseById';
import { notFound } from 'next/navigation';
import { CaseDetailView } from './CaseDetailView';

// Define PageProps with a more flexible type
type PageProps = {
    params: { [key: string]: string | string[] | undefined };
}

export default async function CaseDetailPage({
    params,
}: PageProps) {
    const caseData = await getCaseById(params.id as string);

    if (!caseData) {
        notFound();
    }

    return <CaseDetailView caseData={caseData} />;
}