'use server';

import { getCaseById } from '@/backend/server-actions/law/cases/getCaseById';
import { notFound } from 'next/navigation';
import { CaseDetailView } from './CaseDetailView';

interface PageProps {
    params: { id: string };
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

// Add type safety for params
export async function generateStaticParams() {
    return [
        { id: '1' },
        { id: '2' },
    ];
} 