import { embedLegalSummaries } from '@/backend/server-actions/law/embedding/embedLegalSummaries';
import { IoServer } from 'react-icons/io5';
import { PageHeader } from '../../../../components/PageHeader';
import { ProcessCard } from '../../../../components/ProcessCard';

const pageData = {
    title: 'Generate Legal Document Embeddings',
    description: 'Create embeddings from legal summaries for semantic search',
    steps: [
        'Read legal summaries from data/legal-summaries.json',
        'Generate embeddings using OpenAI',
        'Save embedded documents to data/embedded-summaries.json'
    ]
};

export default function EmbedPage() {
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    icon={IoServer}
                    title={pageData.title}
                    description={pageData.description}
                />

                <ProcessCard
                    title="Process Steps"
                    steps={pageData.steps}
                />

                <form action={async () => {
                    'use server';
                    await embedLegalSummaries();
                }}>
                    <button
                        type="submit"
                        className="btn w-full mb-8 btn-primary"
                    >
                        Start Embedding Process
                    </button>
                </form>
            </div>
        </div>
    );
} 