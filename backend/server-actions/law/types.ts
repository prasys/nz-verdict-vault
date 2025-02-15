export interface LegalDocumentSummary {
    documentId: string;
    url: string;
    analysis: {
        title: string;
        date: string;
        tribunal: string;
        summary: string;
        keyTopics: string[];
        keyPrinciples?: string[];
        decision?: {
            outcome: string;
            reasoning?: string;
            implications?: string[];
        };
        categories?: string[];
    };
    caseDetails?: {
        background: {
            context: string;
            preEvents: Array<{
                date: string;
                description: string;
                significance: string;
            }>;
            keyIssues: string[];
        };
        proceedings: {
            timeline: Array<{
                date: string;
                event: string;
                details: string;
                significance?: string;
            }>;
            evidence: Array<{
                type: string;
                description: string;
                significance: string;
            }>;
            arguments: {
                applicant: string[];
                respondent: string[];
            };
        };
        analysis: {
            legalPrinciples: Array<{
                principle: string;
                application: string;
                impact: string;
            }>;
            keyFindings: Array<{
                finding: string;
                reasoning: string;
                implications: string[];
            }>;
            precedentValue: string;
        };
        impact: {
            immediate: string[];
            longTerm: string[];
            societalImpact: string;
            recommendations?: string[];
        };
        relatedCases: Array<{
            citation: string;
            relevance: string;
            distinction?: string;
        }>;
    };
} 