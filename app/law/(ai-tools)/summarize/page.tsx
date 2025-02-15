import { summarizeLegalDocuments } from '@/backend/server-actions/law/summarize/summarizeLegalDocs';
import { IoDocumentText } from 'react-icons/io5';
import { PageHeader } from '../../../../components/PageHeader';
import { ProcessCard } from '../../../../components/ProcessCard';

const pageData = {
    title: 'Legal Document Summarizer',
    description: 'Generate concise summaries of legal documents using AI',
    steps: [
        'Read legal documents from data/legal-documents',
        'Generate summaries using AI',
        'Save summaries to data/legal-summaries.json'
    ]
};

export default function SummarizePage() {
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    icon={IoDocumentText}
                    title={pageData.title}
                    description={pageData.description}
                />

                <ProcessCard
                    title="Process Steps"
                    steps={pageData.steps}
                />

                <form action={async () => {
                    'use server';
                    await summarizeLegalDocuments();
                }}>
                    <button
                        type="submit"
                        className="btn w-full mb-8 btn-primary"
                    >
                        Start Summarization
                    </button>
                </form>
            </div>
        </div>
    );
} 