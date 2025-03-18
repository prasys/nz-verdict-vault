export interface EmbeddedDocument {
    documentId: string;
    embedding: number[];
    metadata: {
        title: string;
        date: string;
        summary: string;
        keyTopics: string[];
    };
}

export class VectorStore {
    private documents: EmbeddedDocument[] = [];
    private static instance: VectorStore;

    private constructor() { }

    static getInstance(): VectorStore {
        if (!VectorStore.instance) {
            VectorStore.instance = new VectorStore();
        }
        return VectorStore.instance;
    }

    async addDocument(doc: EmbeddedDocument) {
        this.documents.push(doc);
    }

    async addDocuments(docs: EmbeddedDocument[]) {
        this.documents.push(...docs);
    }

    async search(queryEmbedding: number[], limit: number = 5): Promise<EmbeddedDocument[]> {
        return this.documents
            .map(doc => ({
                ...doc,
                similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }

    private cosineSimilarity(vec1: number[], vec2: number[]): number {
        if (vec1.length !== vec2.length) {
            throw new Error('Vectors must have the same length');
        }

        const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
        const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
        const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

        if (mag1 === 0 || mag2 === 0) return 0;
        return dotProduct / (mag1 * mag2);
    }

    clear() {
        this.documents = [];
    }

    getDocumentCount(): number {
        return this.documents.length;
    }
} 